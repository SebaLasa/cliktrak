var CodeConverter = require("../../../services/codeConverter");

module.exports = function (router) {
    router.get('/barcode/:sizing/:string', function (req, res, next) {
        var data = req.params.string;
        CodeConverter.toBarcode(data, {scale: req.params.sizing}, function (err, img) {
            if (err) {
                return next(Error.create('An error occurred trying to create the barcode.', { }, err));
            }
            // TODO unhardcode mimeType
            res.writeHead(200, { 'Content-Type': 'image/gif' });
            res.end(img, 'binary');
        });
    });

    router.get('/qr/:sizing/:string', function (req, res, next) {

        var data = req.params.string;
        data = new Buffer(data, 'base64').toString('ascii');
        CodeConverter.toQR(data, {scale: req.params.sizing}, function (err, img) {
            if (err) {
                return next(Error.create('An error occurred trying to create the barcode.', { }, err));
            }
            // TODO unhardcode mimeType
            res.writeHead(200, { 'Content-Type': 'image/gif' });
            res.end(img, 'binary');
        });
    });

    return router;
};
