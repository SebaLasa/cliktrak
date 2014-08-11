var qrcode = require('qrcode');
var Barc = require('barcode-generator');
var Canvas = require('canvas');

module.exports.toQR = function (data, callback) {
    qrcode.toDataURL(data, function (err, dataUrl) {
        callback(err, '<img src="' + dataUrl + '" />');
    })
};

module.exports.toBarcode = function (data, callback) {
    var barc = new Barc();
    var Image = Canvas.Image;
    var canvas = new Canvas(300,200);
    var ctx = canvas.getContext('2d');

    //create a 300x200 px barcode image
    var img = new Image;
    img.src = barc.code2of5(data, 300, 200);
    ctx.drawImage(img, 0, 0);

    canvas.toDataURL(function (err, dataUrl) {
        callback(err, '<img src="' + dataUrl + '" />');
    })
};