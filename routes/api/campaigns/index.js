var model = app.model,
    validate = app.validation.validate;

module.exports = function (router) {
    router.get('/campaigns', function (req, res, next) {
        model.Campaign.find({}, function (err, campaigns) {
            if (err) {
                return next(Error.create('An error occurred trying get the Campaign.', { }, err));
            }
            res.json(campaigns);
        });
    });

    router.get('/campaigns/:id', function (req, res, next) {
        if (!validate.objectId(req.params.id)) {
            return res.status(400).end();
        }
        model.Campaign.findById(req.params.id, function (err, campaign) {
            if (err) {
                return next(Error.create('An error occurred trying get the Campaign.', { }, err));
            }
            res.json(campaign);
        });
    });

    router.post('/campaigns', function (req, res, next) {
        var campaign = new model.Campaign(req.body);
        campaign.company = req.company._id;
        campaign.editor = req.user._id;
        campaign.save(function (err, campaign) {
            if (err) {
                return next(Error.create('An error occurred trying save the Campaign.', { }, err));
            }
            res.status(201).end();
        });
    });

    router.put('/campaigns/:id', function (req, res, next) {
        model.Campaign.findByIdAndUpdate(req.params.id, req.body, function (err, campaign) {
            if (err) {
                return next(Error.create('An error occurred trying update the Campaign.', { }, err));
            }
            res.status(200).end();
        });
    });

    router.delete('/campaigns/:id', function (req, res, next) {
        model.Campaign.findByIdAndUpdate(req.params.id, req.body, function (err, campaign) {
            if (err) {
                return next(Error.create('An error occurred trying delete the Campaign.', { }, err));
            }
            res.status(200).end();
        });
    });

    return router;
};
