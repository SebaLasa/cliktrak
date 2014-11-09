var _ = require('lodash');


var defaultSize = 70;

module.exports.gluePage = function (layout, content, template) {
    /*var page = '<html><head><link rel="stylesheet" href="/stylesheets/landing.css"></head>'
        + '<body style="background-color:' + layout.bodyBackgroundColor
        + ';"><div class="header" style="background-color:' + layout.headerBackgroundColor + ';"><img src="/'
        + layout.image + '"/></div>';
    page += '<div class="content">';
    page += content;
    page += '</div><div class="footer" style="background-color:' + layout.footerBackgroundColor + ';">'+ layout.footer + '</div></body></html>';
    return page;*/
    template = template.replace('{{bodyBackgroundColor}}',layout.bodyBackgroundColor);
    template = template.replace('{{headerBackgroundColor}}',layout.headerBackgroundColor);
    template = template.replace('{{footerBackgroundColor}}',layout.footerBackgroundColor);
    template = template.replace('{{headerImage}}',layout.image);
    template = template.replace('{{content}}',content);
    template = template.replace('{{footer}}',layout.footer);
    return template;

};

module.exports.replaceStaticCodes = function (page, content) {
    if (page.qrGenerated) {
        content = content.replace('src="images/codes/qrS.png"', 'src="/public-api/qr/' + (page.qrSize ? page.qrSize : defaultSize) + '/'+ Buffer(page.qrData).toString('base64') + '"');
    }
    if (page.barcodeGenerated) {
        content = content.replace('src="images/codes/bcS.png"', '<img src="/public-api/barcode/' + page.barcodeSize + '/' + page.barcodeData + '"');
    }
    return content;
};


module.exports.replaceDynamicCodes = function (customPage,customValues, content) {
    _.forEach(customPage.barcodes,function (data,index){
        content = content.replace('src="images/codes/bc'+index+'.png"', 'src="/public-api/barcode/' + defaultSize + '/' + customValues[data.value] + '"');
    });

    _.forEach(customPage.qrCodes,function (data,index){
        content = content.replace('src="images/codes/qr'+index+'.png"', 'src="/public-api/qr/' + defaultSize + '/' + new Buffer(customValues[data.value]).toString('base64') + '"');
    });
    return content;
};

module.exports.replaceDynamicCodesPreviewMode = function (content) {


    content = content.replace('src="images/codes/', 'src="/images/codes/');

    return content;

};

module.exports.replaceParameters = function (customValues, content) {
    _.forEach(_.range(15), function (x) {
        var searchString = '[[Parametro ' + (parseInt(x)+1) + ']]';
        var replaceValue = customValues["parameter"+x] || '';
        content = content.replace(searchString, replaceValue)
    });
    return content
};