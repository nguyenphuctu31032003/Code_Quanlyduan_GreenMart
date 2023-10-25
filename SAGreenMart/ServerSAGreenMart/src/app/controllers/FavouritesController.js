const {mutipleMongooseToObject, mongooseToObject} = require("../../util/mongoose");
const Product = require("../models/Products");
const Favourite = require("../models/Favourite")
class FavouritesController {
    async addtofavourite(req, res, next) {
        try {
            const productId = req.body.productId;
            const userId = req.body.userId;
            const productName = req.body.productName;
            const category = req.body.category;
            const publisher = req.body.publisher;
            const price = req.body.price;
            const image = req.body.image;
            const existingFavourite = await Favourite.findOne({userId, productId});
            if (existingFavourite) {
                return res.status(400).json({message: 'Sản phẩm đã được thêm vào mục yêu thích'});
            }

            const newFavourite = new Favourite({userId, productId,productName,category,publisher,price,image});
            await newFavourite.save();

            res.status(201).json({message: 'Sản phẩm đã được thêm vào mục yêu thích'});
        } catch (error) {
            res.status(500).json({message: 'Có lỗi xảy ra khi thêm sản phẩm vào mục yêu thích'});
        }
    }
    async checkfavourite(req, res, next) {
        try {
            const userId = req.params.userId;
            const productId = req.params.productId;

            const existingFavourite = await Favourite.findOne({userId, productId});

            if (existingFavourite) {
                res.status(200).json({exists: true});
            } else {
                res.status(200).json({exists: false});
            }
        } catch (error) {
            res.status(500).json({message: 'Lỗi xảy ra khi kiểm tra sản phẩm trong mục yêu thích'});
        }
    }
    async list(req, res, next) {
        try {
            const userId = req.params.userId;
            const favorites = await Favourite.find({userId});

            res.json(favorites);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách yêu thích:', error);
            res.status(500).json({message: 'Có lỗi xảy ra khi lấy danh sách yêu thích'});
        }
    }

}

module.exports = new FavouritesController();
