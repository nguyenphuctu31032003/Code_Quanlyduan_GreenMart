const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    products: [
        {
            productId: {
                type: String,
                required: true,
            },
            productName: {
                type: String,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            image:{
                type:String,
                required:true
            },
            publisher:{
                type:String,
                required:true
            }
        },
    ],
    userName:{
      type:String,
      required:true,
    },
    address:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true,
    },
    totalAmount: {
        type: Number, // Tổng giá trị đơn hàng
        required: true,
    },
    paymentMethod: {
        type: String,
        default:'Tiền Mặt',
        required: true,
    },
    status:{
        type:Number,
        default:1,
        required:true
    },
    createdAt: {
        type: Date,
        default: Date.now, // Ngày tạo đơn hàng
    },
});

const Order = mongoose.model('order', orderSchema);

module.exports = Order;
