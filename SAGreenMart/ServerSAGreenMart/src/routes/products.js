const express = require('express')
const router = express.Router()
const booksController = require('../app/controllers/ProductsController')
router.get('/reviews/:book_id', booksController.listReviewsByBookId)
router.get('/reviews',booksController.listreviews)
router.get('/create', booksController.create)
router.post('/store',booksController.store)
router.put('/:id/update_quantity',booksController.updateQuantity)
router.put('/:id', booksController.update);
router.delete('/:id/delete', booksController.delete);
router.get('/productsjson/:id',booksController.showjsonOne)
router.get('/:slug',booksController.show)

// router.get('/',coursesController.index )
module.exports = router
