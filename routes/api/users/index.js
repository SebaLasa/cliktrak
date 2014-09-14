var model = app.model,
    hash = app.security.hash,
    validate = app.validation.validate;

module.exports = function (router) {

    /*router.get('/users/generateAdmin', function (req, res, next) {
     model.Company.findOne({internalId:0}, function (err, company){
     if (err) {
     return next(Error.create('An error occurred trying get the root company.', err));
     }
     var adminUser = new model.User();
     adminUser.name = "Super Admin";
     adminUser.company = company;
     adminUser.email = "admin@clicktrack.com";
     adminUser.password = hash("admin123456");
     adminUser.save(function(err){
     if (err) {
     return next(Error.create('An error occurred creating superAdminUser', err));
     }
     res.send("SuperAdmin creado");
     });
     });
     });*/

    router.get('/users', function (req, res, next) {
        model.User.find({deleted: false}).populate("company").exec(function (err, users) {
            if (err) {
                return next(Error.create('An error occurred trying get the Users.', { }, err));
            }
            res.json(users);
        });
    });

    router.get('/users/:id', function (req, res, next) {
        if (!validate.objectId(req.params.id)) {
            return res.status(400).end();
        }
        model.User.findById(req.params.id, function (err, user) {
            if (err) {
                return next(Error.create('An error occurred trying get the Company.', { }, err));
            }
            user.password = '';
            res.json(user);
        });
    });

    router.post('/users', function (req, res, next) {
        var user = new model.User(req.body);
        user.password = hash(user.password);
        user.save(function (err, user) {
            if (err) {
                return next(Error.create('An error occurred trying save the company.', { }, err));
            }
            res.status(201).end();
        });

    });

    router.put('/users/:id', function (req, res, next) {
        delete req.body._id;
        if (req.body.password) {
            req.body.password = hash(req.body.password);
        } else {
            delete req.body.password;
        }
        model.User.findByIdAndUpdate(req.params.id, req.body, function (err, user) {
            if (err) {
                return next(Error.create('An error occurred trying update the Company.', { }, err));
            }
            res.status(200).end();
        });
    });

    router.delete('/users/:id', function (req, res, next) {
        req.body.deleted = true;
        model.User.findByIdAndUpdate(req.params.id, req.body, function (err, user) {
            if (err) {
                return next(Error.create('An error occurred trying delete the Company.', { }, err));
            }
            res.status(200).end();
        });
    });

    return router;
};
