const Book = require('../models/Products');
const Review = require('../models/Reviews')
const {mongooseToObject, mutipleMongooseToObject} = require("../../util/mongoose");
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Librarian = require("../models/Librarian");
const uuid = require('uuid');
const randomId = uuid.v4();

cloudinary.config({
    cloud_name: 'dgopadx4m',
    api_key: '339872193617915',
    api_secret: 'dYh9C2LIIc9_Tda9Gh6adnCmrsI'
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'book-images',
        allowed_formats: ['jpg', 'jpeg', 'png'],
        }
});

const upload = multer({ storage: storage });

class ProductsController {
    // [GET]  -> /courses/:slug
    show(req, res, next) {
        Book.findOne({slug: req.params.slug})
            .then((book) => {
                res.render('books/show.handlebars',{book: mongooseToObject(book)})
            })
            .catch(next)
    }
    // [GET]  -> /courses/create
    create(req,res,next){
        res.render('books/create')
    }
    store(req, res, next) {
        upload.single('image')(req, res, async (err) => {
            if (err) {
                // Xử lý lỗi nếu có
                console.log(err);
                return res.status(500).json({message: 'Lỗi khi tải lên hình ảnh'});
            }

            const formData = req.body;
            console.log(formData)
            formData.image = req.file.path;
            const name = formData.name;
            const existingBook = await Book.findOne({name});
            if (existingBook) {
                return res.status(400)
            }

            const book = new Book(formData);
            book.save()
                .then(() => {
                    res.status(200)
                    res.send('OK')
                })
                .catch(error => {
                    console.log(error);
                    res.status(500).json({message: 'Lỗi khi lưu sách vào cơ sở dữ liệu'});
                });
        });
    }
    async updateQuantity(req, res, next) {
        const { _id: productId, quantity } = req.body;
        try {
            const updatedProduct = await Book.findOneAndUpdate(
                { _id: productId },
                { $set: { quantity: quantity } },
                { new: true }
            );

            if (!updatedProduct) {
                return res.status(404).json({ message: 'Product not found' });
            }

            res.status(200).json({ message: 'Product quantity updated successfully' });
        } catch (error) {
            console.error('Error updating book quantity:', error);
            res.status(500).json({ message: 'Error updating book quantity' });
        }
    }
    showjsonOne(req, res, next) {
        const bookId = req.params.id; // Assuming the ID is passed as a URL parameter

        Book.findById(bookId)
            .then(book => {
                if (!book) {
                    return res.status(404).json({ message: 'Book not found' });
                }

                res.json(book);
            })
            .catch(next);
    }

    update(req, res, next) {
        upload.single('image')(req, res, async (err) => {
            if (err) {
                // Xử lý lỗi nếu có
                console.log(err);
                return res.status(500).json({message: 'Lỗi khi tải lên hình ảnh'});
            }

            const formData = req.body;
            // Nếu có file ảnh mới được gửi lên, cập nhật đường dẫn ảnh trong formData
            if (req.file) {
                formData.image = req.file.path;
            }// Cập nhật thông tin sách trong cơ sở dữ liệu
            const quantity = formData.quantity;
            const price = formData.price;
            if (quantity<=0 || price < 1000) {
                return res.status(400).json({message: 'valitdate sai'});
            }
            Book.updateOne({_id: req.params.id}, formData)
                .then(() => {
                    return res.status(200).json({ success: true, message: 'Cập nhật thành công' });
                })
                .catch(next);

        });
    }
    listreviews(req,res,next){
        Review.find({})
            .then(reviews =>{
                res.json(reviews)
            })
            .catch(next)
    }
    listReviewsByBookId(req, res, next) {
        const { book_id } = req.params; // Lấy book_id từ request body hoặc request parameter (tùy thuộc vào cách bạn truyền dữ liệu)

        Review.find({ book_id })
            .then(reviews => {
                res.json(reviews);
            })
            .catch(next);
    }
    async delete(req, res, next) {
        try {
            // Find the course by ID and delete it
            const book = await Book.findByIdAndDelete(req.params.id);

            if (!book) {
                return res.status(404).json({message: 'Book not found'});
            }
            res.status(200).json({ message: 'Delete successful' });

        } catch (error) {
            console.error(error);
            res.status(500).json({message: 'Server error'});
        }
    }

}

module.exports = new ProductsController();
