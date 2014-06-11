var model = app.model,
    validate = app.validation.validate;

module.exports = function (router) {
    router.get('/campaigns', function (req, res, next) {
        model.Campaign.find({}, function (err, campaigns) {
            if (err) {
                return next(Error.create('An error occurred trying get the Campaigns.', { }, err));
            }
            res.json(campaigns);
        });
    });
};
