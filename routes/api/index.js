var fs = require('fs'),
    express = require('express');

function loadModules(folder, router) {
    // Loading modules dynamically
    var modules = fs.readdirSync(folder)
        .filter(function (e) {
            return e.indexOf('.') == -1 && e.indexOf("api.") == -1;
        });

    modules.forEach(function (e) {
        console.log('Loading', e, 'api...');
        router.use(require('./' + e)(express.Router()));
    });
}

module.exports = function (router) {
    loadModules('./routes/api', router);
    return router;
};