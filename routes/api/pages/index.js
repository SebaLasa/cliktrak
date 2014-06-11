var model = app.model,
    validate = app.validation.validate;

module.exports = function (router) {
    router.get('/pages', function (req, res, next) {
        model.Page.find({}, function (err, pages) {
            if (err) {
                return next(Error.create('An error occurred trying get the Pages.', { }, err));
            }
            res.json(pages);
        });
    });

    router.get('/pages/:id', function (req, res, next) {
        if (validate.objectId(req.params.id)) {
            return res.send(400);
        }
        model.Layout.findById(req.params.id, function (err, pages) {
            if (err) {
                return next(Error.create('An error occurred trying get the Pages.', { }, err));
            }
            res.json(pages);
        });
    });

    router.post('/pages', function (req, res, next) {
        var page = new model.Page(req.body);
        page.save(function (err, page) {
            if (err) {
                return next(Error.create('An error occurred trying save the Page.', { }, err));
            }
            res.send(201);
        });
    });

    router.put('/pages/:id', function (req, res, next) {
        model.Page.findByIdAndUpdate(req.params.id, req.body, function (err, page) {
            if (err) {
                return next(Error.create('An error occurred trying update the Page.', { }, err));
            }
            res.send(200);
        });
    });

    router.delete('/pages/:id', function (req, res, next) {
        model.Layout.findByIdAndUpdate(req.params.id, req.body, function (err, layout) {
            if (err) {
                return next(Error.create('An error occurred trying delete the Page.', { }, err));
            }
            res.send(200);
        });
    });

    return router;
};