const mongoose = require('mongoose');
const { model } = require("mongoose");
const uuid = require('uuid');
const randomId = uuid.v4();
const slug = require('mongoose-slug-generator');

mongoose.plugin(slug);

const Schema = mongoose.Schema;

const Reviews = new Schema(
    {
        book_id: {
            type: String,
            require: true,
        },
        user_id: {
            type: String,
            require: true,
        },
        comment: {
            type: String,
            require: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('reviews', Reviews);
