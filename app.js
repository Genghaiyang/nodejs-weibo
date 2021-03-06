
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var partials = require('express-partials'); 
var MongoStore = require('connect-mongo')(express);
var settings = require('./settings');
var flash = require('connect-flash');


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.bodyParser());
app.use(flash());
app.use(express.cookieParser());
app.use(express.session({
secret: settings.cookieSecret,
store: new MongoStore({
db: settings.db
})
}));
app.use(function (req, res, next) {
  res.locals.user = req.session.user ? req.session.user : null;
  res.locals.success = req.flash('success').toString();
  res.locals.error = req.flash('error').toString();
  next();
});
app.use(partials());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}




routes(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
//routes(app);