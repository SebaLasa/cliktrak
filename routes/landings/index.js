var model = app.model,
    hash = app.security.hash,
    validate = app.validation.validate,
    query = app.data.query,
    _ = require('lodash'),
    contentGeneration = require("../../services/contentGeneration"),
    codeConverter = require('../../services/codeConverter.js');

function renderInvalidCodePage(res) {
    res.render('invalidCode');
}

module.exports = function (router) {
    console.log('Loading landing module...');
    router.use(require('../trackingMiddleware.js')());
    function addBarcodeAndSend(page, next, landing, res) {
        codeConverter.toBarcode(page.barcodeData, {}, function (err, dataUrl) {
            if (err) {
                return next(Error.create('An error occurred generating the barcode.', err));
            }
            landing += dataUrl;
            res.send(landing);
        });
    }

    //landing static page
    router.get('/p/:id', function (req, res, next) {
        if (!req.params.id) {
            return renderInvalidCodePage(res);
        }
        var ids = req.params.id.split('.');
        var idComp = ids[0];
        var idPag = ids[1];
        if (!idPag) {
            return renderInvalidCodePage(res);
        }
        model.Company.findOne({internalId: idComp}, function (err, comp) {
            if (err) {
                return next(Error.create('An error occurred trying to find the company.', {companyId: idComp}, err));
            }
            if (!comp) {
                return renderInvalidCodePage(res);
            }
            model.Page.findOne({internalId: idPag, company: comp._id})
                .populate(['urlConfiguration', 'company', 'layout'])
                .exec(function (err, page) {
                    if (err) {
                        return next(Error.create('An error occurred trying to find the page.', {pageId: idPag}, err));
                    }
                    if (!page) {
                        return renderInvalidCodePage(res);
                    }

                    req.trackedClick.page = page;
                    req.trackedClick.save(function (err) {
                        if (err) {
                            console.log(err);
                        }
                    });

                    // TODO AN add validation subdomain.
                    // TODO AN add validation page disabled.
                    // TODO AN add validation page deleted.
                    var content = page.html;
                    content = contentGeneration.replaceStaticCodes(page, content);
                    var pageContent = contentGeneration.gluePage(page.layout, content);

                    res.send(pageContent);
                });
        });
    });

    //landing custom page
    router.get('/c/:id', function (req, res, next) {
        if (!req.params.id) {
            return renderInvalidCodePage(res);
        }
        model.CustomPageValue.findById(req.params.id, function (err, customPageValues) {
            if (err) {
                return next(Error.create('An error occurred trying to find your page.', err));
            }
            if (!customPageValues) {
                return renderInvalidCodePage(res);
            }
            model.CustomPage.findById(customPageValues.customPage).populate(['urlConfiguration', 'company']).exec(function (err, customPage) {
                if (err) {
                    return next(Error.create('An error occurred trying to find the custom page.', { id: customPageValues.customPage }, err));
                }
                if (!customPage) {
                    return renderInvalidCodePage(res);
                }

                req.trackedClick.customPage = customPage;
                req.trackedClick.save(function (err) {
                    if (err) {
                        console.log(err);
                    }
                });

                // TODO AN add validation subdomain.
                // TODO AN add validation page deleted.
                // TODO AN add validation page expired.
                model.Page.findById(customPage.page).populate(['urlConfiguration', 'layout']).exec(function (err, page) {
                    if (err) {
                        return next(Error.create('An error occurred trying to find the page.', err));
                    }
                    if (!page) {
                        return renderInvalidCodePage(res);
                    }
                    var content = page.html;
                    console.log(content);
                    content = contentGeneration.replaceStaticCodes(page, content);
                    content = contentGeneration.replaceDynamicCodes(customPage,customPageValues, content);

                    content = contentGeneration.replaceParameters(customPageValues, content);
                    var pageContent = contentGeneration.gluePage(page.layout, content);

                    res.send(pageContent);
                });
            });
        });
    });

    return router;
};