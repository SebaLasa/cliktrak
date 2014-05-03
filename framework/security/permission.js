module.exports = function (permission) {
    return function (req, res, next) {
        if (permission && req.user.permissions.indexOf(permission) == -1) {
            if (req.xhr) {
                // If ajax.
                return res.json(403, { message: 'You don\'t have permission to perform this action.'});
            }
            return res.redirect(app.config.auth.loginPage);
        }
        next();
    }
};