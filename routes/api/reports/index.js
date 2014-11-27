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
            return { day: day, count: x.length };
        }).value();

        var devices = _(clicks).groupBy('device').map(function (x, agent) {
            return { device : agent, count: x.length};
        }).value();
        return {
            clicksCount: clicks.length,
            clicksPerDay: clicksPerDay,
            devices: devices
        };
    }

    router.get('/reports/pages/:id', function (req, res, next) {
        model.TrackedClick.find({ page: req.params.id }).sort('timestamp').exec(function (err, clicks) {
            if (err) {
                return next(Error.create('An error occurred trying get the page\'s report.', { id: req.params.id }, err));
            }
            res.json(getReport(clicks));
        });
    });

    router.get('/reports/customPages/:id', function (req, res, next) {
        model.TrackedClick.find({ customPage: req.params.id }, function (err, clicks) {
            if (err) {
                return next(Error.create('An error occurred trying get the page\'s report.', { id: req.params.id }, err));
            }
            res.json(getReport(clicks));
        });
    });

    router.get('/reports/pages/:id/download', function (req, res, next) {
        model.TrackedClick.find({ page: req.params.id })
        .populate(['page'])
        .exec(function (err, clicks) {
            if (err) {
                return next(Error.create('An error occurred trying get the page\'s report.', { id: req.params.id }, err));
            }
            var header= ['IP','timestamp','device','page','reference value','agent'];
            var dataArray = _.map(clicks,function(click){
                return [
                    click.ipAddress,
                    click.timestamp,
                    click.device,
                    click.page.name,
                    click.valueReference,
                    click.agent
                ];
            });
            dataArray.unshift(header);

            stringify(dataArray,function(err,data){
               if (err){
                   return next(Error.create('An error occurred trying get the page\'s report.', { id: req.params.id }, err));
               }
                res.set('Content-Type', 'text/csv');
                res.setHeader('Content-disposition', 'attachment; filename=page.csv');
                res.send(data);
            });
        });
    });

    router.get('/reports/customPages/:id/download', function (req, res, next) {
        model.TrackedClick.find({ customPage: req.params.id })
            .populate(['customPage'])
            .exec(function (err, clicks) {
                if (err) {
                    return next(Error.create('An error occurred trying get the page\'s report.', { id: req.params.id }, err));
                }
                var header= ['IP','timestamp','device','customPage','reference value','agent'];
                var dataArray = _.map(clicks,function(click){
                    return [
                        click.ipAddress,
                        click.timestamp,
                        click.device,
                        click.customPage.name,
                        click.valueReference,
                        click.agent
                    ];
                });
                dataArray.unshift(header);

                stringify(dataArray,function(err,data){
                    if (err){
                        return next(Error.create('An error occurred trying get the page\'s report.', { id: req.params.id }, err));
                    }
                    res.set('Content-Type', 'text/csv');
                    res.setHeader('Content-disposition', 'attachment; filename=page.csv');
                    res.send(data);
                });
            });
    });

    return router;
};
