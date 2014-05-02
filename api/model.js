var mongo = require('mongoose'),
    Schema = mongo.Schema,
    ObjectId = Schema.Types.ObjectId;

var model = module.exports;

model.User = mongo.model('User', new Schema({
    company: { type: ObjectId, ref: 'Company', required: true },
    email: { type: String, required: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    enabled: { type: Boolean, required: true, default: true }
}));

model.Company = mongo.model('Company', new Schema({
    name: { type: String, required: true }
}));