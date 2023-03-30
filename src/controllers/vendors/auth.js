const cryptoJs = require("crypto-js");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const uuid = require("uuid").v4();
const Vendor = require("../../models/vendor/Vendor");
const logger = require("../../middlewares/logger");
require("dotenv").config();

const signup = async (req, res) => {
  const { firstname, lastname, email, phone } = req.body;
  try {
    const checkVendor = await Vendor.findOne({ email });
    if (checkVendor) {
      // res.status(403).json({
      //   message: "Oops sorry this email already in use...",
      // });
      logger.warn("Oops sorry this email already in use...");
    } else {
      const referralId = Math.random().toString(36).slice(2);
      const newVendor = new Vendor({
        firstname,
        lastname,
        email,
        phone,
        referralId,
        password: cryptoJs.AES.encrypt(
          req.body.password,
          process.env.CRYPTO_SECRET_KEY
        ).toString(),
      });
      const created_vendor = await newVendor.save();
      return res.status(200).json({
        message: "success",
        request: {
          method: "PUT",
          description: "SETUP STORE",
          url: `${process.env.URL}/vendors/store`,
          referral_link: `${process.env.URL}/vendors/referra?ref=${created_vendor.referralId}`,
        },
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: "Server error: something went wrong, please try again later",
      error: err.message,
    });
  }
};

const generateAccessToken = (vendor) => {
  return jwt.sign(
    { id: vendor.id, email: vendor.email },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
};

const generateRefreshToken = (vendor) => {
  return jwt.sign(
    { id: vendor.id, email: vendor.email },
    process.env.JWT_FRESH_SECRET
  );
};

const signin = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ email: req.body.email });
    if (vendor) {
      const hashedPassword = cryptoJs.AES.decrypt(
        vendor.password,
        process.env.CRYPTO_SECRET_KEY
      );
      const decryptedPassword = hashedPassword.toString(cryptoJs.enc.Utf8);
      if (decryptedPassword === req.body.password) {
        const accessToken = generateAccessToken(vendor);
        const refreshToken = generateRefreshToken(vendor);

        refreshTokens.push(refreshToken);

        res.status(200).json({
          message: "Signin successfully!",
          accessToken,
          refreshToken,
        });
      } else {
        // return res.status(403).json({
        //   message: "Incorrect password!",
        // });
        logger.warn("Incorrect password!", {
          userIpAddress: req.ip,
        });
      }
    } else {
      return res.status(403).json({
        message: "Incorrect email",
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: "Server error: something went wrong, please try again later",
      error: err.message,
    });
  }
};

let refreshTokens = [];

const refreshToken = (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken)
    return res.status(401).json({
      message: "You are not authenticated",
    });

  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json({
      message: "Refresh token is not valid!",
    });
  }

  jwt.verify(refreshToken, process.env.JWT_FRESH_SECRET, (err, user) => {
    if (err) throw err.message;
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    refreshTokens.push(newRefreshToken);

    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  });
};

const logout = (req, res, next) => {
  // const refreshToken = req.body.token;
  // refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
  // return res.status(200).json({
  //   message: "You logged out successfully...",
  // });
};

const forgotPassword = async (req, res) => {
  try {
    // forgot password functionality...
  } catch (err) {
    return res.status(500).json({
      message: "Server error: something went wrong, please try again later",
      error: err.message,
    });
  }
};

// const login = (req, res, next) => {
//   passport.authenticate("vendor", {
//     successRedirect: "/dashboard",
//     failureRedirect: "/login",
//     // failureFlash: true,
//   })(req, res, next);
// };

module.exports = {
  signup,
  signin,
  refreshToken,
  logout,
  forgotPassword,
  // login,
};
