var _ = require('lodash');


var defaultSize = 70;

module.exports.gluePage = function (layout, content) {
    var page = '<html><body><div class="header"><img src="/' + layout.image + '"/></div>';
    page += '<div class="content">';
    page += content;
    page += '</div><div class="footer" style="background-color:' + layout.footerBackgroundColor + ';">' + layout.footer + '</div></body></html>';
    return page;
};

module.exports.replaceStaticCodes = function (page, content) {
    if (page.qrGenerated) {
        content = content.replace('<img class="staticQr" src="images/codes/qrS.png" alt="" />', '<img src="/public-api/qr/' + (page.qrSize ? page.qrSize : defaultSize) + '/'
            + page.qrData + '" />');
    }
    if (page.barcodeGenerated) {
        content = content.replace('<img class="staticBarcode" src="images/codes/bcS.png" alt="" />', '<img src="/public-api/barcode/' + page.barcodeSize + '/'
            + page.barcodeData + '" />');
    }
    return content;
};


module.exports.replaceDynamicCodes = function (customPage,customValues, content) {
    _.forEach(customPage.barcodes,function (data,index){
        content = content.replace('<img class="dynamicBarcode dynamicBarcode'+index+'" src="images/codes/bc'+index+'.png" alt="" />', '<img src="/public-api/barcode/' + defaultSize + '/'
            + customValues[data.value] + '" />');
    });

    _.forEach(customPage.qrCodes,function (data,index){
        content = content.replace('<img class="dynamicQr dynamicQr'+index+'" src="images/codes/qr'+index+'.png" alt="" />', '<img src="/public-api/qr/' + defaultSize + '/'
            + customValues[data.value] + '" />');
    });
    return content;
};

module.exports.replaceParameters = function (customValues, content) {
    var columns = _.map(_.range(15), function (x) {
        return 'parameter' + x;
    });
    _.forEach(columns, function (x) {
        var searchString = '[[' + x + ']]';
        var replaceValue = customValues[x] || '';
        content = content.replace(searchString, replaceValue)
    });
    return content
};