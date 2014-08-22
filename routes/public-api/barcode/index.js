/**
 * Created by nico on 8/15/14.
 */
var CodeConverter = require("../../../services/codeConverter")

module.exports = function (router) {
    router.get('/barcode/:sizing/:string', function (req, res, next) {
        var data= req.params.string;
        CodeConverter.toBarcode(data,{scale:req.params.sizing},function(err,img){
           if(err){
               return next(Error.create('An error occurred trying to create the barcode.', { }, err));
           }

           res.send(img);
        });
    });

    router.get('/qr/:sizing/:string', function (req, res, next) {
        var data= req.params.string;
        CodeConverter.toQR(data,{scale:req.params.sizing},function(err,img){
            if(err){
                return next(Error.create('An error occurred trying to create the barcode.', { }, err));
            }

            res.send(img);
        });
    });

    return router;
};