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
};
