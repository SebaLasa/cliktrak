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
            return res.send(400);
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
        campaign.save(function (err, campaign) {
            if (err) {
                return next(Error.create('An error occurred trying save the Campaign.', { }, err));
            }
            res.send(201);
        });
    });

    router.put('/campaigns/:id', function (req, res, next) {
        model.Campaign.findByIdAndUpdate(req.params.id, req.body, function (err, campaign) {
            if (err) {
                return next(Error.create('An error occurred trying update the Campaign.', { }, err));
            }
            res.send(200);
        });
    });

    router.delete('/campaigns/:id', function (req, res, next) {
        model.Campaign.findByIdAndUpdate(req.params.id, req.body, function (err, campaign) {
            if (err) {
                return next(Error.create('An error occurred trying delete the Campaign.', { }, err));
            }
            res.send(200);
        });
    });

    return router;
};
