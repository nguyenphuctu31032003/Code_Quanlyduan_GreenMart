const Product = require('../models/Products');
const {mutipleMongooseToObject} = require('../../util/mongoose')
const stripe = require('stripe')('sk_test_51NYvWgCR3NrTG1MlNqoc6baH9lRETIQrQJoNLnRKl3l2HmxQCxUuaKcT3BFJvw6QzYx8IbjZXaZO0p0jYmW5hzFz005J4YrXiB')

class SiteController {
    index(req,res,next){
        Product.find({})
            .then(products =>{
                res.render('home',{
                    products: mutipleMongooseToObject(products)
                })
            })
            .catch(next)// no giong nhu : error => next(error)
    }
    // [GET]  -> /json
    async payment(req, res, next) {
        // Use an existing Customer ID if this is a returning customer.
        const {amount, currency} = req.body
        const customer = await stripe.customers.create();
        const ephemeralKey = await stripe.ephemeralKeys.create(
            {customer: customer.id},
            {apiVersion: '2022-11-15'}
        );
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: currency,
            customer: customer.id,
            payment_method_types: ['card'],
        });

        res.json({
            paymentIntent: paymentIntent.client_secret,
            ephemeralKey: ephemeralKey.secret,
            customer: customer.id,
        });
    }
     showjson(req, res, next) {
        Product.find({})
            .then(products =>{
                res.json(products)
            })
            .catch(next)
    }


    async search(req, res, next) {
        const searchTerm = req.query.search;

        try {
            // Thực hiện truy vấn tìm kiếm trong MongoDB
            const results = await Product.find({ name: { $regex: searchTerm, $options: 'i' } });

            res.render('home', { books: results });
        } catch (error) {
            console.error(error);
            res.status(500).json({error: 'Lỗi tìm kiếm'});
        }
    }
    // showCategory(req,res,next){
    //         Book.distinct('category_name')
    //             .then(categories => {
    //                 res.json(categories);
    //             })
    //             .catch(err => {
    //                 console.error('Lỗi truy vấn MongoDB:', err);
    //                 res.status(500).send('Lỗi truy vấn MongoDB');
    //             });
    // }
}

module.exports = new SiteController();
