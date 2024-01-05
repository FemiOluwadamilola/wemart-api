const cryptoJs = require("crypto-js");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const uuid = require("uuid").v4();
const Store = require("../../models/store/Store");
const Product = require("../../models/vendor/Product");
const {
  fetchVendor,
  createVendor,
  removeVendor,
} = require("../../services/vendor/vendor");
const logger = require("../../logger/index");
const { fetchProducts } = require("../../services/vendor/product");
require("dotenv").config();

const log = logger.child({
  id: uuid,
});

const signup = async (req, res) => {
  const { firstname, lastname, email, phone } = req.body;
  try {
    const checkVendor = await fetchVendor({ email });
    if (checkVendor) {
      log.warn(
        `Email address provided is already in use by ${checkVendor.name}`,
        {
          method: req.method,
          route: req.path,
          user_ip: req.socket.remoteAddress,
        }
      );
      res.status(403).json({
        message: "Oops sorry this email already in use",
      });
    } else {
      const referralId = Math.random().toString(36).slice(2);
      const newVendor = createVendor({
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
      log.info("Vendor account successfully created", {
        vendorId: created_vendor.id,
        method: req.method,
        route: req.path,
        user_ip: req.socket.remoteAddress,
      });
      return res.status(200).json({
        status: 200,
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
    log.error(err.message, {
      route: req.path,
      method: req.method,
    });
    return res.status(500).json({
      message: "Server error: something went wrong, please try again later",
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
    const vendor = await fetchVendor({ email: req.body.email });
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

        log.info("Vendor signin authentication successful.", {
          vendorId: vendor.id,
          method: req.method,
          route: req.path,
          user_ip: req.socket.remoteAddress,
        });
        return res.status(200).json({
          status: 200,
          message: "Signin successful!",
          accessToken,
          refreshToken,
        });
      } else {
        log.warn("Incorrect password provided by the vendor", {
          vendorId: vendor.id,
          route: req.path,
          method: req.method,
          user_ip: req.socket.remoteAddress,
        });

        return res.status(403).json({
          message: "Password incorrect",
        });
      }
    } else {
      log.warn(
        "Email address provided by the vendor does't match with database",
        {
          route: req.path,
          user_ip: req.socket.remoteAddress,
        }
      );
      return res.status(403).json({
        message: "Incorrect email",
      });
    }
  } catch (err) {
    log.error(err.message, {
      route: req.path,
      method: req.method,
    });
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
    const confirmUserByEmail = Vendor.findOne({ email: req.body.email });
    if (!confirmUserByEmail) {
      return res.status(403).json({ message: "Invalid email address" });
    } else {
      Vendor.findByIdAndUpdate(confirmUserByEmail.id, {
        $set: {
          password: cryptoJs.AES.encrypt(
            req.body.password,
            process.env.CRYPTO_SECRET_KEY
          ).toString(),
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

const deleteAccount = async (req, res) => {
  try {
    removeVendor(req.user.id);
    await Store.findOneAndDelete({ vendorId: req.user.id });
    await Product.findOneAndDelete({ vendorId: req.user.id });
    log.info(`Store account was deleted by ${req.user.firstname}`, {
      method: req.method,
      route: req.path,
      user_ip: req.socket.remoteAddress,
    });
    res.status(200).json({
      message: "Account deleted...",
    });
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
  deleteAccount,
  // login,
};
