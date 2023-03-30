const Vendor = require("../models/vendor/Vendor");
const ensureVendorAuthenticated = async (req, res, next) => {
  const vendor = await Vendor.findOne(req.vendor);
  if (vendor) {
    return next();
  }
  res.status(401).redirect("/login");
};

// const alreadyAuthenticated = (req, res, next) => {
//   if (req.isAuthenticated()) {
//     return res.redirect("/dashboard");
//   }
//   return next();
// };

module.exports = {
  ensureVendorAuthenticated,
  // alreadyAuthenticated,
};
