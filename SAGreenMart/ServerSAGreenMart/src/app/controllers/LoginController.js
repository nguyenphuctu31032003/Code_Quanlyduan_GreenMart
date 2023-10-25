const Librarian = require('../models/Librarian');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class LoginController {
    index(req, res, next) {
        res.render('layouts/login', { layout: 'loginLayout' });
    }

    async login(req, res, next) {
        const { phone, password } = req.body;

        try {
            // Tìm thủ thư theo số điện thoại
            const librarian = await Librarian.findOne({ phone });

            if (!librarian) {
                // Không tìm thấy tài khoản
                res.status(401).send('Tài khoản không tồn tại!');
                return;
            }
            // Kiểm tra mật khẩu
            const isValidPassword = await bcrypt.compare(password, librarian.password);
            if (!isValidPassword) {
                // Mật khẩu không chính xác
                res.status(401).send('Mật khẩu không chính xác!');
                return;
            }else{
                req.librarian = {
                    _id: librarian._id,
                    role: librarian.role
                }
                res.redirect('home');
            }


        } catch (error) {
            console.error('Error:', error);
            res.status(500).send('Đã xảy ra lỗi khi đăng nhập!');
        }
    }


    logout(req, res, next) {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error:', err);
                res.status(500).send('Đã xảy ra lỗi khi đăng xuất!');
            } else {
                res.redirect('/login');
            }
        });
    }
}

module.exports = new LoginController();
