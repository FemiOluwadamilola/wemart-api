const Vendor = require("../../models/vendor/Vendor");

// AUTHENTICATION DB SERVICES
const fetchVendor = async (query) => {
  try {
    const vendor = await Vendor.findOne(query);
    return vendor;
  } catch (err) {
    throw Error(err.message);
  }
};

const createVendor = (query) => {
  try {
    const vendor = new Vendor(query);
    return vendor;
  } catch (err) {
    throw Error(err.message);
  }
};

const vendorById = async (query) => {
  try {
    const vendor = await Vendor.findById(query);
    return vendor;
  } catch (err) {
    throw Error(err.message);
  }
};

const removeVendor = async (query) => {
  try {
    const vendor = await Vendor.findByIdAndRemove(query);
    return vendor;
  } catch (err) {
    throw Error(err.message);
  }
};

module.exports = {
  fetchVendor,
  createVendor,
  vendorById,
  removeVendor,
};
