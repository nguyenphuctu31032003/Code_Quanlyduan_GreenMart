const Order = require("../models/Order");
const Product = require("../models/Products");
const path = require("path");
const fs = require("fs");
const ExcelJS = require('exceljs');
class RevenueController {
    index(req, res, next) {
        res.render('revenues/show')
    }

    revenue(req, res, next) {
        res.render('revenues/revenues')
    }

    async total(req, res, next) {
        try {
            const revenueData = await Product.aggregate([
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: { $multiply: ['$price', '$rented'] } }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        totalRevenue: 1
                    }
                }
            ]);

            res.status(200).json(revenueData[0]); // Send the total revenue as a single object
        } catch (error) {
            console.error('Error calculating total revenue:', error);
            res.status(500).json({ message: 'Error calculating total revenue' });
        }
    }

    async day(req, res, next) {
        try {
            const { date } = req.query;
            const startDate = new Date(date);
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 1);

            const result = await Product.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: startDate,
                            $lt: endDate
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
                        },
                        totalRevenue: { $sum: { $multiply: ['$price', '$rented'] } },
                    },
                },
                {
                    $sort: { _id: 1 },
                },
            ]);

            res.json(result);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred' });
        }
    }


    async month(req, res, next) {
        try {
            const { month, year } = req.query;
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0);

            const result = await Product.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: startDate,
                            $lte: endDate
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
                        },
                        totalRevenue: { $sum: { $multiply: ['$price', '$rented'] } },
                    },
                },
                {
                    $sort: { _id: 1 },
                },
            ]);

            res.json(result);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred' });
        }
    }

    async year(req, res, next) {
        try {
            const { year } = req.query;
            const revenueData = await Product.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: new Date(`${year}-01-01T00:00:00.000Z`),
                            $lt: new Date(`${parseInt(year) + 1}-01-01T00:00:00.000Z`)
                        }
                    }
                },
                {
                    $group: {
                        _id: {},
                        totalRevenue: { $sum: { $multiply: ['$price', '$rented'] } }
                    }
                }
            ]);

            res.json(revenueData[0]); // Send the total revenue as a single object
        } catch (error) {
            res.status(500).json({ error: 'An error occurred' });
        }
    }

    async getRentalsByDate(req, res, next) {
        try {
            const { date } = req.query;

            const startDate = new Date(date);
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 1);

            const Orders = await Order.find({
                createdAt: {
                    $gte: startDate,
                    $lt: endDate
                }
            });
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Orders');

            // Khai báo các cột tương ứng với thuộc tính trong dữ liệu rentals
            worksheet.columns = [
                { header: 'Order_id', key: '_id', width:30 },
                { header: 'Phone', key: 'phone', width:30 },
                { header: 'Name', key: 'name' , width:30 },
                { header: 'Address', key: 'address', width:50  },
                { header: 'Product Id', key: 'product_id' , width:30 },
                { header: 'Product Name', key: 'product_name', width:50 },
                { header: 'Image', key: 'image' , width:30 },
                { header: 'Status', key: 'status' , width:10},
                { header: 'Category', key: 'category', width:20},
                { header: 'Publisher', key: 'publisher' , width:10},
                { header: 'Price', key: 'price', width:30},
                { header: 'UpdatedAt', key: 'updatedAt' , width:30 },
                { header: 'CreatedAt', key: 'createdAt' , width:30 },
                { header: 'Total Payment', key: 'total_payment' , width:30 },
                { header: 'Payment', key: 'payment' , width:30 },

            ];
            worksheet.columns.forEach(column => {
                column.style = {alignment: { horizontal: 'center' }};
            });
            worksheet.getRow(1).font = { bold: true };
            worksheet.getRow(1).alignment = {horizontal:'center'};
            Orders.forEach(Order => {
                worksheet.addRow(Order);
            });
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=Orders_${date}.xlsx`);

            const buffer = await workbook.xlsx.writeBuffer();
            res.send(buffer)

        } catch (error) {
            console.error('Error getting Orders by date:', error);
            res.status(500).json({ error: 'An error occurred' });
        }
    }
    async getRentalsByMonth(req, res, next) {
        try {
            const { year, month } = req.query;
            const startDate = new Date(`${year}-${month}-01`);
            const endDate = new Date(startDate);
            endDate.setMonth(endDate.getMonth() + 1);

            const Orders = await Order.find({
                createdAt: {
                    $gte: startDate,
                    $lt: endDate
                }
            });

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Orders');

            worksheet.columns = [
                { header: 'Order_id', key: '_id', width:30 },
                { header: 'Phone', key: 'phone', width:30 },
                { header: 'Name', key: 'name' , width:30 },
                { header: 'Address', key: 'address', width:50  },
                { header: 'Product Id', key: 'product_id' , width:30 },
                { header: 'Product Name', key: 'product_name', width:50 },
                { header: 'Image', key: 'image' , width:30 },
                { header: 'Status', key: 'status' , width:10},
                { header: 'Category', key: 'category', width:20},
                { header: 'Publisher', key: 'publisher' , width:10},
                { header: 'Price', key: 'price', width:30},
                { header: 'UpdatedAt', key: 'updatedAt' , width:30 },
                { header: 'CreatedAt', key: 'createdAt' , width:30 },
                { header: 'Total Payment', key: 'total_payment' , width:30 },
                { header: 'Payment', key: 'payment' , width:30 },
            ];

            worksheet.columns.forEach(column => {
                column.style = {alignment: { horizontal: 'center' }};
            });

            worksheet.getRow(1).font = { bold: true };
            worksheet.getRow(1).alignment = { horizontal: 'center' };

            Orders.forEach(Order => {
                worksheet.addRow(Order);
            });

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=Orders_${year}_${month}.xlsx`);

            const buffer = await workbook.xlsx.writeBuffer();
            res.send(buffer);
        } catch (error) {
            console.error('Error getting Orders by month:', error);
            res.status(500).json({ error: 'An error occurred' });
        }
    }


}
module.exports = new RevenueController();
