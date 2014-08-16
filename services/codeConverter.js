var qrimage = require('qr-image');
var Barc = require('barc');

/**
 * data : String to convert to qr
 * callback: function (err,data)
 * data is a Buffer containing the image as png
 * @param data
 * @param callback
 */

module.exports.toQR = function (data, callback) {
    var chunks = 0
    var bufs = []
    var qr = qrimage.image(data, { type: 'png' })

    .on('data', function(chunk){
            bufs[chunks++]=chunk;
        })
    .on('end', function () {
        data = Buffer.concat(bufs);
        var imgBase64 = data.toString('base64');
        callback(null, '<img src="data:image/png;base64,' + imgBase64 + '" />');
    })
    .on("error",function (err){
        callback(err,null);
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

    callback(null,'<img src="data:image/png;base64,' + imgBase64 + '" />');
};