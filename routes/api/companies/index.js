var model = app.model,
    validate = app.validation.validate;

module.exports = function (router) {

    router.get('/companies', function (req, res, next) {
        model.Company.find({deleted: false},function (err, companies) {
            if (err) {
                return next(Error.create('An error occurred trying get the Companies.', { }, err));
            }
            res.json(companies);
        });
    });

    router.get('/companies/:id', function (req, res, next) {
        if (!validate.objectId(req.params.id)) {
            return res.status(400).end();
        }
        model.Company.findById(req.params.id, function (err, campaign) {
            if (err) {
                return next(Error.create('An error occurred trying get the Company.', { }, err));
            }
            res.json(campaign);
        });
    });

    router.post('/companies', function (req, res, next) {
        var company = new model.Company(req.body);
        model.Company.find().sort('-internalId').limit(1).findOne(function (err, maxComp){
            if (err){
                company.internalId = 0;
            }else{
                company.internalId = maxComp.internalId +1;
            }
            company.save(function (err, company) {
                if (err) {
                    return next(Error.create('An error occurred trying save the company.', { }, err));
                }
                res.status(201).end();
            });
        })

    });

    router.put('/companies/:id', function (req, res, next) {
        delete req.body._id;
        model.Company.findByIdAndUpdate(req.params.id, req.body, function (err, company) {
            if (err) {
                return next(Error.create('An error occurred trying update the Company.', { }, err));
            }
            res.status(200).end();
        });
    });

    router.delete('/companies/:id', function (req, res, next) {
        req.body.deleted= true;
        model.Company.findByIdAndUpdate(req.params.id, req.body, function (err, campaign) {
            if (err) {
                return next(Error.create('An error occurred trying delete the Company.', { }, err));
            }
            res.status(200).end();
        });
    });

    return router;
};
