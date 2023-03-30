const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
	street:{
		type:String,
		required:true
	},
	postal_code:{
		type:String,
		required:true
	},
	state:{
		type:mongoose.Schema.Types.ObjectId,
		required:true
	}  	
},{timestamps:true});

const Address = mongoose.model('Address', addressSchema);
module.exports = Address;
