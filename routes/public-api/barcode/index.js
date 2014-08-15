/**
 * Created by nico on 8/15/14.
 */
var CodeConverter = require("../../../services/codeConverter")

module.exports = function (router) {
    router.get('/barcode/:string', function (req, res, next) {
        var data= req.params.string;
        CodeConverter.toBarcode(data,function(err,img){
           if(err){
               return next(Error.create('An error occurred trying to create the barcode.', { }, err));
           }

           res.writeHead(200, {'Content-Type': 'image/png'});
           res.end(img);
        });
    });

    router.get('/qr/:string', function (req, res, next) {
        var data= req.params.string;
        CodeConverter.toQR(data,function(err,img){
            if(err){
                return next(Error.create('An error occurred trying to create the barcode.', { }, err));
            }

            res.writeHead(200, {'Content-Type': 'image/png'});
            res.end(img);
        });
    });

    return router;
};