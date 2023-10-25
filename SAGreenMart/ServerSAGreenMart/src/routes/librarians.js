const express = require('express')
const router = express.Router()
const librariansController = require('../app/controllers/LibrariansController')
router.get('/create', librariansController.create)
router.post('/store', librariansController.store)
router.delete('/:id/delete', librariansController.delete);
router.put('/:id', librariansController.update);
router.get('/:slug',librariansController.show)
router.get('/',librariansController.index)
module.exports = router
