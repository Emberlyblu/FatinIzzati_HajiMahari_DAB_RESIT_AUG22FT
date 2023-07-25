require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
const session = require('express-session');
const { passport } = require('../FatinIzzati_HajiMahari_DAB_RESIT_AUG22FT/middlewares/authMiddleware');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var vehiclesRouter = require('./routes/vehicles');
var featuresRouter = require('./routes/features');
var typesRouter = require('./routes/types');

var db = require("../FatinIzzati_HajiMahari_DAB_RESIT_AUG22FT/models");

db.sequelize.sync({force: false })
.catch((err) => 
console.error("Unable to connect to the database:", err));


var app = express();

app.use(session({ secret: 'this is a secret', resave: false, saveUninitialized: true }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/vehicles', vehiclesRouter);
app.use('/features', featuresRouter);
app.use('/types', typesRouter);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

