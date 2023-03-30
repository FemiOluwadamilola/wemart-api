const mongoose = require('mongoose');

const payment_typeSchema = new mongoose.Schema({

});

const Customer_payment_type = mongoose.model('Customer_payment_type', payment_typeSchema);
module.exports = Customer_payment_type;