module.exports = function () {
    var urlBase = 'http://' + app.config.server.host;
    if (app.config.server.port != 80) {
        urlBase += ':' + app.config.server.port;
    }
    return urlBase;
};
