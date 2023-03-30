const router = require('express').Router();
const Vendor = require('./models/Vendor');
const Store = require('./models/Store');
const layouts = require('./models/Store_layouts');
const verifyAuth = require('../../middlewares/verifyAuth');

router.put('/:id/setup', verifyAuth, async (req,res) => {
   try{
     // STORE CUSTOM LAYOUT SETUP
	const vendorId = await Vendor.findById(req.user.id)

   }catch(err){
   	 res.status(500).json({err_message:err.message})
   }
})

module.exports = router;