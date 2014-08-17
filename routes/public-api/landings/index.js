var model = app.model,
    hash = app.security.hash,
    validate = app.validation.validate,
    query = app.data.query,
    codeConverter = require('../../../services/codeConverter.js');

module.exports = function (router) {

    function addBarcodeAndSend(page, next, landing, res) {
        codeConverter.toBarcode(page.urlConfiguration.barcodeData, function (err, dataUrl) {
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
            return res.json(400, { message: 'Invalid page and company id!'});
        }
        var ids = req.params.id.split('.');
        var idComp = ids[0];
        var idPag = ids[1];

        if (!idPag) {
            return res.json(400, { message: 'Invalid page and company id!'});
        }

        model.Company.findOne({internalId: idComp}, function(err, comp) {
            if (err) {
                return next(Error.create('An error occurred trying to find the company.', {companyId: idComp}, err));
            }
            if (!comp) {
                return res.json(404, { message: 'Company not found!' });
            }

            model.Page.findOne({internalId: idPag, company: comp._id})
            .populate(['urlConfiguration', 'company'])
            .exec(function (err, page) {
                if (err) {
                    return next(Error.create('An error occurred trying to find the page.', {pageId: idPag}, err));
                }
                if (!page) {
                    return res.json(404, { message: 'Page not found!' });
                }

                var landing = page.html;

                if (page.urlConfiguration.qrGenerated) {
                    codeConverter.toQR(page.urlConfiguration.qrData, function (err, dataUrl) {
                        if (err) {
                            return next(Error.create('An error occurred generating the QR code.', err));
                        }
                        landing += dataUrl;

                        if (page.urlConfiguration.barcodeGenerated) {
                            addBarcodeAndSend(page, next, landing, res);
                        } else return res.send(landing);
                    });
                } else if (page.urlConfiguration.barcodeGenerated) {
                    addBarcodeAndSend(page, next, landing, res);
                } else {
                    res.send(landing);
                }
            });
        });
    });

    //landing custom page
    router.get('/c/:id', function (req, res, next) {
        if (!req.params.id) {
            return res.json(400, { message: 'Invalid page and company id!'});
        }
        var ids = req.params.id.split('.');
        var idComp = ids[0];
        var idPag = ids[1];

        if (!idPag) {
            return res.json(400, { message: 'Invalid page and company id!'});
        }

        model.Company.findOne({internalId: idComp}, function(err, comp) {
            if (err) {
                return next(Error.create('An error occurred trying to find the company.', {companyId: idComp}, err));
            }
            if (!comp) {
                return res.json(404, { message: 'Company not found!' });
            }

            model.CustomPage.findOne({internalId: idPag, company: comp._id})
            .populate(['urlConfiguration', 'company', 'page'])
            .exec(function (err, customPage) {
                if (err) {
                    return next(Error.create('An error occurred trying to find the custom page.', {internalId: idPag}, err));
                }
                if (!customPage) {
                    return res.json(404, { message: 'Custom page not found!' });
                }
                var landing = customPage.page.html;

                if (customPage.urlConfiguration.qrGenerated) {
                    codeConverter.toQR(customPage.urlConfiguration.qrData, function (err, dataUrl) {
                        if (err) {
                            return next(Error.create('An error occurred generating the QR code.', err));
                        }
                        landing += dataUrl;
                        if (customPage.urlConfiguration.barcodeGenerated) {
                            addBarcodeAndSend(customPage, next, landing, res);
                        } else return res.send(landing);
                    });
                } else if (customPage.urlConfiguration.barcodeGenerated) {
                    addBarcodeAndSend(customPage, next, landing, res);
                } else {
                    res.send(landing);
                }
            });
        });
    });

    return router;
};