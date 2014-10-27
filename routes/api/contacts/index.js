var model = app.model,
    validate = app.validation.validate,
    async = require('async'),
    multiparty = require('multiparty'),
    csvparse = require('csv-parse');

module.exports = function (router) {
    router.get('/contacts', function (req, res, next) {
        model.Contact.find({ company: req.company._id, deleted: false}).sort('name').sort('surname').exec(function (err, contacts) {
            if (err) {
                return next(Error.create('An error occurred trying get the Contacts.', { }, err));
            }
            res.json(contacts);
        });
    });

    router.get('/contacts/:id', function (req, res, next) {
        if (!validate.objectId(req.params.id)) {
            return res.status(400).end();
        }
        model.Contact.findOne({_id: req.params.id, deleted: false, company: req.company._id}, function (err, contact) {
            if (err) {
                return next(Error.create('An error occurred trying get the Contact.', { }, err));
            }
            if (!contact) {
                return res.status(404).end();
            }
            res.json(contact);
        });
    });

    router.post('/contacts/upload', function (req, res, next) {
        //TODO: Validar si los contactos ya existe
        var form = new multiparty.Form();
        var upload = {options: ''};
        form.on('error', next);
        form.on('close', function () {
            var options = JSON.parse(upload.options);
            csvparse(upload.data, {columns: true}, function (err, output) {
                async.each(output, function (data, callback) {
                    if (!options.uploadType) {
                        callback('No se especificó un método de actualización');
                        return;
                    }
                    if (options.uploadType == 'new') {
                        model.Contact.findOne({email: data.email, company: req.company._id, deleted: false}, function (err, contactDuplicate) {
                            if (err) {
                                callback('Ocurrió un error tratando de crear un contacto.');
                                return;
                            }
                            if (contactDuplicate) {
                                callback('Ya existe un contacto con ese mail.');
                                return;
                            }
                            var contact = new model.Contact(data);
                            contact.editor = req.user._id;
                            contact.company = req.company._id;
                            contact.save(callback);
                        });
                    }
                    var query = {deleted: false}; //TODO: Remove once unique fields are validated

                    if (options.matchEmail) {
                        query.email = data.email;
                    }
                    if (options.matchTelephone) {
                        query.telephone = data.telephone;
                    }
                    if (options.matchMobile) {
                        query.mobilePhone = data.mobilePhone;
                    }
                    query.company = req.company._id;

                    if (options.uploadType == 'remove') {
                        model.Contact.findOne(query, function (err, contact) {
                            if (err) {
                                //TODO: Batch logging
                                callback('Ocurrió un error tratando de borrar un contacto.');
                                return;
                            }

                            if (!contact || contact.deleted) {
                                callback();
                                return;
                            }
                            contact.deleted = true;
                            contact.save(function (err) {
                                if (err) {
                                    callback('Ocurrió un error tratando de borrar un contacto.');
                                    return;
                                }
                                callback();
                                return;
                            });

                        });
                    }
                    if (options.uploadType == 'edit') {
                        model.Contact.findOneAndUpdate(query, data, function (err, contact) {
                            if (err) {
                                //TODO: Batch logging
                                callback('Ocurrió un error tratando de actualizar un contacto.');
                                return;
                            }
                            if (!contact) {
                                var newContact = new model.Contact(data);
                                newContact.editor = req.user._id;
                                newContact.company = req.company._id;
                                newContact.save(callback);
                                return;
                            }
                            callback();
                        });
                    }

                }, function (err) {
                    if (err) {
                        return next(Error.create('Ocurrió un error tratando de guardar un contacto.', { }, err));
                    }
                    res.redirect('/back#/contacts');
                });
            });
        });

        // listen on part event for image file
        form.on('part', function (part) {
            if (part.name == 'options') {
                part.on('data', function (buffer) {
                    upload.options += buffer;
                });
            }
            if (part.name == 'file') {
                upload.data = '';
                part.on('data', function (buffer) {
                    upload.data += buffer;
                });
            }
        });

        // parse the form
        form.parse(req);
    });

    router.post('/contacts', function (req, res, next) {
        var fields = validate.required(req.body, ['name', 'email']);
        if (fields.length) {
            return next(Error.http(400, 'Por favor complete todos los campos requeridos.', { fields: fields }));
        }
        var contact = new model.Contact(req.body);
        contact.editor = req.user._id;
        contact.company = req.company._id;

        contact.save(function (err, contact) {
            if (err) {
                return next(Error.create('An error occurred trying save the Contact.', { }, err));
            }
            res.status(201).end();
        });
    });

    router.put('/contacts/:id', function (req, res, next) {
        var fields = validate.required(req.body, ['name', 'email']);
        if (fields.length) {
            return next(Error.http(400, 'Por favor complete todos los campos requeridos.', { fields: fields }));
        }
        delete req.body._id;
        req.body.editor = req.user._id;
        model.Contact.findByIdAndUpdate(req.params.id, req.body, function (err, contact) {
            if (err) {
                return next(Error.create('An error occurred trying update the Contact.', { }, err));
            }
            res.status(200).end();
        });
    });

    router.delete('/contacts/:id', function (req, res, next) {
        model.Contact.findById(req.params.id, function (err, contact) {
            if (err) {
                return next(Error.create('An error occurred trying get the Contact.', { }, err));
            }
            if (!contact || contact.deleted || !req.company._id.equals(contact.company)) {
                return res.status(404).end();
            }
            contact.deleted = true;
            contact.save(function (err) {
                if (err)
                    return next(Error.create('An error occurred trying delete the Contact.', { }, err));
                res.status(200).end();
            });

        });
    });

    return router;
};
