const productRoute = require('./products')
const siteRouter = require('./site')
const librariansRouter = require('./librarians')
const categoriesRouter = require('./categories')
const usersRouter = require('./users')
const rentalRouter = require('./order')
const revenueRouter = require('./revenue')
const loginRouter = require('./login')
const cartRoute = require('./cart')
const favouriteRoute = require('./favourites')

function route(app){
    app.use('/favourite',favouriteRoute)
    app.use('/cart',cartRoute)
    app.use('/login',loginRouter)
    app.use('/revenue',revenueRouter)
    app.use('/order',rentalRouter)
    app.use('/users',usersRouter)
    app.use('/products/categories',categoriesRouter)
    app.use('/librarians',librariansRouter)
    app.use('/products',productRoute)
    app.use('/',siteRouter)
}
module.exports = route
