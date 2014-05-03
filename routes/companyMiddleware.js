var model = app.model;
module.exports = function () {
    return function (req, res, next) {
        model.Company.findById(req.user.company, function (err, company) {
            if (err) {
                return next(Error.create('An error occurred trying get the Company.', { }, err));
            }
            req.company = company;
            next();
        });
    }
};