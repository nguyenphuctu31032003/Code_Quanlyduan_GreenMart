const express = require('express')
const router = express.Router()
const favouriteController = require('../app/controllers/FavouritesController')
router.get('/checkfavourite/:userId/:productId',favouriteController.checkfavourite)
router.get('/list/:userId',favouriteController.list)
router.post('/:userId',favouriteController.addtofavourite)
module.exports = router
