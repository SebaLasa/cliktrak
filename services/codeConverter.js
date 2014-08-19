var bwipjs = require('node-bwipjs-ng');

/**
 * data : String to convert to qr
 * callback: function (err,data)
 * data is a Buffer containing the image as png
 * @param data
 * @param callback
 */
module.exports.toQR = function (data, callback) {
    var img = bwipjs.createQR(data, function (png) {
        var imgBase64 = new Buffer(png, 'binary').toString('base64');
        callback(null, '<img src="data:image/png;base64,' + imgBase64 + '" />');
    });
};

/**
 * data : String to convert to qr
 * callback (err,data)
 * data is a Buffer containing the image as png
 * @param data
 * @param callback
 */
module.exports.toBarcode = function (data, callback) {
    var img = bwipjs.createBarcode(data, function (png) {
        var imgBase64 = new Buffer(png, 'binary').toString('base64');
        callback(null, '<img src="data:image/png;base64,' + imgBase64 + '" />');
    });
};
