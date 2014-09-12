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
        var urlConfiguration = new model.UrlConfiguration(req.body.urlConfiguration);
        urlConfiguration.save(function (err, urlConfiguration) {
            if (err) {
                return next(Error.create('An error occurred trying save the URL configuration.', { }, err));
            }
            var page = new model.Page(req.body.page);
            page.editor = req.user._id;
            page.company = req.company._id;
            page.urlConfiguration = urlConfiguration._id;
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
    });

    router.put('/pages/:id', function (req, res, next) {
        delete req.body.page._id;
        delete req.body.page.urlConfiguration;
        page.editor = req.user._id;
        page.company = req.company._id;
        model.Page.findOneAndUpdate({_id: req.params.id, deleted: false, company: req.company._id}, req.body.page, function (err, page) {
            if (err) {
                return next(Error.create('An error occurred trying update the Page.', { }, err));
            }
            if (!page) {
                return res.status(404).end();
            }
            model.UrlConfiguration.findByIdAndUpdate(page.urlConfiguration, req.body.urlConfiguration, function (err, urlConfiguration) {
                if (err) {
                    return next(Error.create('An error occurred trying update the URL configuration.', { }, err));
                }
                res.status(200).end();
            });
        });
    });

    router.delete('/pages/:id', function (req, res, next) {
        var page = {
            editor: req.user._id,
            company: req.company._id,
            deleted: true
        };
        model.Page.findOneAndUpdate({_id: req.params.id, deleted: false, company: req.company._id}, page, function (err, page) {
            if (err) {
                return next(Error.create('An error occurred trying delete the Page.', { }, err));
            }
            if (!page) {
                return res.status(404).end();
            }
            res.status(200).end();
        });
    });

    return router;
};