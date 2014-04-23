var fs = require('fs'),
    async = require('async');

module.exports.init = function () {
    var api = app.api;

    var ignoreList = ['.DS_Store'];

    api.private.get('/', function (req, res, next) {
        fs.readFile('./public/views/index.html', function (err, data) {
            if (err) {
                return next(Error.create('An error occurred trying load the dashboard', null, err));
            }

            // 1. Filters
            fs.readdir('./public/filters', function (err, files) {
                if (err) {
                    return next(Error.create('An error occurred trying to load the filters', null, err));
                }

                var filters = files.filter(function (f) {
                    return !_.contains(ignoreList, f);
                }).map(function (f) {
                    return '<script src="filters/' + f + '" type="text/javascript"></script>'
                });

                // 2. Services
                fs.readdir('./public/services', function (err, files) {
                    if (err) {
                        return next(Error.create('An error occurred trying to load the services.', null, err));
                    }

                    var services = files.filter(function (f) {
                        return !_.contains(ignoreList, f);
                    }).map(function (f) {
                        return '<script src="services/' + f + '" type="text/javascript"></script>'
                    });

                    // 3. Directives
                    fs.readdir('./public/directives', function (err, files) {
                        if (err) {
                            return next(Error.create('An error occurred trying to load the directives.', null, err));
                        }

                        var directives = files.filter(function (f) {
                            return !_.contains(ignoreList, f);
                        }).map(function (f) {
                            if (f.indexOf('.js') != -1) {
                                return '<script src="directives/' + f + '" type="text/javascript"></script>';
                            }

                            return '<script src="directives/' + f + '/index.js" type="text/javascript"></script>';
                        });

                        // 4. Controls
                        fs.readdir('./client-side/controls', function (err, files) {
                            if (err) {
                                return next(Error.create('An error occurred trying to load the controls.', null, err));
                            }

                            var controls = files.filter(function (f) {
                                return !_.contains(ignoreList, f);
                            }).map(function (f) {
                                return '<script src="controls/' + f + '/index.js" type="text/javascript"></script>';
                            });

                            // 5. Controllers
                            fs.readdir('./public/controllers', function (err, files) {
                                if (err) {
                                    return next(Error.create('An error occurred trying to load the services.', null, err));
                                }

                                var steps = files.filter(function (f) {
                                    return !_.contains(ignoreList, f);
                                }).filter(function (f) {
                                    return !_.contains(f, '.js');
                                }).map(function (f) {
                                    return function (finish) {
                                        fs.readdir('./client-side/controllers/' + f, function (err, files) {
                                            if (!files || err) {
                                                return finish(err);
                                            }

                                            finish(null, files.filter(function (f) {
                                                return !_.contains(ignoreList, f);
                                            }).map(function (file) {
                                                return f + '/' + file;
                                            }));
                                        });
                                    }
                                });

                                async.parallel(steps, function (err, result) {
                                    var controllerFiles = result.join().split(',');

                                    if (err) {
                                        return next(Error.create('An error occurred trying to load the controllers.', null, err));
                                    }

                                    var controllers = controllerFiles.map(function (f) {
                                        return '<script src="controllers/' + f + '" type="text/javascript"></script>';
                                    });

                                    data = data.toString().replace(/<%filters%>/, filters.join('\n'));
                                    data = data.toString().replace(/<%services%>/, services.join('\n'));
                                    data = data.toString().replace(/<%directives%>/, directives.join('\n'));
                                    data = data.toString().replace(/<%controls%>/, controls.join('\n'));
                                    data = data.toString().replace(/<%controllers%>/, controllers.join('\n'));

                                    res.set('Content-Type', 'text/html');
                                    res.send(data);
                                })
                            });
                        });
                    });
                });
            });
        });
    });

    loadModules();
};

function loadModules() {
    // Loading modules dynamically
    var modules = fs.readdirSync('./api')
        .filter(function (e) {
            return e.indexOf('.') == -1 && e.indexOf("api.") == -1;
        });

    modules.forEach(function (e) {
        console.log('Loading module ' + e + '...');
        require('./' + e).init();
    });
}
