var qrimage = require('qr-image');
//no puedo usar este modulo en windows.
//var Barc = require('barc');

/**
 * data : String to convert to qr
 * callback: function (err,data)
 * data is a Buffer containing the image as png
 * @param data
 * @param callback
 */

module.exports.toQR = function (data, callback) {
    var chunks = 0;
    var buffer = [];
    qrimage.image(data, { type: 'png' })
        .on('data', function (chunk) {
            buffer[chunks++] = chunk;
        })
        .on('end', function () {
            var imgBase64 = Buffer.concat(buffer).toString('base64');
            callback(null, '<img src="data:image/png;base64,' + imgBase64 + '" />');
        })
        .on('error', function (err) {
            callback(err, null);
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
    var barc = new Barc();

    //create a 300x200 px barcode image
    var img = barc.code2of5(data, 300, 200);
    var imgBase64 = new Buffer(img, 'binary').toString('base64');
    callback(null, '<img src="data:image/png;base64,' + imgBase64 + '" />');
};
