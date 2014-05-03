module.exports = function (loginPage) {
    return  function (req, res, next) {
        if (req.session.user) {
            req.user = req.session.user;
            return next();
        }
        console.log('User not authenticated'.red);
        // Not Authenticated
        if (req.xhr) {
            // If ajax.
            return res.json(403, { message: 'You don\'t have a session opened'});
        }
        res.redirect(loginPage);
    };
};
