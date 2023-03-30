const mongoose = require('mongoose');

const customerAddressSchema = new mongoose.Schema({
   customerId:{
   	  type:mongoose.Schema.Types.ObjectId,
   },
   addressId:{
   	type:mongoose.Schema.Types.ObjectId,
   }
},{timestamps:true});

const Customer_address = mongoose.model('Customer_address', customerAddressSchema);
module.exports = Customer_address;
