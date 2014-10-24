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

        model.Campaign.findOne({_id: req.params.id, deleted: false, company: req.company._id}).populate(['editor', 'page', 'customPage']).exec( function (err, campaign) {
            if (err) {
                return next(Error.create('An error occurred trying get the Campaign.', { }, err));
            }
            model.emailing.Task.findOne({campaign: campaign._id}).populate('contacts').exec(function (err, mail) {
                if (err) {
                    return next(Error.create('An error occurred trying get the Email.', { }, err));
                }

                var data = { campaign: campaign, email: mail };

                res.json(data);
            });
        });

    });

    router.post('/campaigns', function (req, res, next) {
        var fields = validate.required(req.body.campaign, ['name']);
        fields.concat(validate.required(req.body.email, ['subject', 'message', 'dateStart', 'dateEnd']));
        if (fields.length) {
            return next(Error.http(400, 'Por favor complete todos los campos requeridos.', { fields: fields }));
        }
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
        delete req.body.campaign._id;
        model.Campaign.findByIdAndUpdate(req.params.id, req.body.campaign, function (err, campaign) {
            if (err) {
                return next(Error.create('An error occurred trying update the Campaign.', { }, err));
            }
            var id = req.body.email._id;
            delete req.body.email._id;
            req.body.email.campaign = campaign._id;
            req.body.email.editor = campaign.editor;
            if (campaign.page) {
                req.body.email.page = campaign.page;
            }
            if (campaign.customPage) {
                req.body.email.customPage = campaign.customPage;
            }
            model.emailing.Task.findByIdAndUpdate(id, req.body.email, function (err, emailing) {
                if (err) {
                    return next(Error.create('An error occurred trying update the Email.', { }, err));
                }
                res.status(200).end();
            });
        });
    });


    router.delete('/campaigns/:id', function (req, res, next) {

        var campaign = {
            editor: req.user._id,
            company: req.company._id,
            status: false,
            deleted: true
        };
        model.Campaign.findOneAndUpdate({_id: req.params.id, deleted: false, company: req.company._id}, campaign, function (err, campaign) {
            if (err) {
                return next(Error.create('An error occurred trying delete the Campaign.', { }, err));
            }
            if (!campaign) {
                return res.status(404).end();
            }
            res.status(200).end();
        });
    });

    router.post('/campaigns/enable/:id', function (req, res, next) {
        var campaign = { status: req.body.enabled };
        model.Campaign.findOneAndUpdate({_id: req.params.id, deleted: false, company: req.company._id}, campaign, function (err, campaign) {
            if (err) {
                return next(Error.create('An error occurred trying change the status.', { }, err));
            }
            if (!campaign) {
                return res.status(404).end();
            }
            res.status(200).end();
        });
    });

    return router;
};
