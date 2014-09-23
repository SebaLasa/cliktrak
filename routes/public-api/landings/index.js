var model = app.model,
    hash = app.security.hash,
    validate = app.validation.validate,
    query = app.data.query,
    _ = require('lodash'),
    codeConverter = require('../../../services/codeConverter.js');

module.exports = function (router) {
    router.use(require('../../trackingMiddleware.js')());
    function addBarcodeAndSend(page, next, landing, res) {
        codeConverter.toBarcode(page.urlConfiguration.barcodeData,{}, function (err, dataUrl) {
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
                .populate(['urlConfiguration', 'company'])
                .exec(function (err, page) {
                    if (err) {
                        return next(Error.create('An error occurred trying to find the page.', {pageId: idPag}, err));
                    }
                    if (!page) {
                        return res.json(404, { message: 'Page not found!' });
                    }

                    req.trackedClick.page = page;
                    req.trackedClick.save();

                    var landing = page.html;
                    if (page.urlConfiguration.qrGenerated) {
                        landing =landing.replace('<img class="staticQr" src="images/codes/qrS.png" alt="" />','<img src="/public-api/qr/' + page.urlConfiguration.qrSize + '/'
                            + page.urlConfiguration.qrData + '" />');
                    }
                    if (page.urlConfiguration.barcodeGenerated) {
                        landing =landing.replace('<img class="staticBarcode" src="images/codes/bcS.gif" alt="" />','<img src="/public-api/barcode/' + page.urlConfiguration.barcodeSize + '/'
                            + page.urlConfiguration.barcodeData + '" />');
                    }
                    res.send(landing);
                });
        });
    });

    //landing custom page
    router.get('/c/:id', function (req, res, next) {
        if (!req.params.id) {
            return res.json(400, { message: 'Invalid code, try again by clicking on the link that has been sent.'});
        }

        model.CustomPageValue.findOne({_id: req.params.id}, function (err, customPageValues) {
            if (err) {
                return next(Error.create('An error occurred trying to find your page.', err));
            }
            if (!customPageValues) {
                return res.json(404, { message: 'Page not found!' });
            }

            model.CustomPage.findOne({_id: customPageValues.customPage})
                .populate(['urlConfiguration', 'company', 'page'])
                .exec(function (err, customPage) {
                    if (err) {
                        return next(Error.create('An error occurred trying to find the custom page.', {internalId: idPag}, err));
                    }
                    if (!customPage) {
                        return res.json(404, { message: 'Custom page not found!' });
                    }

                    req.trackedClick.customPage = customPage;
                    req.trackedClick.save(function(err){
                        if (err)
                            console.log(err);
                    });

                    var landing = customPage.page.html;

                    var columns = _.map(_.range(15), function (x) {
                        return 'parameter' + x;
                    });
                    _.forEach(columns,function (x){
                        var searchString = '[['+x+']]';
                        var replaceValue = customPageValues[x] ? customPageValues[x] : '';
                        landing = landing.replace(searchString,replaceValue)
                    });

                    model.UrlConfiguration.findOne({_id:customPage.page.urlConfiguration}, function (err, urlConfig){
                        if (err) {
                            return next(Error.create('An error occurred trying to find the custom page.', err));
                        }

                        customPage.urlConfiguration = _.assign(customPage.urlConfiguration,urlConfig);
                        if (customPage.urlConfiguration.qrGenerated) {
                            landing =landing.replace('<img class="staticQr" src="images/codes/qrS.png" alt="" />','<img src="/public-api/qr/' + customPage.urlConfiguration.qrSize + '/'
                                + customPage.urlConfiguration.qrData + '" />');
                        }
                        if (customPage.urlConfiguration.barcodeGenerated) {
                            landing =landing.replace('<img class="staticBarcode" src="images/codes/bcS.gif" alt="" />','<img src="/public-api/barcode/' + customPage.urlConfiguration.barcodeSize + '/'
                                + customPage.urlConfiguration.barcodeData + '" />');
                        }
                        res.send(landing);
                    });


                });
        });
    });

    return router;
};