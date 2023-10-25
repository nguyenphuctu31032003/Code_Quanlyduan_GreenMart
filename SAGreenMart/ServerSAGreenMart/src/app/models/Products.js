const mongoose = require('mongoose');
const { model } = require("mongoose");
const uuid = require('uuid');
const randomId = uuid.v4();
const slug = require('mongoose-slug-generator');

mongoose.plugin(slug);

const Schema = mongoose.Schema;

const Products = new Schema(
    {
        name: {
            type: String,
            require: true,
        },
        category: {
            type: String,
            require: true,
        },
        publisher: {
            type: String,
            require: true,
        },
        random: {
            type: String,
            default: () => randomId
        },
        slug: {
            type: String,
            slug:['name','random']
        },
        quantity: {
            type:Number,
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
        description:{
            type:String,
            require:true
        },
        rented:{
            type:Number,
            require:true,
            default:0
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('products', Products);
