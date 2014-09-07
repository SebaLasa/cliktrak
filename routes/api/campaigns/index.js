var model = app.model,
    validate = app.validation.validate;

module.exports = function (router) {
    router.get('/run',function(req,res,next){
       require('../../../services/emailingTask').run();
        res.status(200).send();
    });
    router.get('/campaigns', function (req, res, next) {
        model.Campaign.find({deleted:false}).populate('editor').exec(function (err, campaigns) {
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
        var campaign = new model.Campaign(req.body.campaign);
        campaign.company = req.company._id;
        campaign.editor = req.user._id;
        campaign.internalId = 0;
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
            // TODO AN contact list for emailing.
            email.save(function (err, email) {
                if (err) {
                    return next(Error.create('An error occurred trying save the Email Task.', { }, err));
                }
                res.status(201).end();
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
