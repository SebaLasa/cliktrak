var model = app.model,
    validate = app.validation.validate,
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

    router.get('/reports/page/:id', function (req, res, next) {
        model.TrackedClick.find({ page: req.params.id }, function (err, clicks) {
            if (err) {
                return next(Error.create('An error occurred trying get the page\'s report.', { id: req.params.id }, err));
            }
            res.json(getReport(clicks));
        });
    });

    router.get('/reports/customPage/:id', function (req, res, next) {
        model.TrackedClick.find({ customPage: req.params.id }, function (err, clicks) {
            if (err) {
                return next(Error.create('An error occurred trying get the custom page\'s report.', { id: req.params.id }, err));
            }
            res.json(getReport(clicks));
        });
    });

    router.get('/reports/page/:id/download', function () {
        res.send(400)
    });

    router.get('/reports/customPage/:id/download', function () {
        res.send(400);
    });

    return router;
};
