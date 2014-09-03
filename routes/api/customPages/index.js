var model = app.model,
    validate = app.validation.validate;

module.exports = function (router) {
    router.get('/customPages', function (req, res, next) {
        model.CustomPage.find({ company: req.company._id, deleted: false }).populate('editor').exec(function (err, customPages) {
                        if (err) {
                return next(Error.create('An error occurred trying get the Custom Pages.', { }, err));
            }
            console.log(customPages);
            res.json(customPages);
        });
    });

    router.get('/customPages/:id', function (req, res, next) {
        if (!validate.objectId(req.params.id)) {
            return res.send(400);
        }
        model.CustomPage.findById(req.params.id, function (err, customPages) {
            if (err) {
                return next(Error.create('An error occurred trying get the Custom Page.', { }, err));
            }
            console.log(customPages);
            res.json(customPages);
        });
    });

    router.post('/customPages', function (req, res, next) {
        var customPage = new model.CustomPage(req.body);
        customPage.editor = req.user._id;
        customPage.company = req.company._id;
        customPage.save(function (err, customPage) {
            if (err) {
                return next(Error.create('An error occurred trying save the Custom Page.', { }, err));
            }
            res.status(201).end();
        });
    });

    router.put('/customPages/:id', function (req, res, next) {
        delete req.body._id;
        req.body.editor = req.user._id;
        model.CustomPage.findByIdAndUpdate(req.params.id, req.body, function (err, customPage) {
            if (err) {
                return next(Error.create('An error occurred trying update the Custom Page.', { }, err));
            }
            res.send(200);
        });
    });

 router.delete('/customPages/:id', function (req, res, next) {
        model.CustomPage.findById(req.params.id, function (err, customPage) {
            if (err) {
                return next(Error.create('An error occurred trying get the custom Page.', { }, err));
            }
            if (!customPage || customPage.deleted || !req.company._id.equals(customPage.company)) {
                return res.status(404).end();
            }
            customPage.deleted = true;
            customPage.save(function (err) {
                if (err) {
                    return next(Error.create('An error occurred trying delete the custom Page.', { }, err));
                }
                res.status(200).end();
            });
        });
    });

    return router;
};
