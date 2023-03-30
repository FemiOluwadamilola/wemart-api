const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    desc: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    cat: {
      type: String,
    },
    available_colors: {
      type: Array,
    },
    available_sizes: {
      type: Array,
    },
    price: {
      type: Number,
      required: true,
    },
    instock: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
