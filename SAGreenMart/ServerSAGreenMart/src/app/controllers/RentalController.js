const Rental = require("../models/Order");
const {mutipleMongooseToObject, mongooseToObject} = require("../../util/mongoose");
const Book = require("../models/Products");
const Order = require("../models/Order")
class RentalController {
    index(req, res, next) {
        Rental.find({})
            .sort({ status: 1, createdAt: -1 }) // Sắp xếp theo status giảm dần và ngày tạo giảm dần
            .then(orders => {
                console.log(orders)
                res.render('order/order', {
                    orders: mutipleMongooseToObject(orders)
                });
            })
            .catch(next);
    }

    create(req,res,next){
        res.render('order/create')
    }
    async postOrder(req, res, next) {
        try {
            const orderData = req.body;
            const newOrder = new Order(orderData);
            const savedOrder = await newOrder.save();
            res.status(201).json(savedOrder);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Lỗi khi thêm đơn hàng' });
        }
    }
    async search(req, res, next) {
        const keyword = req.query.keyword;
        try {
            // Sử dụng mô hình sách để tìm kiếm các cuốn sách dựa trên từ khóa
            const books = await Book.find({book_title: {$regex: keyword, $options: 'i'}});
            res.json(books);
        } catch (err) {
            console.error('Lỗi khi tìm kiếm sách:', err);
            res.status(500).json({error: 'Lỗi khi tìm kiếm sách.'});
        }
    }
    rentaljson(req,res,next){
        Rental.find({})
            .then(rentals => {
                res.json(rentals);
            })
            .catch(next);
    }
    async createRental(req, res, next) {
        Book.findOne({slug: req.params.slug})
            .then((rental) => {
                res.render('order/show.handlebars',{rental: mongooseToObject(rental)})
            })
            .catch(next)
    }

    showoneid(req,res,next){
        const formData = {
            book_title: req.body.book_title,
            name: req.body.description,
            phone: req.body.author_name,
            address: req.body.category_name,
            status: 1,
        };
        Rental.updateOne({_id: req.params.id},formData)
            .then((rental) => {
                res.redirect('/order');
            })
            .catch(next)
    }
    returnRental(req,res,next){
        const formdata = req.body
        formdata.status = 2;
        Rental.updateOne({_id: req.params.id},formdata)
            .then(
                res.redirect('/')
            )
            .catch(next)

    }
    delete(req, res, next) {
        const formData = {
            status: 2,
        };
        try {
            Rental.updateOne({ _id: req.params.id }, formData)
                .then((rental) => {
                    res.status(200).json({ message: 'Delete successful' });
                })
                .catch((error) => {
                    console.error(error);
                    res.status(500).json({ message: 'Server error' });
                });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }
    async myorder(req,res,next){
        try {
            const userId = req.params.userId;
            const orders = await Order.find({ userId }); // Tìm tất cả các đơn hàng có userId tương ứng

            if (!orders) {
                return res.status(404).json({ message: 'Không tìm thấy đơn hàng cho userId này.' });
            }

            res.status(200).json(orders);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách đơn hàng:', error);
            res.status(500).json({ message: 'Có lỗi xảy ra khi lấy danh sách đơn hàng.' });
        }
    }
    async blacklist(req, res, next) {
        try {
            const currentDate = new Date();
            const overdueRentals = await Rental.find({
                status: 1,
                createdAt: { $lte: currentDate }
            });

            const overdueRentalsFiltered = overdueRentals.filter(rental => {
                const rentalDays = Math.floor((currentDate - rental.createdAt) / (1000 * 60 * 60 * 24));
                return rentalDays > rental.rental_days;
            });
            // res.json(overdueRentalsFiltered)
            res.render('order/blacklist', {
                overdueRentalsFiltered: mutipleMongooseToObject(overdueRentalsFiltered)
            });
            console.log(overdueRentalsFiltered)
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }


    }

}

module.exports = new RentalController();
