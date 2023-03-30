const mongoose = require('mongoose');

const layoutsSchema = new mongoose.Schema({
  storeId:{
  	 type:String,
  	 required:true
  },
  logo:{
    type:String
  },
  address:{
    type:String
  },
  slug:{
    type:String
  },
  description:{
    type:String
  },
  banner_image:{
  	 type:String
  },
  home_background_image:{
  	 type:String
  },

})

const Layouts = mongoose.model('Layouts', layoutsSchema);
module.exports = Layouts; 