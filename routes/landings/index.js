var model = app.model,
    hash = app.security.hash,
    validate = app.validation.validate,
    query = app.data.query,
    fs = require("fs"),
    _ = require('lodash'),
    contentGeneration = require("../../services/contentGeneration"),
    codeConverter = require('../../services/codeConverter.js');

function renderInvalidCodePage(res) {
    res.render('invalidCode');
}

function validateSubdomain(req, page){
    return ['localhost', '127.0.0.1'].contains(req.hostname)
        || req.subdomains.length == 1 && req.subdomains[0] == page.urlConfiguration.subdomain;
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
    router.get('/p/:id/:valueReference?', function (req, res, next) {
        if (!req.params.id) {
            return renderInvalidCodePage(res);
        }
        var ids = req.params.id.split('.');
        var companyId = ids[0];
        var pageId = ids[1];
        if (!pageId) {
            return renderInvalidCodePage(res);
        }
        model.Company.findById(companyId, function (err, company) {
            if (err) {
                return next(Error.create('An error occurred trying to find the company.', {companyId: companyId}, err));
            }
            if (!company) {
                return renderInvalidCodePage(res);
            }
            model.Page.findOne({_id: pageId, company: company._id})
                .populate(['urlConfiguration', 'company', 'layout'])
                .exec(function (err, page) {
                    if (err) {
                        return next(Error.create('An error occurred trying to find the page.', {pageId: pageId}, err));
                    }
                    if (!page) {
                        return renderInvalidCodePage(res);
                    }

                    req.trackedClick.page = page;
                    console.log('refval:', req.trackedClick.valueReference = req.params.valueReference);
                    req.trackedClick.save(function (err) {
                        if (err) {
                            console.log(err);
                        }
                    });

                    if (page.deleted || !page.enabled) {
                        return renderInvalidCodePage(res);
                    }
                    if (!validateSubdomain(page)) {
                        return renderInvalidCodePage(res);
                    }
                    fs.readFile('./public/views/landings/template.html', 'utf-8', function (err, template) {
                        if (err) {
                            return next(Error.create('An error occurred trying to render the page.', {pageId: pageId}, err));
                        }
                        var content = page.html;
                        content = contentGeneration.replaceStaticCodes(page, content);
                        content = contentGeneration.replaceDynamicCodesPreviewMode(content);
                        var pageContent = contentGeneration.gluePage(page.layout, content, template);

                        res.send(pageContent);
                    });

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

                if (!validateSubdomain(req, customPage)) {
                    return renderInvalidCodePage(res);
                }
                // TODO AN add validation page deleted.
                // TODO AN add validation page expired.
                model.Page.findById(customPage.page).populate(['urlConfiguration', 'layout']).exec(function (err, page) {
                    if (err) {
                        return next(Error.create('An error occurred trying to find the page.', err));
                    }
                    if (!page) {
                        return renderInvalidCodePage(res);
                    }

                    fs.readFile('./public/views/landings/template.html', 'utf-8', function (err, template) {
                        if (err) {
                            return next(Error.create('An error occurred trying to render the page.', {pageId: pageId}, err));
                        }
                        var content = page.html;
                        content = contentGeneration.replaceStaticCodes(page, content);
                        content = contentGeneration.replaceDynamicCodes(customPage, customPageValues, content);

                        content = contentGeneration.replaceParameters(customPageValues, content);
                        var pageContent = contentGeneration.gluePage(page.layout, content, template);

                        res.send(pageContent);
                    });
                });
            });
        });
    });

    return router;
};