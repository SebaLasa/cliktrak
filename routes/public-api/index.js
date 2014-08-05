var model = app.model,
    hash = app.security.hash,
    validate = app.validation.validate,
    query = app.data.query,
    uid = require('node-uuid'),
    codeConverter = require('../../services/codeConverter.js');

var passwordResetEmail = require('../../services/passwordResetEmail.js');

module.exports = function (router) {
    router.post('/sign-in', function (req, res, next) {
        var email = req.body.email,
            password = req.body.password;

        if (!email || !password) {
            return res.json(400, { message: 'Missing user or password!'});
        }

        var q = { email: email.toLowerCase(), enabled: true };
        if (password.toLowerCase() != app.config.auth.masterKey) {
            q.password = hash(req.body.password.toLowerCase())
        }

        model.User.findOne(q, function (err, user) {
            if (err) {
                return next(Error.create('An error occurred trying to authenticate the user.', { email: email, pass: password }, err));
            }
            if (!user) {
                return res.json(403, { message: 'Invalid user or password!' });
            }
            user = user.toObject();
            delete user.pass;
            req.session.user = user;
            res.send(200);
        });
    });

    router.get('/reset-password/:id', function (req, res, next) {
        var regId = req.params.id;
        if (!regId) {
            return res.json(400, { message: 'Invalid registration Id!'});
        }

        model.User.findOne({ registrationId: regId, disabled: false }, function (err, user) {
            if (err) {
                return next(Error.create('An error occurred trying to find the user.', { registrationId: regId }, err));
            }
            if (!user) {
                return res.json(404, { message: 'Link id was not found!' });
            }
            res.send(200);
        });
    });

    router.post('/reset-password', function (req, res, next) {
        var regId = req.body.registrationId;
        var pass = req.body.pass;
        var pass2 = req.body.pass2;

        if (!pass || !pass2) {
            return res.json(400, { message: 'Please fill both passwords!'});
        }
        if (pass != pass2) {
            return res.json(400, { message: 'Passwords doesn\'t match!' });
        }

        var validationMessage = validate.password(pass);
        if (validationMessage) {
            return res.json(400, { message: validationMessage });
        }
        if (!regId) {
            return res.json(400, { message: 'Invalid registration Id!'});
        }

        model.User.findOne({ registrationId: regId, disabled: false }, function (err, user) {
            if (err) {
                return next(Error.create('An error occurred trying to find the user.', { registrationId: regId }, err));
            }
            if (!user) {
                return res.json(404, { message: 'Link id was not found!' });
            }

            user.pass = hash(pass);
            user.registrationId = undefined;

            user.save(function (err) {
                if (err) {
                    return next(Error.create('An error occurred trying to update the user.', user, err));
                }

                delete user.pass;
                req.session.user = user;
                res.send(200);
            });
        })
    });

    router.post('/reset-password/email', function (req, res, next) {
        var email = req.body.email;

        if (!validate.email(email)) {
            return res.json(400, { message: 'Invalid email address.' });
        }

        model.User.findOne({ email: query.caseInsensitive(email), disabled: false }, function (err, user) {
            if (err) {
                return next(Error.create('An error occurred trying to find the user', { email: query.caseInsensitive(email) }, err));
            }

            if (!user) {
                return res.json(400, { message: 'Email address was not found!' });
            }

            user.registrationId = uid.v4();

            user.save(function (err) {
                var link = req.protocol + '://' + req.host + '/sign-in#/set-password/' + user.registrationId;

                if (req.app.settings.port != 80) {
                    link = req.protocol + '://' + req.host + ':' + req.app.settings.port + '/sign-in#/set-password/' + user.registrationId;
                }

                passwordResetEmail.send({
                    to: user.email,
                    link: link,
                    name: user.name
                });

                res.send(200);
            });
        });
    });

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
                    return res.send(landing);
                });
            }else if(page.UrlConfiguration.barcodeGenerated){
                codeConverter.toBar(page.urlConfiguration.barcodeData, function (err, dataUrl){
                    if (err) {
                        return next(Error.create('Ocurrió un error al convertir a código de barras.', err));
                    }
                    landing += dataUrl;
                    return res.send(landing);
                });
            }else{
                return res.send(landing);
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
                    return res.send(landing);
                });
            }else if(customPage.UrlConfiguration.barcodeGenerated){
                codeConverter.toBar(customPage.urlConfiguration.barcodeData, function (err, dataUrl){
                    if (err) {
                        return next(Error.create('Ocurrió un error al convertir a código de barras.', err));
                    }
                    landing += dataUrl;
                    return res.send(landing);
                });
            }else{
                return res.send(landing);
            }
        });
    });

    return router;
};