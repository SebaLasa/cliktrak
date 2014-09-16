var mongoose = require('mongoose'),
    timestamps = require('mongoose-timestamps'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

var model = module.exports;
model.enums = require('./enums.js');

model.Company = mongoose.model('companies', new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    internalId: { type: Number, required: true },
    enabled: { type: Boolean, required: true, default: true },
    deleted: { type: Boolean, required: true, default: false },
    timezone: { type: Number, required: true, default: 0 }
}));

model.User = mongoose.model('users', new Schema({
    company: { type: ObjectId, ref: 'companies', required: true },
    email: { type: String, required: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    enabled: { type: Boolean, required: true, default: true },
    deleted: { type: Boolean, required: true, default: false },
    admin: { type: Boolean, default: false }
}));

model.Menu = mongoose.model('menus', new Schema({
    company: { type: ObjectId, ref: 'companies', required: true },
    name: { type: String, required: true },
    enabled: { type: Boolean, required: true, default: true },
    deleted: { type: Boolean, required: true, default: false },
    items: [
        {
            name: { type: String, required: true },
            tooltip: { type: String },
            page: { type: ObjectId, ref: 'pages' },
            customPage: { type: ObjectId, ref: 'customPages' },
            url: { type: String },
            ordinal: { type: Number },
            deleted: { type: Boolean, required: true, default: false }
        }
    ]
}).plugin(timestamps));

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
    editor: { type: ObjectId, ref: 'users', required: true },
    internalId: { type: Number, required: true },
    name: { type: String, required: true },
    title: { type: String, required: true },
    html: { type: String, required: true },
    forCustomPages: { type: Boolean, required: true },
    enabled: { type: Boolean, required: true, default: true },
    deleted: { type: Boolean, required: true, default: false }
}).plugin(timestamps));

model.CustomPage = mongoose.model('customPages', new Schema({
    company: { type: ObjectId, ref: 'companies', required: true },
    page: { type: ObjectId, ref: 'pages', required: true },
    editor: { type: ObjectId, ref: 'users', required: true },
    urlConfiguration: { type: ObjectId, ref: 'urlConfigurations'},
    type: { type: String, enum: model.enums.customPageTypes },
    status: { type: String, enum: model.enums.customPageStatus },
    name: { type: String, required: true },
    internalId: { type: Number, required: true },
    dateStart: { type: Date, required: true },
    dateEnd: { type: Date, required: true },
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
    device: { type: String, enum: model.enums.devices },
    menu: { type: ObjectId, ref: 'menus' },
    page: { type: ObjectId, ref: 'pages' },
    customPage: { type: ObjectId, ref: 'customPages' },
    valueReference: { type: String },
    agent: { type: String }
}));

model.CustomPageValue = mongoose.model('customPageValues', new Schema({
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
    barcodeData: { type: String },
    barcodeSize: { type: Number },
    subdomain: { type: String, required: true },
    isTracked: { type: Boolean, required: true, default: false},
    canAccessWithoutData: { type: Boolean, required: true, default: false }
}));

model.Contact = mongoose.model('contacts', new Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    birthDate: { type: Date },
    gender: { type: String, enum: model.enums.gender },
    telephone: { type: String },
    mobilePhone: { type: String },
    email: { type: String },
    address: { type: String },
    state: { type: String },
    city: { type: String },
    country: { type: String },
    editor: { type: ObjectId, ref: 'users', required: true },
    company: { type: ObjectId, ref: 'companies', require: true },
    deleted: { type: Boolean, required: true, default: false }
}).plugin(timestamps));

model.Campaign = mongoose.model('campaigns', new Schema({
    company: { type: ObjectId, ref: 'companies', required: true },
    page: { type: ObjectId, ref: 'pages' },
    customPage: { type: ObjectId, ref: 'customPages' },
    editor: { type: ObjectId, ref: 'users', required: true },
    name: { type: String, required: true },
    internalId: { type: Number, required: true },
    deleted: { type: Boolean, required: true, default: false },
    status: { type: String, enum: model.enums.campaignStatus }
}).plugin(timestamps));

var emailing = model.emailing = {};
emailing.Task = mongoose.model('emailing.tasks', new Schema({
    subject: {type: String, required: true},
    message: { type: String, required: true },
    company: { type: ObjectId, ref: 'companies', required: true },
    campaign: { type: ObjectId, ref: 'campaigns', required: true },
    page: { type: ObjectId, ref: 'pages' },
    customPages: { type: ObjectId, ref: 'customPages' },
    editor: { type: ObjectId, ref: 'users', required: true },
    dateStart: { type: Date, required: true },
    dateEnd: { type: Date, required: true },
    contactFieldMath: { type: String },
    paramToMatchWithContacts: { type: String },
    contacts: [
        { type: ObjectId, ref: 'contacts' }
    ],
    triggers: [
        {
            days: { type: Number },
            start: { type: Date },
            end: { type: Date }
        }
    ],
    messages: [
        {
            contact: { type: ObjectId, ref: 'contacts' },
            dateSent: { type: Date },
            message: { type: String, required: true },
            email: { type: String, required: true },
            error: { type: Schema.Types.Mixed }
        }
    ],
    error: { type: Schema.Types.Mixed }
}).plugin(timestamps));

loadModelExtensions('./model', model);

function loadModelExtensions(folder, model) {
    // Loading entities dynamically
    require('fs').readdirSync(folder)
        .filter(function (file) {
            return file.indexOf('index.js') == -1 && file.indexOf('enums.js') == -1;
        }).forEach(function (entity) {
            console.log('Loading', entity, 'entity...');
            require('./' + entity)(model);
        });
}