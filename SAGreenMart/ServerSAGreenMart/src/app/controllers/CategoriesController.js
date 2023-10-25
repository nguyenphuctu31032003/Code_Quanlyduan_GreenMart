const Categories = require('../models/Categories');
const {v2: cloudinary} = require("cloudinary");
const {CloudinaryStorage} = require("multer-storage-cloudinary");
const multer = require("multer");
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


class SiteController {
    showCategoriesJson(req,res,next){
            Categories.find({})
                .then(categories =>{
                    res.json(categories)
                })
                .catch(next)
    }
    addnew(req,res,next){
        upload.single('image')(req, res, (err) => {
            if (err) {
                console.log('dfghj'+ err.message);
                return res.status(500).json({ message: 'Lỗi khi tải lên hình ảnh' });
            }

            const formData = req.body;
            if (req.file && req.file.path) {
                formData.image = req.file.path;
            } else {
                console.log('Không tìm thấy tệp hình ảnh hoặc đường dẫn.');
            }
            const categories = new Categories(formData);
            categories.save()
                .then(() => {
                    res.status(200)
                    res.send('OK')
                })
                .catch(error => {
                    res.status(500).json({ message: 'Lỗi khi lưu sách vào cơ sở dữ liệu' });
                });
        });
    }
}

module.exports = new SiteController();

