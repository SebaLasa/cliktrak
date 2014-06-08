var mongoose = require('mongoose'),
    timestamps = require('mongoose-timestamps'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

var model = module.exports;

model.Company = mongoose.model('companies', new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    enabled: { type: Boolean, required: true, default: true },
    deleted: { type: Boolean, required: true, default: false },
    timezone: { type: Number, required: true, default: 0 }
}));

model.User = mongoose.model('users', new Schema({
    company: { type: ObjectId, ref: 'companies', required: true },
    email: { type: String, required: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    enabled: { type: Boolean, required: true, default: true }
}));

model.Menu = mongoose.model('menus', new Schema({
    company: { type: ObjectId, ref: 'companies', required: true },
    name: { type: String, required: true },
    enabled: { type: Boolean, required: true, default: false }
}).plugin(timestamps));

model.MenuItem = mongoose.model('menuItems', new Schema({
    name: { type: String, required: true },
    tooltip: { type: String },
    page: { type: ObjectId, ref: 'pages' },
    customPage: { type: ObjectId, ref: 'customPages' },
    url: { type: String },
    ordinal: { type: Number },
    deleted: { type: Boolean, required: true, default: false }
}));

model.Layout = mongoose.model('layouts', new Schema({
    company: { type: ObjectId, ref: 'companies', required: true },
    editor: { type: ObjectId, ref: 'users', required: true },
    name: { type: String, required: true },
    footer: { type: String, required: true },
    footerBackgroundColor: { type: String, required: true },
    deleted: { type: Boolean, required: true, default: false }
}).plugin(timestamps));

model.Page = mongoose.model('pages', new Schema({
    company: { type: ObjectId, ref: 'companies', required: true },
    layout: { type: ObjectId, ref: 'layouts', required: true },
    urlConfiguration: { type: ObjectId, ref: 'urlConfigurations' },
    internalId: { type: Number, required: true },
    name: { type: String, required: true },
    title: { type: String, required: true },
    html: { type: String, required: true },
    enabled: { type: Boolean, required: true, default: true },
    deleted: { type: Boolean, required: true, default: false }
}).plugin(timestamps));

model.CustomPage = mongoose.model('customPages', new Schema({
    company: { type: ObjectId, ref: 'companies', required: true },
    page: { type: ObjectId, ref: 'pages', required: true },
    urlConfiguration: { type: ObjectId, ref: 'urlConfigurations' },
    name: { type: String, required: true },
    internalId: { type: Number, required: true },
    deleted: { type: Boolean, required: true, default: false }
}).plugin(timestamps));

model.PageImage = mongoose.model('pageImages', new Schema({
    page: { type: ObjectId, ref: 'pages', required: true },
    url: { type: String, required: true },
    deleted: { type: Boolean, required: true, default: false }
}));

model.TrackedClick = mongoose.model('trackedClicks', new Schema({
    ipAddress: { type: String, required: true },
    timestamp: { type: Date, required: true },
    device: { type: String },
    menu: { type: ObjectId, ref: 'menus' },
    page: { type: ObjectId, ref: 'pages' },
    customPage: { type: ObjectId, ref: 'customPages' },
    valueReference: { type: String },
    agent: { type: String }
}));

model.CustomPageValue = mongoose.model('customPageValue', new Schema({
    customPage: { type: ObjectId, ref: 'customPages', required: true },
    parameter0: { type: String },
    parameter1: { type: String },
    parameter2: { type: String },
    parameter3: { type: String },
    parameter4: { type: String },
    parameter5: { type: String },
    parameter6: { type: String },
    parameter7: { type: String },
    parameter8: { type: String },
    parameter9: { type: String },
    parameter10: { type: String },
    parameter11: { type: String },
    parameter12: { type: String },
    parameter13: { type: String },
    parameter14: { type: String },
    urlGenerated: { type: String }
}));

model.UrlConfiguration = mongoose.model('urlConfigurations', new Schema({
    urlRedirect: { type: String },
    urlExpired: { type: String },
    urlGenerated: { type: String },
    keywords: { type: String },
    qrGenerated: { type: Boolean, required: true, default: false },
    qrSize: { type: String },
    qrData: { type: String },
    barcodeGenerated: { type: Boolean, required: true, default: false },
    barcodeCodification: { type: String },
    barcodeData: { type: String },
    barcodeSize: { type: String },
    subdomain: { type: String, required: true },
    isTracked: { type: Boolean, required: true, default: false},
    canAccessWithoutData: { type: Boolean, required: true, default: false }
}));

loadModelExtensions('./model', model);

function loadModelExtensions(folder, model) {
    // Loading entities dynamically
    require('fs').readdirSync(folder)
        .filter(function (file) {
            return file.indexOf("index.js") == -1;
        }).forEach(function (entity) {
            console.log('Loading', entity, 'entity...');
            require('./' + entity)(model);
        });
}