var model = app.model,
    validate = app.validation.validate,
    stringify = require('csv-stringify'),
    _ = require('lodash');

module.exports = function (router) {
    function getReport(clicks) {
        var oneMonthAgo = new Date();
        oneMonthAgo.setHours(0, 0, 0, 0);
        oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);

        var clicksPerDay = _(clicks).filter(function (click) {
            return click.timestamp >= oneMonthAgo;
        }).groupBy(function (click) {
            return click.timestamp.getDate() + '/' + (click.timestamp.getMonth() + 1);
        }).map(function (x, day) {
            return {day: day, count: x.length};
        }).value();

        var devices = _(clicks).groupBy('device').map(function (x, agent) {
            return {device: agent, count: x.length};
        }).value();
        return {
            clicksCount: clicks.length,
            clicksPerDay: clicksPerDay,
            devices: devices
        };
    }

    function getLocalTimeFormat(date, timezone) {
        date.setHours(date.getHours() + timezone)
        return date.toISOString().replace(/T/, ' ').replace(/\..+/, '');
    }

    router.get('/reports/pages/:id', function (req, res, next) {
        model.TrackedClick.find({page: req.params.id}).sort('timestamp').exec(function (err, clicks) {
            if (err) {
                return next(Error.create('An error occurred trying get the page\'s report.', {id: req.params.id}, err));
            }
            res.json(getReport(clicks));
        });
    });

    router.get('/reports/customPages/:id', function (req, res, next) {
        model.TrackedClick.find({customPage: req.params.id}, function (err, clicks) {
            if (err) {
                return next(Error.create('An error occurred trying get the page\'s report.', {id: req.params.id}, err));
            }
            res.json(getReport(clicks));
        });
    });

    router.get('/reports/pages/:id/download', function (req, res, next) {
        model.TrackedClick.find({page: req.params.id})
            .populate(['page'])
            .exec(function (err, clicks) {
                if (err) {
                    return next(Error.create('An error occurred trying get the page\'s report.', {id: req.params.id}, err));
                }
                var header = ['IP', 'Hora', 'Dispositivo', 'Pagina', 'Referencia', 'Agent'];
                var dataArray = _.map(clicks, function (click) {
                    return [
                        click.ipAddress,
                        getLocalTimeFormat(click.timestamp, req.company.timezone),
                        click.device,
                        click.page.name,
                        click.valueReference,
                        click.agent
                    ];
                });
                dataArray.unshift(header);

                stringify(dataArray, {delimiter: ';'}, function (err, data) {
                    if (err) {
                        return next(Error.create('An error occurred trying get the page\'s report.', {id: req.params.id}, err));
                    }
                    res.set('Content-Type', 'text/csv');
                    res.setHeader('Content-disposition', 'attachment; filename=' + clicks[0].page.name + ' ' + getLocalTimeFormat(new Date(), req.company.timezone) + '.csv');
                    res.send(data);
                });
            });
    });

    router.get('/reports/customPages/:id/download', function (req, res, next) {
        model.CustomPageValue.find({customPage: req.params.id}, function (err, values) {
            if (err) {
                return next(Error.create('An error occurred trying get the page\'s report.', {id: req.params.id}, err));
            }
            model.TrackedClick.find({customPage: req.params.id})
                .populate(['customPage'])
                .exec(function (err, clicks) {
                    if (err) {
                        return next(Error.create('An error occurred trying get the page\'s report.', {id: req.params.id}, err));
                    }
                    var header = ['IP', 'Hora', 'Dispositivo', 'Pagina', 'Referencia', 'Agent'];
                    _.forEach(_.range(1, 16), function (x) {
                        header.push('Param ' + x);
                    });
                    var dataArray = _.map(clicks, function (click) {
                        var value = _.find(values, function (x) {
                                return x._id.equals(click.valueReference);
                            }) || {};
                        return [
                            click.ipAddress,
                            getLocalTimeFormat(click.timestamp, req.company.timezone),
                            click.device,
                            click.customPage.name,
                            click.valueReference,
                            click.agent,
                            value.parameter1,
                            value.parameter2,
                            value.parameter3,
                            value.parameter4,
                            value.parameter5,
                            value.parameter6,
                            value.parameter7,
                            value.parameter8,
                            value.parameter9,
                            value.parameter10,
                            value.parameter11,
                            value.parameter12,
                            value.parameter13,
                            value.parameter14,
                            value.parameter15
                        ];
                    });
                    dataArray.unshift(header);

                    stringify(dataArray, {delimiter: ';'}, function (err, data) {
                        if (err) {
                            return next(Error.create('An error occurred trying get the page\'s report.', {id: req.params.id}, err));
                        }
                        res.set('Content-Type', 'text/csv');
                        res.setHeader('Content-disposition', 'attachment; filename=' + clicks[0].customPage.name + ' ' + getLocalTimeFormat(new Date(), req.company.timezone) + '.csv');
                        res.send(data);
                    });
                });
        });
    });

    return router;
};
