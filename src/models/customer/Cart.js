const mongoose = require('mongoose');
const cartSchema = new mongoose.Schema({
    customerId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    products:[
        {
          productId:{
              type:String
          },
          quantity:{
              type:Number,
              default:1
          }
        }
    ]
},{
    timestamps:true
})

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;