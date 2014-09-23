var _ = require('lodash');

    module.exports.gluePage = function (layout, content){
    var page = '<html><body><div class="header"><img src="/'+layout.image+'"/></div>';
    page += '<div class="content">';
    page += content;
    page += '</div><div class="footer" style="background-color:'+layout.footerBackgroundColor+';">'+layout.footer+'</div></body></html>'
    return page;
}

module.exports.replaceCodes = function (urlConfiguration, content){
    if (urlConfiguration.qrGenerated) {
        content =content.replace('<img class="staticQr" src="images/codes/qrS.png" alt="" />','<img src="/public-api/qr/' + (urlConfiguration.qrSize ? urlConfiguration.qrSize : 70)  + '/'
            + urlConfiguration.qrData + '" />');
    }
    if (urlConfiguration.barcodeGenerated) {
        content =content.replace('<img class="staticBarcode" src="images/codes/bcS.gif" alt="" />','<img src="/public-api/barcode/' + urlConfiguration.barcodeSize + '/'
            +urlConfiguration.barcodeData + '" />');
    }
    return content;
}

module.exports.replaceParameters = function (customValues, content){

    var columns = _.map(_.range(15), function (x) {
        return 'parameter' + x;
    });
    _.forEach(columns,function (x){
        var searchString = '[['+x+']]';
        var replaceValue = customValues[x] ? customValues[x] : '';
        content = content.replace(searchString,replaceValue)
    });

    return content
}