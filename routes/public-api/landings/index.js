var model = app.model,
    hash = app.security.hash,
    validate = app.validation.validate,
    query = app.data.query,
    codeConverter = require('../../../services/codeConverter.js');

module.exports = function (router) {
    router.use(require('../../trackingMiddleware.js')());
    function addBarcodeAndSend(page, next, landing, res) {
        codeConverter.toBarcode(page.urlConfiguration.barcodeData, {}, function (err, dataUrl) {
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
            return res.json(400, { message: 'Invalid code, try again by clicking on the link that has been sent.'});
        }
        var ids = req.params.id.split('.');
        var idComp = ids[0];
        var idPag = ids[1];

        if (!idPag) {
            return res.json(400, { message: 'Invalid code, try again by clicking on the link that has been sent.'});
        }

        model.Company.findOne({internalId: idComp}, function (err, comp) {
            if (err) {
                return next(Error.create('An error occurred trying to find the company.', {companyId: idComp}, err));
            }
            if (!comp) {
                return res.json(404, { message: 'Company not found!' });
            }

            model.Page.findOne({internalId: idPag, company: comp._id})
                .populate(['urlConfiguration', 'company', 'layout'])
                .exec(function (err, page) {
                    if (err) {
                        return next(Error.create('An error occurred trying to find the page.', {pageId: idPag}, err));
                    }
                    if (!page) {
                        return res.json(404, { message: 'Page not found!' });
                    }

                    req.trackedClick.page = page;
                    req.trackedClick.save();

                    var landing = '<html><link rel="stylesheet" href="/stylesheets/landing.css"><style>footer{background-color:'
                        + page.layout.footerBackgroundColor
                        + ';}</style><head></head><body><header><img class="layoutHeaderImage" src="/'
                        + page.layout.image + '" /></header>' + page.html;
                    if (page.urlConfiguration.qrGenerated) {
                        var qrCodeSource = 'src="/public-api/qr/' + page.urlConfiguration.qrSize + '/'
                            + page.urlConfiguration.qrData;
                        landing = landing.replace('src="/images/codes/qrS.png', qrCodeSource);
                    }
                    if (page.urlConfiguration.barcodeGenerated) {
                        var barcodeSource = 'src="/public-api/barcode/' + page.urlConfiguration.barcodeSize + '/'
                            + page.urlConfiguration.barcodeData;
                        landing = landing.replace('src="images/codes/bcS.gif', barcodeSource);
                    }
                    landing += '<footer>' + page.layout.footer + '</footer>';
                    res.send(landing + '</body></html>');
                });
        });
    });

    //landing custom page
    router.get('/c/:id', function (req, res, next) {
        if (!req.params.id) {
            return res.json(400, { message: 'Invalid code, try again by clicking on the link that has been sent.'});
        }
        var ids = req.params.id.split('.');
        var idComp = ids[0];
        var idPag = ids[1];

        if (!idPag) {
            return res.json(400, { message: 'Invalid page and company id!'});
        }
        model.Company.findOne({internalId: idComp}, function (err, comp) {
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

                    req.trackedClick.customPage = customPage;
                    req.trackedClick.save(function (err) {
                        if (err)
                            console.log(err);
                    });

                    var landing = customPage.page.html;
                    if (customPage.urlConfiguration.qrGenerated) {
                        landing += '<img src="/public-api/qr/' + customPage.urlConfiguration.qrSize + '/'
                            + customPage.urlConfiguration.qrData + '" />';
                    }
                    if (customPage.urlConfiguration.barcodeGenerated) {
                        landing += '<img src="/public-api/barcode/' + customPage.urlConfiguration.barcodeSize + '/'
                            + customPage.urlConfiguration.barcodeData + '" />';
                    }
                    res.send(landing);
                });
        });
    });

    return router;
};