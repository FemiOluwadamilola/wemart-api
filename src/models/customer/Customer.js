const mongoose = require("mongoose");
// const passportLocalMongoose = require("passport-local-mongoose");
const customerSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// customerSchema.plugin(passportLocalMongoose);
const Customer = mongoose.model("Customer", customerSchema);
module.exports = Customer;
