const mongoose = require('mongoose');
const { model } = require("mongoose");
const uuid = require('uuid');
const randomId = uuid.v4();
const slug = require('mongoose-slug-generator');

mongoose.plugin(slug);

const Schema = mongoose.Schema;

const Librarian = new Schema(
    {
        name: {
            type: String,
            require: true,
        },
        gender: {
            type: String,
            require: true,
        },
        date_of_birth: {
            type: String,
            require: true,
        },
        address: {
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
        phone: {
            type:String,
            require: true,
        },
        image: {
            type: String,
            require:true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: Number,
            required: true,
            default: 0, // 0: quyền người dùng, 1: quyền admin
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('librarians', Librarian);
