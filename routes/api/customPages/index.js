var model = app.model,
    validate = app.validation.validate;

module.exports = function (router) {
    router.get('/customPages', function (req, res, next) {
        model.CustomPage.find({ company: req.company._id, deleted: false }).populate('editor').exec(function (err, customPages) {
            if (err) {
                return next(Error.create('An error occurred trying get the Custom Pages.', { }, err));
            }
            res.json(customPages);
        });
    });

    router.get('/customPages/:id', function (req, res, next) {
        if (!validate.objectId(req.params.id)) {
            return res.send(400);
        }
        model.CustomPage.findOne({_id: req.params.id, deleted: false, company: req.company._id}, function (err, customPage) {
            if (err) {
                return next(Error.create('An error occurred trying get the Custom Page.', { }, err));
            }
            res.json(customPage);
        });
    });

    router.post('/customPages', function (req, res, next) {
        var customPage = new model.CustomPage(req.body);
        customPage.editor = req.user._id;
        customPage.company = req.company._id;
        model.CustomPage.find({company: req.company._id}).sort('-internalId').findOne(function (err, lastPage) {
            if (err) {
                return next(Error.create('An error occurred trying get the last Custom Page.', { }, err));
            }
            customPage = lastPage ? lastPage.internalId + 1 : 1;
            customPage.save(function (err, customPage) {
                if (err) {
                    return next(Error.create('An error occurred trying save the Custom Page.', { }, err));
                }
                res.status(201).end();
            });
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
        model.CustomPage.findOne({_id: req.params.id, deleted: false, company: req.company._id}, function (err, customPage) {
            if (err) {
                return next(Error.create('An error occurred trying get the custom Page.', { }, err));
            }
            if (!customPage) {
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
