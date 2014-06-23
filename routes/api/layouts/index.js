var model = app.model,
    validate = app.validation.validate;

module.exports = function (router) {
    router.get('/layouts', function (req, res, next) {
        model.Layout.find({ company: req.company._id, deleted: false }, function (err, layouts) {
            if (err) {
                return next(Error.create('An error occurred trying get the Layouts.', { }, err));
            }
            res.json(layouts);
        });
    });

    router.get('/layouts/:id', function (req, res, next) {
        if (!validate.objectId(req.params.id)) {
            return res.send(404);
        }
        model.Layout.findById(req.params.id, function (err, layout) {
            if (err) {
                return next(Error.create('An error occurred trying get the Layouts.', { }, err));
            }
            res.json(layout);
        });
    });

    router.post('/layouts', function (req, res, next) {
        var layout = new model.Layout(req.body);
        layout.editor = req.user._id;
        layout.company = req.company._id;
        layout.save(function (err, layout) {
            if (err) {
                return next(Error.create('An error occurred trying get the Layouts.', { }, err));
            }
            res.send(201);
        });
    });

    router.put('/layouts/:id', function (req, res, next) {
        delete req.body._id;
        req.body.editor = req.user._id;
        model.Layout.findByIdAndUpdate(req.params.id, req.body, function (err, layout) {
            if (err) {
                return next(Error.create('An error occurred trying get the Layouts.', { }, err));
            }
            res.send(200);
        });
    });

    router.delete('/layouts/:id', function (req, res, next) {
        model.Layout.findById(req.params.id, function (err, layout) {
            if (err) {
                return next(Error.create('An error occurred trying get the Layout.', { }, err));
            }
            if (!layout || !req.company._id.equals(layout.company)) {
                return res.send(404);
            }
            layout.deleted = true;
            layout.save(function(err){
                if (err){
                    return next(Error.create('An error occurred trying delete the Layout.', { }, err));
                }
                res.send(200);
            });
        });
    });

    return router;
};