const Librarian = require('../models/Librarian');
const {mongooseToObject, mutipleMongooseToObject} = require("../../util/mongoose");
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Book = require("../models/Products");

// Cấu hình Cloudinary
cloudinary.config({
    cloud_name: 'dgopadx4m',
    api_key: '339872193617915',
    api_secret: 'dYh9C2LIIc9_Tda9Gh6adnCmrsI'
});

// Cấu hình Multer Storage để lưu trữ tệp hình ảnh trên Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'book-images', // Thư mục lưu trữ trên Cloudinary
        allowed_formats: ['jpg', 'jpeg', 'png'], // Định dạng hình ảnh cho phép
    }
});

// Khởi tạo middleware Multer
const upload = multer({ storage: storage });

class LibrariansController {
    index(req,res,next){
        Librarian.find({})
            .then(librarians =>{
                res.render('librarian',{
                    librarians: mutipleMongooseToObject(librarians)
                })
            })
            .catch(next)// no giong nhu : error => next(error)
    }
    create(req,res,next){
        res.render('librarians/create')
    }
    store(req, res, next) {
        upload.single('image')(req, res, async (err) => {
            if (err) {
                // Xử lý lỗi nếu có
                console.log(err);
                return res.status(500).json({message: 'Lỗi khi tải lên hình ảnh'});
            }


            const formData = req.body;
            if (req.file) {
                formData.image = req.file.path;
            }
            try {
                // Kiểm tra xem người dùng đã tồn tại hay chưa
                const phone = req.body.phone
                const password = req.body.password
                const existingLibrarian = await Librarian.findOne({phone});
                if (existingLibrarian) {
                    return res.status(400).json({ message: 'Người dùng đã tồn tại!' });
                }

                // Mã hoá mật khẩu của người dùng
                formData.password = await bcrypt.hash(password, 10)
                const librarian = new Librarian(formData);
                await librarian.save();
                // Tạo token sau khi đăng ký thành công
                const token = jwt.sign({ _id: librarian._id }, 'vietlong-secret-key');

                // Trả về token và thông báo đăng ký thành công
                res.status(200).json({ success: true, message: 'Đăng ký thành công!', token });
            } catch (error) {
                console.log(error);
                return res.status(500).json({ success: false, message: 'Có lỗi khi thêm thủ thư. Vui lòng thử lại!' });
            }


        });
    }
    // [GET]  -> /librarians/:slug
    show(req, res, next) {
        Librarian.findOne({slug: req.params.slug})
            .then((librarian) => {
                res.render('librarians/show',{librarian: mongooseToObject(librarian)})
            })
            .catch(next)
    }
    update(req, res, next) {
        upload.single('image')(req, res, async (err) => {
            if (err) {
                // Xử lý lỗi nếu có
                console.log(err);
                return res.status(500).json({message: 'Lỗi khi tải lên hình ảnh'});
            }

            const formData = req.body;
            // Kiểm tra trùng lặp số điện thoại trước khi cập nhật
            const existingLibrarian = await Librarian.findOne({ phone: formData.phone });
            if (existingLibrarian && existingLibrarian._id.toString() !== req.params.id) {
                return res.status(400).json({ message: 'Số điện thoại đã tồn tại cho một thủ thư khác' });
            }
            // Nếu có file ảnh mới được gửi lên, cập nhật đường dẫn ảnh trong formData
            if (req.file) {
                formData.image = req.file.path;
            }// Cập nhật thông tin sách trong cơ sở dữ liệu
            Librarian.updateOne({_id: req.params.id}, formData)
                .then(() => {
                    return res.status(200).json({ success: true, message: 'Cập nhật thành công' });
                })
                .catch(error => {
                    console.log(error);
                    return res.status(500).json({ success: false, message: 'Có lỗi khi cập nhật. Vui lòng thử lại' });
                });

        });
    }
    async delete(req, res, next) {
        try {
            const librarian = await Librarian.findByIdAndDelete(req.params.id);

            if (!librarian) {
                return res.status(404).json({message: 'Librarian not found'});
            }
            res.status(200).json({ message: 'Delete successful' });

        } catch (error) {
            console.error(error);
            res.status(500).json({message: 'Server error'});
        }
    }


}

module.exports = new LibrariansController();
