const mongoose = require("mongoose");

const cashRegisterSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    order_details: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = cashRegisterSchema;
