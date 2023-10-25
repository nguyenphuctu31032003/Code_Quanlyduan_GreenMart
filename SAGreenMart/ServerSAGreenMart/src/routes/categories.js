const express = require('express')
const router = express.Router()
const categoriesController = require('../app/controllers/CategoriesController')
router.get('/categoriesjson', categoriesController.showCategoriesJson)
router.post('/addnew', categoriesController.addnew)
module.exports = router
