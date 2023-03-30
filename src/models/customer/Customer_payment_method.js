const mongoose = require('mongoose');

const payment_methodSchema = new mongoose.Schema({

});

const Customer_payment_method = mongoose.model('Customer_payment_method', payment_methodSchema);
module.exports = Customer_payment_method;