// express modules
var express = require('express'),
    favicon = require('static-favicon'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    cookieSession = require('cookie-session');

var justhtml = require('justhtml'),
    path = require('path');

var errorHandler = require('./errorHandler');
var routeHandler = require('./routeHandler');

var server = module.exports;

server.start = function () {
    var api = app.api = express();
    api.set('port', app.config.server.port);

    // view engine setup
    api.set('views', path.join(__dirname + '../../../public/views'));
    api.set("view options", {layout: false});
    api.engine('html', justhtml.__express);
    api.set('view engine', 'html');

    api.use(favicon());
    api.use(logger('dev'));
    api.use(bodyParser.json());
    api.use(bodyParser.urlencoded());
    api.use(cookieParser('MIIL9AYJKoZIhvcNAQcCoIIL5TCCC+ECAQExADALBgkqhkiG='));
    api.use(cookieSession({ secret: 'MIIL9AYJKoZIhvcNAQcCoIIL5TCCC+ECAQExADALBgkqhkiG=' }));
    api.use(express.static(path.join(__dirname, '../../public')));

    // App route handler (private and public api)
    routeHandler(api);

    // Load Modules
    require('../../routes/')();

    // Errors
    api.use(errorHandler);

    /// catch 404 and forwarding to error handler
    api.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

/// error handlers

// development error handler
// will print stacktrace
    if (api.get('env') === 'development') {
        api.use(function (err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }

// production error handler
// no stacktraces leaked to user
    api.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });

    api.listen(api.get('port'), function () {
        console.log(app.config.info.title + ' started at port ' + api.get('port'));
    });
};