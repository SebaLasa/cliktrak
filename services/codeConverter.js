var bwipjs = require('node-bwipjs-ng');

function generateBarcode(data, cb) {
    var img = bwipjs.createBarcode(data, function (png) {
        var imgBase64 = new Buffer(png, 'binary').toString('base64');

        cb(null, '<img src="data:image/png;base64,' + imgBase64 + '" />');
    });
}

/**
 * Convert a string to a QR
 * @param text String to convert to QR
 * @param options scale, rotate params
 * @param callback (err, data) data is a Buffer containing the image as png
 */
module.exports.toQR = function (text, options, callback) {
    options |= {};
    generateBarcode({
        text: text,
        type: 'qrcode',
        scale: options.scale || 2,
        rotate: options.rotate || 'N'
    }, callback);
};

/**
 * Convert a string to a barcode
 * @param text String to convert to barcode
 * @param options scale, rotate params
 * @param callback (err,data) data is a Buffer containing the image as png
 */
module.exports.toBarcode = function (text, options, callback) {
    options |= {};
    generateBarcode({
        text: text,
        type: 'interleaved2of5',
        scale: options.scale || 2,
        rotate: options.rotate || 'N'
    }, callback);
};
