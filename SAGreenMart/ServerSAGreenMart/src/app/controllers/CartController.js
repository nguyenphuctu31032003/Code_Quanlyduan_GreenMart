const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Cart = require('../models/Cart')
const Products = require('../models/Products')
class CartController {

    async addnew(req, res, next) {
        try {
            const {userId, productId, quantity} = req.body;

            // Tìm sản phẩm trong giỏ hàng của người dùng
            const cartItem = await Cart.findOne({userId: userId, productId: productId});
            if (cartItem) {
                // Sản phẩm đã tồn tại trong giỏ hàng, cập nhật số lượng
                cartItem.quantity += quantity;
                await cartItem.save();
                return res.json({message: 'Số lượng sản phẩm đã được cập nhật trong giỏ hàng.'});
            } else {
                // Sản phẩm chưa có trong giỏ hàng, thêm mới
                const product = await Products.findById(productId);
                if (!product) {
                    return res.status(404).json({message: 'Sản phẩm không tồn tại.'});
                }
                const newCartItem = new Cart({
                    userId: userId,
                    productId:productId,
                    name: product.name,
                    category: product.category,
                    publisher: product.publisher,
                    quantity: quantity,
                    price: product.price,
                    image: product.image,
                    description: product.description,
                });
                await newCartItem.save();
                return res.json({message: 'Sản phẩm đã được thêm vào giỏ hàng.'});
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({message: 'Lỗi server.'});
        }
    }

    async tang(req, res, next) {
        try {
            const productId = req.params.productId;
            const product = await Cart.findOne({ productId: productId });
            if (!product) {
                return res.status(404).json({ error: 'Sản phẩm không tồn tại' });
            }

            product.quantity += 1;
            await product.save();

            return res.json(product);
        } catch (error) {
            return res.status(500).json({ error: 'Lỗi server' });
        }
    }

    async giam(req,res,next){
        try {
            const productId = req.params.productId;
            const product = await Cart.findOne({ productId: productId });
            if (!product) {
                return res.status(404).json({ error: 'Sản phẩm không tồn tại' });
            }

            product.quantity -= 1;
            await product.save();

            return res.json(product);
        } catch (error) {
            return res.status(500).json({ error: 'Lỗi server' });
        }
    }
    async xoa(req,res,next){
        const productId = req.params.productId;
        try {
            const removedProduct = await Cart.findOneAndRemove({ productId: productId});
            if (!removedProduct) {
                return res.status(404).json({ error: 'Sản phẩm không tồn tại trong giỏ hàng' });
            }
            return res.json({ message: 'Sản phẩm đã được xoá khỏi giỏ hàng' });
        } catch (error) {
            return res.status(500).json({ error: 'Lỗi server' });
        }
    }
    async clearCart(req,res,next){
        try {
            const userId = req.params.userId;
            console.log(userId)
            await Cart.deleteMany({ userId: userId });

            res.json({ message: 'Cart has been cleared for the specified user' });
        } catch (error) {
            console.error('Error clearing cart:', error);
            res.status(500).json({ message: 'An error occurred while clearing the cart' });
        }
    }
    async showCart(req, res, next) {
        // const userId = req.params.userId;
        // try {
        //     // Tìm giỏ hàng dựa trên userId
        //     const cart = await Cart.find({});
        //     if (!cart) {
        //         return res.status(404).json({ message: 'Không tìm thấy giỏ hàng cho người dùng này.' });
        //     }
        //
        //     // Nếu tìm thấy, trả về thông tin giỏ hàng
        //     return res.status(200).json(cart);
        // } catch (error) {
        //     console.error(error);
        //     return res.status(500).json({ message: 'Có lỗi xảy ra khi tìm giỏ hàng.' });
        // }
        try {
            const userId = req.params.userId;

            // Sử dụng phương thức find để tìm tất cả các giỏ hàng của người dùng có userId tương ứng
            const carts = await Cart.find({ userId });

            res.json(carts);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Lỗi khi lấy thông tin giỏ hàng' });
        }
    }

    async delete(req, res, next) {
        try {
            const userId = req.params.userId;
            const productId = req.params.productId;

            // Xóa sản phẩm khỏi giỏ hàng của người dùng
            await Cart.findOneAndRemove({userid: userId, productId: productId});
            res.json({message: 'Sản phẩm đã được xóa khỏi giỏ hàng.'});
        } catch (error) {
            console.error(error);
            res.status(500).json({message: 'Lỗi server.'});
        }
    }



}

module.exports = new CartController();
