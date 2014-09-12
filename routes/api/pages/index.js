var model = app.model,
    validate = app.validation.validate;

module.exports = function (router) {
    router.get('/pages', function (req, res, next) {
        model.Page.find({company: req.company._id, deleted: false}).populate('editor', 'urlConfiguration').exec(function (err, pages) {
            if (err) {
                return next(Error.create('An error occurred trying get the Pages.', { }, err));
            }
            res.json(pages);
        });
    });

    router.get('/pages/:id', function (req, res, next) {
        if (!validate.objectId(req.params.id)) {
            return res.status(400).end();
        }
        model.Page.findOne({_id: req.params.id, deleted: false, company: req.company._id}).populate('editor').exec(function (err, page) {
            if (err) {
                return next(Error.create('An error occurred trying get the Pages.', { }, err));
            }
            if (!page) {
                return res.status(404).end();
            }
            res.json(page);
        });
    });

    router.post('/pages', function (req, res, next) {
        var page = new model.Page(req.body);
        page.editor = req.user._id;
        page.company = req.company._id;
        model.Page.find({company: req.company._id}).sort('-internalId').findOne(function (err, lastPage) {
            if (err) {
                return next(Error.create('An error occurred trying get the last Page.', { }, err));
            }
            page.internalId = lastPage ? lastPage.internalId + 1 : 1;
            page.save(function (err, page) {
                if (err) {
                    return next(Error.create('An error occurred trying save the Page.', { }, err));
                }
                res.status(201).end();
            });
        });
    });

    router.put('/pages/:id', function (req, res, next) {
        model.Page.findByIdAndUpdate(req.params.id, req.body, function (err, page) {
            if (err) {
                return next(Error.create('An error occurred trying update the Page.', { }, err));
            }
            res.status(200).end();
        });
    });

    router.delete('/pages/:id', function (req, res, next) {
        model.Page.findOne({_id: req.params.id, deleted: false, company: req.company._id}, function (err, page) {
            if (err) {
                return next(Error.create('An error occurred trying delete the Page.', { }, err));
            }
            if (!page) {
                return res.status(404).end();
            }
            page.deleted = true;
            page.save(function (err) {
                if (err) {
                    return next(Error.create('An error occurred trying delete the Page.', { }, err));
                }
                res.status(200).end();
            });
        });
    });

    return router;
};