var debug = require('debug')('authenticate');

/**
 * Returns a middleware that checks that the user has a session.
 * @param loginPage
 * @returns {Function} A middleware that checks the user's session.
 */
module.exports = function (section, loginPage) {
    return  function (req, res, next) {
        var isAdmin = (section == "admin");
        if (req.session.user) {
            req.user = req.session.user;
            if (!isAdmin){
                return next();
            }
            if (req.user.admin){
                return next();
            }
        }

        debug('User not authenticated');
        if (req.xhr) {
            // If ajax.
            return res.json(403, { message: 'You don\'t have a session opened'});
        }
        res.redirect(loginPage || app.config.auth.loginPage);
    };
};