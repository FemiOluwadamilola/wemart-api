const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema({
	state_name:{
		type:String,
		require:true
	}
},{timestamps:true});

const Customer_state = mongoose.model('Customer_state', stateSchema);

module.exports = Customer_state;