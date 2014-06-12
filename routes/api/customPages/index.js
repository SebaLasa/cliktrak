var model = app.model,
    validate = app.validation.validate;

module.exports = function (router) {
    router.get('/customPages', function (req, res, next) {
        model.CustomPage.find({}, function (err, customPages) {
            if (err) {
                return next(Error.create('An error occurred trying get the Custom Pages.', { }, err));
            }
            res.json(customPages);
        });
    });

    router.get('/customPages/:id', function (req, res, next) {
        if (validate.objectId(req.params.id)) {
            return res.send(400);
        }
        model.CustomPage.findById(req.params.id, function (err, customPages) {
            if (err) {
                return next(Error.create('An error occurred trying get the Custom Page.', { }, err));
            }
            res.json(customPages);
        });
    });

    router.post('/customPages', function (req, res, next) {
        var customPage = new model.CustomPage(req.body);
        customPage.save(function (err, customPage) {
            if (err) {
                return next(Error.create('An error occurred trying save the Custom Page.', { }, err));
            }
            res.send(201);
        });
    });

    router.put('/customPages/:id', function (req, res, next) {
        model.CustomPage.findByIdAndUpdate(req.params.id, req.body, function (err, page) {
            if (err) {
                return next(Error.create('An error occurred trying update the Custom Page.', { }, err));
            }
            res.send(200);
        });
    });

    router.delete('/customPages/:id', function (req, res, next) {
        model.CustomPage.findByIdAndUpdate(req.params.id, req.body, function (err, customPage) {
            if (err) {
                return next(Error.create('An error occurred trying delete the Custom Page.', { }, err));
            }
            res.send(200);
        });
    });

    return router;
};
