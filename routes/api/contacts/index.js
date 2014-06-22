var model = app.model,
    validate = app.validation.validate;

module.exports = function (router) {
    router.get('/contacts', function (req, res, next) {
        model.Contact.find({}, function (err, contacts) {
            if (err) {
                return next(Error.create('An error occurred trying get the Contacts.', { }, err));
            }
            res.json(contacts);
        });
    });

    router.get('/contacts/:id', function (req, res, next) {
        if (!validate.objectId(req.params.id)) {
            return res.send(400);
        }
        model.Contact.findById(req.params.id, function (err, contact) {
            if (err) {
                return next(Error.create('An error occurred trying get the Contact.', { }, err));
            }
            res.json(contact);
        });
    });

    router.post('/contacts', function (req, res, next) {
        var contact = new model.Contact(req.body);
        contact.save(function (err, contact) {
            if (err) {
                return next(Error.create('An error occurred trying save the Contact.', { }, err));
            }
            res.send(201);
        });
    });

    router.put('/contacts/:id', function (req, res, next) {
        model.Contact.findByIdAndUpdate(req.params.id, req.body, function (err, contact) {
            if (err) {
                return next(Error.create('An error occurred trying update the Contact.', { }, err));
            }
            res.send(200);
        });
    });

    router.delete('/contacts/:id', function (req, res, next) {
        model.Contact.findByIdAndUpdate(req.params.id, req.body, function (err, contacts) {
            if (err) {
                return next(Error.create('An error occurred trying delete the Contact.', { }, err));
            }
            res.send(200);
        });
    });

    return router;
};
