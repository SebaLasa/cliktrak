/**
 * Returns the app url.
 * @param subdomain The subdomain to add to the url.
 * @returns {string} The app url.
 */
module.exports = function (subdomain) {
    var urlBase = 'http://';
    if (subdomain) {
        urlBase += subdomain + '.';
    }
    urlBase += app.config.server.host;
    if (app.config.server.port != 80) {
        urlBase += ':' + app.config.server.port;
    }
    return urlBase;
};
