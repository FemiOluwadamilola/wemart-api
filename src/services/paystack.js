const axios = require('axios');
const Vendor = require('../models/vendor/Vendor');
const initializePaystackPayment = async (req,res,next) => {
	const {email,amount} = req.body;
 try{
 	const api = process.env.paystack_url;
 	const paystack_secret = process.env.paystack_secret_key
   const res = await axios.post(`${api}/transaction/initialize`,{email,amount},{
   	 headers:{
   	 	Authorization:`Bearer ${paystack_secret}`,
   	 	'Content-type':'application/json'
   	 }
   })
   return res.status(200).json(res);
   next();
 }catch(err){
 	return console.log(err.message);
 }
}

// VENDOR SUBSCRIPTION PLAN
const initializePaystackSubscription = async (req,res,nex) => {
	const {plan} = req.body;
	try{
	   const vendor = await Vendor.findById(req.user.id);
	   if(vendor){
	   	  const api = process.env.paystack_url;
		 	const paystack_secret = process.env.paystack_secret_key
		   const {data} = await axios.post(`${api}/subscription`,{email:vendor.email, plan},{
		   	 headers:{
		   	 	Authorization:`Bearer ${paystack_secret}`,
		   	 	'Content-type':'application/json'
		   	 }
		   })
   return res.status(200).json(data);
   next();
	   }
	}catch(err){
		return console.error(err.response);
	}
}

module.exports = {
  initializePaystackPayment,
  initializePaystackSubscription
}