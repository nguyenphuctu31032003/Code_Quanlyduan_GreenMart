const express = require('express');
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const methodOverride = require('method-override')
const path = require("path");
const app = express();
const port = 4848;
const route = require('./routes')
const db = require('./config/db')
const LoginController = require('../src/app/controllers/LoginController')
const cookieParser = require('cookie-parser');
const verifyToken = require('./middleware/verifyToken');
app.use(cookieParser());
const Handlebars = require('handlebars');

Handlebars.registerHelper('calculateDaysOverdue', function(createdAt, rentalDays) {
  const currentDate = new Date();
  const rentalDate = new Date(createdAt);
  const daysOverdue = Math.floor((currentDate - rentalDate) / (1000 * 60 * 60 * 24)) - rentalDays;
  return daysOverdue > 0 ? (daysOverdue+1) : "Không có người nào";
});


Handlebars.registerHelper('role', function (role) {
  return role;
});
Handlebars.registerHelper('eq', function (value1, value2) {
  return value1 === value2;
});


function starsHelper(rate, options) {
  let stars = '';
  for (let i = 0; i < Math.floor(rate); i++) {
    stars += options.fn();
  }
  if (rate % 1 >= 0.5) {
    stars += options.fn();
  }
  return stars;
}
function formatDate(timestamp) {
  try {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleString();
    return formattedDate;
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
}

// Register the formatDate helper function with Handlebars
Handlebars.registerHelper('formatDate', formatDate);

Handlebars.registerHelper('stars', starsHelper);
Handlebars.registerHelper('math', function (lvalue, operator, rvalue, options) {
  lvalue = parseFloat(lvalue);
  rvalue = parseFloat(rvalue);

  return {
    '+': lvalue + rvalue,
    '-': lvalue - rvalue,
    '*': lvalue * rvalue,
    '/': lvalue / rvalue,
    '%': lvalue % rvalue
  }[operator];
});
Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
  switch (operator) {
    case '==':
      return (v1 == v2) ? options.fn(this) : options.inverse(this);
    case '===':
      return (v1 === v2) ? options.fn(this) : options.inverse(this);
    case '!=':
      return (v1 != v2) ? options.fn(this) : options.inverse(this);
    case '!==':
      return (v1 !== v2) ? options.fn(this) : options.inverse(this);
    case '<':
      return (v1 < v2) ? options.fn(this) : options.inverse(this);
    case '<=':
      return (v1 <= v2) ? options.fn(this) : options.inverse(this);
    case '>':
      return (v1 > v2) ? options.fn(this) : options.inverse(this);
    case '>=':
      return (v1 >= v2) ? options.fn(this) : options.inverse(this);
    case '&&':
      return (v1 && v2) ? options.fn(this) : options.inverse(this);
    case '||':
      return (v1 || v2) ? options.fn(this) : options.inverse(this);
    default:
      return options.inverse(this);
  }
});
Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
  return (arg1 === arg2) ? options.fn(this) : options.inverse(this);
});
//connect to db
db.connect()
app.use(express.static(path.join(__dirname,'public')))
// 2 dòng dưới sẽ nhận được dữ liệu log ra từ phương thức post
app.use(express.urlencoded({
  extended:true
})) // middleware xử lý dữ liệu từ form submit lên
app.use(express.json())
//ghi đè phương thức
app.use(methodOverride('_method'))
// HTTP logger
// app.use(morgan('combined')); // bật log
// Template engine
app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.set('views',path.join(__dirname,'resource/views'))
console.log("PATH: "+path.join(__dirname,'resource/views'))
//route init
route(app);
app.listen(port, () => {
  console.log(`App listening http://localhost:${port}`);
});
