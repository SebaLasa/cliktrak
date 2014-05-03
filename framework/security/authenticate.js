module.exports = function (loginPage) {
    return  function (req, res, next) {
        if (req.session.user) {
            req.user = req.session.user;
            return next();
        }

        debug('User not authenticated'.red);
        if (req.xhr) {
            // If ajax.
            return res.json(403, { message: 'You don\'t have a session opened'});
        }
        res.redirect(loginPage || app.config.auth.loginPage);
    };
};
