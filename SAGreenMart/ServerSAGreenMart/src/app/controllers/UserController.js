const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const User = require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = 'vietlong-secret-key';


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

class UserController {
    async register(req, res, next) {
        const {phone, password, name, address,identifier} = req.body;
        try {
            // Kiểm tra xem người dùng đã tồn tại chưa
            const existingUser = await User.findOne({phone});
            if (existingUser) {
                return res.status(400).json({message: 'User already exists'});
            }
            // Tạo mật khẩu băm
            const hashedPassword = await bcrypt.hash(password, 10);

            // Tạo người dùng mới
            const newUser = new User({phone, password: hashedPassword,name,address,identifier});
            await newUser.save();

            res.status(201).json({message: 'User created'});
        } catch (error) {
            res.status(500).json({message: 'Something went wrong'});
            console.log(error)
        }
    }
    async login(req,res,next){
        const { phone, password } = req.body;

        try {
            // Kiểm tra xem người dùng có tồn tại không
            const user = await User.findOne({ phone });
            if (!user) {
                return res.status(400).json({ message: 'User not found' });
            }

            // So sánh mật khẩu
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({ message: 'Invalid password' });
            }

            // Tạo token
            const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });

            res.json({ token });
        } catch (error) {
            res.status(500).json({ message: 'Something went wrong' });
            console.log(error)
        }
    }
    async findById(req, res, next) {
        const userId = req.params.id;
        try {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({message: 'User not found'});
            }

            // Trả về thông tin người dùng
            res.json(user);
        } catch (error) {
            res.status(500).json({message: 'Something went wrong'});
        }
    }
}

module.exports = new UserController();
