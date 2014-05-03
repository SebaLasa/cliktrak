var private = app.api.private,
    model = app.model,
    validate = app.validation.validate;

module.exports = function (router) {
    router.get('/api/layouts', function (req, res, next) {
        model.Layout.find({}, function (err, layouts) {
            if (err) {
                return next(Error.create('An error occurred trying get the Layouts.', { }, err));
            }
            res.json(layouts);
        });
    });

    router.get('/api/layouts/:id', function (req, res, next) {
        if (validate.objectId(req.params.id)) {
            return res.send(404);
        }
        model.Layout.findById(req.params.id, function (err, layouts) {
            if (err) {
                return next(Error.create('An error occurred trying get the Layouts.', { }, err));
            }
            res.json(layouts);
        });
    });

    router.post('/api/layouts', function (req, res, next) {
        var layout = new model.Layout(req.body);
        layout.save(function (err, layout) {
            if (err) {
                return next(Error.create('An error occurred trying get the Layouts.', { }, err));
            }
            res.send(201);
        });
    });

    router.put('/api/layouts/:id', function (req, res, next) {
        model.Layout.findByIdAndUpdate(req.params.id, req.body, function (err, layout) {
            if (err) {
                return next(Error.create('An error occurred trying get the Layouts.', { }, err));
            }
            res.send(200);
        });
    });

    router.delete('/api/layouts/:id', function (req, res, next) {
        model.Layout.findByIdAndUpdate(req.params.id, req.body, function (err, layout) {
            if (err) {
                return next(Error.create('An error occurred trying get the Layouts.', { }, err));
            }
            res.send(200);
        });
    });
};