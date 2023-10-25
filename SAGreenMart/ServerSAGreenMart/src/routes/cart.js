const express = require('express')
const router = express.Router()
const cartController = require('../app/controllers/CartController')
router.delete('/clear/:userId',cartController.clearCart)
router.delete('/remove-from-cart/:userId/:productId',cartController.delete)
// Tăng số lượng sản phẩm
router.put('/increase/:productId', cartController.tang);
// Giảm số lượng sản phẩm
router.put('/decrease/:productId', cartController.giam);
router.delete('/remove/:productId',cartController.xoa)
router.get('/showcart/:userId',cartController.showCart)
router.post('/addtocart',cartController.addnew)
module.exports = router
