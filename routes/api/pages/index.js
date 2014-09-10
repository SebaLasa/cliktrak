var model = app.model,
    validate = app.validation.validate;

module.exports = function (router) {
    router.get('/pages', function (req, res, next) {
        model.Page.find({company: req.company._id, deleted: false}).populate('editor').exec(function (err, pages) {
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
        model.Page.find({_id: req.params.id, deleted: false, company: req.company._id}).populate('editor').exec(function (err, pages) {
            if (err) {
                return next(Error.create('An error occurred trying get the Pages.', { }, err));
            }
            res.json(pages);
        });
    });

    router.post('/pages', function (req, res, next) {
        var page = new model.Page(req.body);
        model.Page.find({company: req.company._id}).sort('-internalId').limit(1).findOne(function (err, maxPage) {
            page.internalId = maxPage.internalId + 1;
            page.editor = req.user._id;
            page.company = req.company._id;
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
        model.Page.findById(req.params.id, req.body, function (err, page) {
            if (err) {
                return next(Error.create('An error occurred trying delete the Page.', { }, err));
            }
            if (!page || page.deleted || !req.company._id.equals(page.company)) {
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