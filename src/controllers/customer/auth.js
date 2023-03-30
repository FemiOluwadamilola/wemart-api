const cryptoJs = require("crypto-js");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const Store = require("../../models/store/Store");
const Customer = require("../../models/customer/Customer");
const Vendor = require("../../models/vendor/Vendor");

// CUSTOMER SIGNUP TO VENDOR STORE
const signup = async (req, res) => {
  const storename = req.vhost[0];
  const { username, email } = req.body;
  const store = await Store.findOne({ store_name: storename });
  if (store.name === storename) {
    try {
      const vendor = await Vendor.findOne({ store_id: store.id });
      if (vendor) {
        const customer = await Customer.findOne({ email });
        if (vendor.customers.includes(customer.id)) {
          return res.status(403).json({
            message: "sorry email already register to this store!",
            error: 403,
          });
        } else {
          const newCustomer = new Customer({
            username,
            email,
            password: cryptoJs.AES.encrypt(
              req.body.password,
              process.env.CRYPTO_SECRET_KEY
            ).toString(),
          });
          const savedCustomer = await newCustomer.save();
          if (!vendor.customers.includes(savedCustomer.id)) {
            await vendor.updateOne({ $push: { customers: savedCustomer.id } });
            res.status(200).json({
              message: "registration successfully made...",
              savedCustomer,
            });
          }
        }
      }
    } catch (err) {
      return res.status(500).json({
        message: "Server error: something went wrong, please try again later",
        error: err.message,
      });
    }
  } else {
    return res.status(400).json({
      message: "page not found!",
      error: 400,
    });
  }
};

// CUSTOMER SIGNIN TO VENDOR PAGE
const signin = async (req, res) => {
  const storename = req.vhost[0];
  const store = await Store.findOne({ store_name: storename });
  if (store.name === storename) {
    try {
      const customer = await Customer.findOne({ email: req.body.email });
      if (customer) {
        const hashedPassword = cryptoJs.AES.decrypt(
          customer.password,
          process.env.CRYPTO_SECRET_KEY
        );
        const decryptedPassword = hashedPassword.toString(cryptoJs.enc.Utf8);
        if (decryptedPassword === req.body.password) {
          // const token = jwt.sign(
          //   { id: customer.id, email: customer.email },
          //   process.env.JWT_SECRET,
          //   { expiresIn: "1h" }
          // );
          res.status(200).json({
            message: "Signin successfully!",
          });
        } else {
          return res.status(403).json({
            message: "Incorrect password!",
          });
        }
      } else {
        return res.status(403).json({
          message: "this email is not register",
        });
      }
    } catch (err) {
      return res.status(500).json({
        message: "Server error: something went wrong, please try again later",
        error: err.message,
      });
    }
  } else {
    return res.status(404).json({
      message: "Page not found!",
    });
  }
};

// const signin = async (req,res,next) => {
// 	try{
// 		 passport.authenticate('local',{
// 		    successRedirect:'',
// 		    failureRedirect:'/signin',
// 		    failureFlash:true
// 	  })(req,res,next);
// 	}catch(err){
// 		 return res.status(500).json({
// 		 	 message:'Server error: something went wrong, please try again later',
// 		 	 error:err.message
// 		 })
// 	}
// }

module.exports = {
  signup,
  signin,
};
