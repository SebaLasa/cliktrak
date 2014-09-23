var model = app.model,
    validate = app.validation.validate;

module.exports = function (router) {
    router.get('/run', function (req, res, next) {
        require('../../../services/emailingTask').run();
        res.status(200).send();
    });
    router.get('/campaigns', function (req, res, next) {
        model.Campaign.find({company: req.company._id, deleted: false}).populate('editor').exec(function (err, campaigns) {
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
        model.Campaign.findOne({_id: req.params.id, deleted: false, company: req.company._id}, function (err, campaign) {
            if (err) {
                return next(Error.create('An error occurred trying get the Campaign.', { }, err));
            }
            res.json(campaign);
        });
    });

    router.post('/campaigns', function (req, res, next) {
        var campaign = new model.Campaign(req.body.campaign);
        campaign.company = req.company._id;
        campaign.editor = req.user._id;
        model.Campaign.find().sort('-internalId').limit(1).findOne(function (err, lastCampaign) {
            if (err) {
                return next(Error.create('An error occurred trying get the last Campaign.', { }, err));
            }
            campaign.internalId = lastCampaign ? lastCampaign.internalId + 1 : 1;
            campaign.save(function (err, campaign) {
                if (err) {
                    return next(Error.create('An error occurred trying save the Campaign.', { }, err));
                }
                var email = new model.emailing.Task(req.body.email);
                email.company = campaign.company;
                email.campaign = campaign._id;
                email.editor = campaign.editor;
                email.page = campaign.page;
                email.customPage = campaign.customPage;
                email.state = model.enums.taskStates[0];
                email.save(function (err, email) {
                    if (err) {
                        return next(Error.create('An error occurred trying save the Email Task.', { }, err));
                    }
                    res.status(201).end();
                });
            });
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
