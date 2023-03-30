const mongoose = require("mongoose");
// const passportLocalMongoose = require("passport-local-mongoose");
const vendorSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    store_id: {
      type: mongoose.Schema.Types.ObjectId,
    },
    social_medias: {
      type: Array,
    },
    customers: {
      type: Array,
    },
    products: {
      type: Array,
    },
    subscription_plan: {
      type: mongoose.Schema.Types.ObjectId,
    },
    referralId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);
const Vendor = mongoose.model("Vendor", vendorSchema);
module.exports = Vendor;
