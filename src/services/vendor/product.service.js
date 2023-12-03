const Product = require("../../models/vendor/Product");

const fetchProducts = async (query) => {
  try {
    const products = await Product.find(query);
    return products;
  } catch (err) {
    throw Error(err);
  }
};

const addProduct = async (query) => {
  try {
    const product = new Product(query);
    return product;
  } catch (err) {
    throw Error(err);
  }
};

const removeProduct = async (query) => {
  try {
    const product = await Product.findOneAndDelete(query);
    return product;
  } catch (err) {
    throw Error(err);
  }
};

const fetchProduct = async (query) => {
  try {
    const product = await Product.findOne(query);
    return product;
  } catch (err) {
    throw Error(err);
  }
};

module.exports = {
  fetchProducts,
  fetchProduct,
  addProduct,
  removeProduct,
};
