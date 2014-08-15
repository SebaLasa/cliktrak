/*var model = app.model,
    hash = app.security.hash,
    validate = app.validation.validate,
    query = app.data.query,
    uid = require('node-uuid'),
    codeConverter = require('../../services/codeConverter.js');*/


var fs = require('fs'),
    express = require('express');

function loadModules(folder, router) {
    // Loading modules dynamically
    fs.readdirSync(folder)
        .filter(function (file) {
            return file.indexOf('.') == -1 && file.indexOf("api.") == -1;
        }).forEach(function (module) {
            console.log('Loading', module, 'public-api...');
            router.use(require('./' + module)(express.Router()));
        });
}

module.exports = function (router) {
    loadModules('./routes/public-api', router);
    return router;
};

/*module.exports = function (router) {

    function addBarcodeAndSend(page, next, landing, res) {
        codeConverter.toBarcode(page.urlConfiguration.barcodeData, function (err, dataUrl) {
            if (err) {
                return next(Error.create('Ocurrió un error al convertir a código de barras.', err));
            }
            landing += dataUrl;
            res.send(landing);
        });
    }

    //landing static page
    router.get('/p/:id', function (req, res, next) {
        if (!req.params.id) {
            return res.json(400, { message: 'Identificador de página inválido!'});
        }
        var ids = req.params.id.split('.');
        var idComp = ids[0];
        var idPag = ids[1];

        if (!idPag) {
            return res.json(400, { message: 'Identificador de página inválido!'});
        }
        model.Page.findOne({ internalId: idPag, 'company.internalId': idComp }, function (err, page) {
            if (err) {
                return next(Error.create('Ocurrió un error tratando de encontrar la página.', { internalId: idPag, 'company.internalId': idComp }, err));
            }
            if (!page) {
                return res.json(404, { message: 'No se encontro la pagina!' });
            }

            var landing = page.html;

            if(page.UrlConfiguration.qrGenerated){
                codeConverter.toQR(page.urlConfiguration.qrData, function(err, dataUrl){
                    if (err) {
                        return next(Error.create('Ocurrió un error al convertir a código QR.', err));
                    }
                    landing += dataUrl;

                    if(page.UrlConfiguration.barcodeGenerated){
                        addBarcodeAndSend(page, next, landing, res);
                    }else return res.send(landing);
                });
            }else if(page.UrlConfiguration.barcodeGenerated){
                addBarcodeAndSend(page, next, landing, res);
            }else{
                res.send(landing);
            }
        });
    });

    //landing custom page
    router.get('/c/:id', function (req, res, next) {
        if (!req.params.id) {
            return res.json(400, { message: 'Identificador de página inválido!'});
        }
        var ids = req.params.id.split('.');
        var idComp = ids[0];
        var idPag = ids[1];

        if (!idPag) {
            return res.json(400, { message: 'Identificador de página inválido!'});
        }
        model.CustomPage.findOne({ internalId: idPag, 'company.internalId': idComp }, function (err, customPage) {
            if (err) {
                return next(Error.create('Ocurrió un error tratando de encontrar la página personalizada.', { internalId: idPag, 'company.internalId': idComp }, err));
            }
            if (!customPage) {
                return res.json(404, { message: 'No se encontro la pagina personalizada!' });
            }

            var landing = customPage.page.html;

            if(customPage.UrlConfiguration.qrGenerated){
                codeConverter.toQR(customPage.urlConfiguration.qrData, function(err, dataUrl){
                    if (err) {
                        return next(Error.create('Ocurrió un error al convertir a código QR.', err));
                    }
                    landing += dataUrl;

                    if(customPage.UrlConfiguration.barcodeGenerated){
                        addBarcodeAndSend(customPage, next, landing, res);
                    }else return res.send(landing);
                });
            }else if(customPage.UrlConfiguration.barcodeGenerated){
                addBarcodeAndSend(customPage, next, landing, res);
            }else{
                res.send(landing);
            }
        });
    });

    return router;
};*/