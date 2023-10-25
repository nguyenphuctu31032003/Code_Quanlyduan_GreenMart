module.exports = {
    mutipleMongooseToObject: function (mongooseArrays){ // truong hop 1 mang
        return mongooseArrays.map(mongoose => mongoose.toObject())
    },
    mongooseToObject: function (mongooseArrays){ // truong hop 1 object
        return mongooseArrays ? mongooseArrays.toObject() : mongooseArrays
    },

}
