const LocalStrategy = require("passport-local").Strategy;
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const FacebookStrategy = require('passport-facebook')
const cryptoJs = require("crypto-js");
const Customer = require("../models/customer/Customer");
const Vendor = require("../models/vendor/Vendor");

const vendorAuthentication = async (email, password, done) => {
  try {
    const vendor = await Vendor.findOne({ email });
    if (!vendor) {
      return done(null, false, { message: "Invalid email address..." });
    }
    const hashedPassword = cryptoJs.AES.decrypt(
      vendor.password,
      process.env.CRYPTO_SECRET_KEY
    );
    const decryptedPassword = hashedPassword.toString(cryptoJs.enc.Utf8);

    if (decryptedPassword !== password) {
      return done(null, false, { message: "Password incorrect" });
    } else {
      return done(null, vendor);
    }
  } catch (err) {
    console.log(err.message);
  }
};

// const customerAuthentication = async (email, password, done) => {
//   try {
//     const customer = await Customer.findOne({ email });
//     if (!customer) {
//       return done(null, false, { message: "Invalid email address..." });
//     }
//     const hashedPassword = cryptoJs.AES.decrypt(
//       customer.password,
//       process.env.CRYPTO_SECRET_KEY
//     );
//     const decryptedPassword = hashedPassword.toString(cryptoJs.enc.Utf8);

//     if (decryptedPassword !== password) {
//       return done(null, false, { message: "Password incorrect" });
//     } else {
//       return done(null, customer);
//     }
//   } catch (err) {
//     console.log(err.message);
//   }
// };

// localStrategy init
const passportLocalVendorAuthInit = (passport) => {
  passport.use(
    "vendor",
    new LocalStrategy({ usernameField: "email" }, vendorAuthentication)
  );
  passport.serializeUser((vendor, done) => {
    done(null, vendor.id);
  });

  passport.deserializeUser((id, done) => {
    Vendor.findById(id, (err, vendor) => {
      done(err, vendor);
    });
  });
};

// const passportLocalCustomerAuthInit = (passport) => {
//   passport.use(
//     "customer",
//     new LocalStrategy({ usernameField: "email" }, customerAuthentication)
//   );
//   passport.serializeUser((customer, done) => {
//     done(null, customer.id);
//   });

//   passport.deserializeUser((id, done) => {
//     Customer.findById(id, (err, customer) => {
//       done(err, customer);
//     });
//   });
// };

module.exports = {
  // passportLocalCustomerAuthInit,
  passportLocalVendorAuthInit,
};
