const express = require('express')
const router = express.Router()
const siteController = require('../app/controllers/SiteController')
const loginController = require('../app/controllers/LoginController')
const verifyToken = require('../middleware/verifyToken'); // Import the verifyToken middleware
router.get('/payment-sheet',siteController.payment)
router.get('/productsjson',siteController.showjson)
// router.get('/booksCategoryjson',siteController.showCategory)
router.get('/search',siteController.search)
router.get('/home',siteController.index)
router.get('/logout',loginController.logout)
router.post('/login',loginController.login)
router.get('/',loginController.index)
module.exports = router
