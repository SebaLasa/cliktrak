module.exports = function (error, req, res, next) {
    var status = error.status || 500;
    var msg = error.message || 'Unknown error';

    if (status == 500) {
        if (app.config.mode == 'dev') {
            console.log(error);
        }

        return app.log.error(error, function (err, traceId) {
            var info = { message: error.message || 'Unknown error' };

            if (traceId) {
                info.traceId = traceId;
            }

            res.json(status, info);
        });
    }

    var info = error.data || {};
    info.message = msg;
    res.json(status, info);
};