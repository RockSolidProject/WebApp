require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var mongoDB = process.env.MONGODB_LINK

mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var indexRouter = require('./routes/index');
var userRoutes = require('./routes/userRoutes');
var climbingAreaRoutes = require('./routes/climbingAreaRoutes')
var climbingRouteRoutes = require('./routes/climbingRouteRoutes')
var routeConnectionRoutes = require('./routes/routeConnectionRoutes')
var groupRoutes = require('./routes/groupRoutes');
var eventRoutes = require('./routes/eventRoutes');
var climbingCenterRoutes = require('./routes/climbingCenterRoutes')
var climbingCenterRateComment = require('./routes/climbingCenterRateCommentRoutes');

var app = express();

var cors = require('cors');
var allowedOrigins = ['http://localhost:5173', 'http://localhost:3001'];
app.use(cors({
  credentials: true,
  origin: function(origin, callback){
    // Allow requests with no origin (mobile apps, curl)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin)===-1){
      var msg = "The CORS policy does not allow access from the specified Origin.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


/**
 * Vključimo session in connect-mongo.
 * Connect-mongo skrbi, da se session hrani v bazi.
 * Posledično ostanemo prijavljeni, tudi ko spremenimo kodo (restartamo strežnik)
 */

app.use('/', indexRouter);
app.use('/users', userRoutes);
app.use('/climbingAreas', climbingAreaRoutes)
app.use('/climbingRoutes', climbingRouteRoutes)
app.use('/routeConnections', routeConnectionRoutes)
app.use('/groups', groupRoutes)
app.use('/events', eventRoutes)
app.use('/climbingCenter', climbingCenterRoutes);
app.use('/centerConnections', climbingCenterRateComment);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).json({ error: err.message });
});

module.exports = app;
