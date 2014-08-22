var model = app.model;
/**
 * Returns a middleware that loads the user's company in the req.company.
 * @returns {Function} A middleware that loads the user's company.
 */

function getDevice(userAgent){
    var agent = userAgent.toLowerCase();
    if (agent.indexOf("blackberry") > -1)
        return "blackberry";
    if (agent.indexOf("ipad") > -1)
        return "iPad";
    if (agent.indexOf("ipod") > -1)
        return "iPod";
    if (agent.indexOf("iphone") > -1)
        return "iPhone";
    if (agent.indexOf("android") > -1)
        return "android";
    if (agent.indexOf("symbian") > -1)
        return "symbian";
    if (agent.indexOf("windows ce") > -1)
        return "windowsCE";
    if (agent.indexOf("windows phone os") > -1)
        return "windowsCE";
    if (agent.indexOf("windows") > -1)
        return "windows";
    if (agent.indexOf("mac") > -1)
        return "mac";
    if (agent.indexOf("linux") > -1)
        return "linux";
    return "other";
}

module.exports = function () {
    return function (req, res, next) {

        // TODO: Should this request be tracked?

        var agent = req.headers['user-agent'];
        console.log(getDevice(agent));
        var click = new model.TrackedClick();
        click.ipAddress = req.ip;
        click.timestamp = new Date();
        click.device = getDevice(agent);
        click.agent = agent;
        // TODO: Populate menu, page, custom page
        click.save(function(err){
            next();
        });

    }
};