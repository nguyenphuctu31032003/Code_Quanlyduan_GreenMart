const mongoose = require('mongoose');
const { model } = require("mongoose");
const uuid = require('uuid');
const randomId = uuid.v4();
const slug = require('mongoose-slug-generator');

mongoose.plugin(slug);

const Schema = mongoose.Schema;

const User = new Schema(
    {
        phone: {
            type: String,
            require: true,
        },
        password: {
            type: String,
            require: true,
        },
        name: {
            type: String,
        },
        gender: {
            type: String,
        },
        date_of_birth: {
            type: String,
        },
        address: {
            type: String,
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
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('users', User);
