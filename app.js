require('dotenv').load()

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session')
var RedisStore = require('connect-redis')(session)
var passport = require('passport')

var routes = require('./routes/index');
var users = require('./routes/users');
var auth = require('./routes/auth');
var themes = require('./routes/themes');
var graphql = require('./routes/graphql');
var admin = require('./routes/admin');
var models  = require('./models');

models.sequelize.sync()

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  store: new RedisStore({ url: process.env.REDIS_URL }),
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  name: 'mentor',
  resave: true,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())

app.use('/', routes);
app.use('/users', users);
app.use('/auth', auth)
app.use('/themes', themes)
app.use('/cms-new', admin)

// GraphQL
app.use('/graphql', graphql)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
