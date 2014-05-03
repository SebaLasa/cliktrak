var mongo = require('mongoose'),
    Schema = mongo.Schema,
    ObjectId = Schema.Types.ObjectId;

var model = module.exports;

model.Company = mongo.model('Company', new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    enabled: { type: Boolean, required: true, default: true },
    deleted: { type: Boolean, required: true, default: false },
    timezone: { type: Number, required: true, default: 0 }
}));

model.User = mongo.model('User', new Schema({
    company: { type: ObjectId, ref: 'Company', required: true },
    email: { type: String, required: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    enabled: { type: Boolean, required: true, default: true }
}));

model.Layout = mongo.model('Layout', new Schema({
    company: { type: ObjectId, ref: 'Company', required: true },
    editor: { type: ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    deleted: { type: Boolean, required: true, default: false }
}));

model.Page = mongo.model('Page', new Schema({
    company: { type: ObjectId, ref: 'Company', required: true },
    layout: { type: ObjectId, ref: 'Layout', required: true },
    internalId: { type: Number, required: true },
    name: { type: String, required: true },
    title: { type: String, required: true },
    html: { type: String, required: true },
    enabled: { type: Boolean, required: true, default: true },
    deleted: { type: Boolean, required: true, default: false }
}));