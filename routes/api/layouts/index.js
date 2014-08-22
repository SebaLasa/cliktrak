var model = app.model,
    validate = app.validation.validate;

module.exports = function (router) {
    router.get('/layouts', function (req, res, next) {
        model.Layout.find({ company: req.company._id, deleted: false }).populate('editor').exec(function (err, layouts) {
            if (err) {
                return next(Error.create('An error occurred trying get the Layouts.', { }, err));
            }
            res.json(layouts);
        });
    });

    router.get('/layouts/:id', function (req, res, next) {
        if (!validate.objectId(req.params.id)) {
            return res.send(400);
        }
        model.Layout.findById(req.params.id).populate('editor').exec(function (err, layout) {
            if (err) {
                return next(Error.create('An error occurred trying get the Layouts.', { }, err));
            }
            if (!layout || layout.deleted || !req.company._id.equals(layout.company)) {
                return res.status(404).end();
            }
            res.json(layout);
        });
    });

    router.post('/layouts', function (req, res, next) {
        var layout = new model.Layout(req.body);
        layout.editor = req.user._id;
        layout.company = req.company._id;
        layout.lastmodification = new Date();
        layout.save(function (err, layout) {
            if (err) {
                return next(Error.create('An error occurred trying get the Layouts.', { }, err));
            }
            res.status(201).end();
        });
    });

    router.put('/layouts/:id', function (req, res, next) {
        delete req.body._id;
        req.body.editor = req.user._id;
        req.body.lastmodification = new Date();
        model.Layout.findByIdAndUpdate(req.params.id, req.body, function (err, layout) {
            if (err) {
                return next(Error.create('An error occurred trying get the Layouts.', { }, err));
            }
            res.status(200).end();
        });
    });

    router.delete('/layouts/:id', function (req, res, next) {
        model.Layout.findById(req.params.id, function (err, layout) {
            if (err) {
                return next(Error.create('An error occurred trying get the Layout.', { }, err));
            }
            if (!layout || layout.deleted || !req.company._id.equals(layout.company)) {
                return res.status(404).end();
            }
            layout.deleted = true;
            layout.save(function (err) {
                if (err) {
                    return next(Error.create('An error occurred trying delete the Layout.', { }, err));
                }
                res.status(200).end();
            });
        });
    });

    return router;
};