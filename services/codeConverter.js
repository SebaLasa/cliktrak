var bwipjs = require('node-bwipjs-ng');

function generateBarcode(data, cb){
    var img = bwipjs.createBarcode(data, function(png){
        var imgBase64 = new Buffer(png, 'binary').toString('base64');

        cb(null,'<img src="data:image/png;base64,' + imgBase64 + '" />');
    });
}

/**
 * text : String to convert to qr
 * opts : scale, rotate params
 * callback (err,data)
 * data is a Buffer containing the image as png
 * @param data
 * @param callback
 */

module.exports.toQR = function (text, opts, callback) {

    var data = {
        text: text,
        type : 'qrcode',
        scale : opts.scale || 2,
        rotate : opts.rotate || 'N'
    }

    generateBarcode(data, callback);

};

/**
 * text : String to convert to qr
 * opts : scale, rotate params
 * callback (err,data)
 * data is a Buffer containing the image as png
 * @param data
 * @param callback
 */
module.exports.toBarcode = function (text, opts, callback) {
    var data = {
        text: text,
        type : 'interleaved2of5',
        scale : opts.scale || 2,
        rotate : opts.rotate || 'N'
    }

    generateBarcode(data, callback);
};
