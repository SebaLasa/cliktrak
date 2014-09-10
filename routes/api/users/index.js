var model = app.model,
    hash = app.security.hash,
    validate = app.validation.validate;

module.exports = function (router) {

    router.get('/users/generateAdmin', function (req, res, next) {
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
    });

    return router;
};
