const mongoose = require('mongoose');

const favouriteSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    productId: {
        type: String,
        required: true,
    },
    productName:{
        type:String,
        required:true
    },
    category: {
        type: String,
        require: true,
    },
    publisher: {
        type: String,
        require: true,
    },
    price: {
        type:Number,
        require: true,
    },
    image: {
        type: String,
        require:true,
    },
    dateAdded: {
        type: Date,
        default: Date.now,
    },
},
    {
        timestamps: true,
    }
);

const Favourite = mongoose.model('favourite', favouriteSchema);

module.exports = Favourite;
