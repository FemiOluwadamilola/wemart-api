const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
    },
    plan_type: {
      type: String,
    },
    code: {
      type: Number,
    },
    status: {
      type: Boolean,
      default: false,
    },
    payment_type: {
      type: String,
    },
  },
  { timestamps: true }
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);
module.exports = Subscription;
