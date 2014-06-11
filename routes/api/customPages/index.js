var model = app.model,
    validate = app.validation.validate;

module.exports = function (router) {
    router.get('/customPages', function (req, res, next) {
        model.Contact.find({}, function (err, customPages) {
            if (err) {
                return next(Error.create('An error occurred trying get the Custom Pages.', { }, err));
            }
            res.json(customPages);
        });
    });
};
