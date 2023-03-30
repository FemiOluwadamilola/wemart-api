const mongoose = require('mongoose');

const categoriesSchema = new mongoose.Schema({

});

const Product_categories = mongoose.model("Product_categories", categoriesSchema);
module.exports = Product_categories;