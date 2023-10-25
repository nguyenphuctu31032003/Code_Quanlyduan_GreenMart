const mongoose = require('mongoose');
const { model } = require("mongoose");
const uuid = require('uuid');
const randomId = uuid.v4();
const slug = require('mongoose-slug-generator');

mongoose.plugin(slug);

const Schema = mongoose.Schema;

const Categories = new Schema(
    {
        category: {
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
        image: {
            type: String,
            require:true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('categories', Categories);
