const cryptoJs = require("crypto-js");
// const passport = require("passport");
// const jwt = require("jsonwebtoken");
const Store = require("../../models/store/Store");
const Customer = require("../../models/customer/Customer");
const Vendor = require("../../models/vendor/Vendor");

// CUSTOMER SIGNUP TO VENDOR STORE
const signup = async (req, res) => {
  const storename = req.vhost[0];
  const store = await Store.findOne({ name: storename });
  if (store) {
    try {
      const vendor = await Vendor.findOne({ store_id: store.id });
      if (vendor) {
        if (vendor.customers.includes(req.body.email)) {
          return res.status(403).json({
            message: "sorry this email address already in use!",
            error: 403,
          });
        } else {
          const newCustomer = new Customer({
            username: req.body.username,
            email: req.body.email,
            password: cryptoJs.AES.encrypt(
              req.body.password,
              process.env.CRYPTO_SECRET_KEY
            ).toString(),
          });
          const savedCustomer = await newCustomer.save();
          if (!vendor.customers.includes(savedCustomer.email)) {
            await vendor.updateOne({
              $push: { customers: savedCustomer.email },
            });
            const { password, ...data } = savedCustomer._doc;
            res.status(200).json({
              message: "registration successfully made...",
              data,
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
    return res.status(404).json({
      message: "page not found!",
      error: 404,
    });
  }
};

// CUSTOMER SIGNIN TO VENDOR PAGE
const signin = async (req, res) => {
  const storename = req.vhost[0];
  const store = await Store.findOne({ name: storename });
  if (storename === store.name) {
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
