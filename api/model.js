var mongo = require('mongoose'),
    Schema = mongo.Schema;
ObjectId = Schema.Types.ObjectId;

var model = module.exports;

model.Company = mongo.model('company', new Schema({
    name: {type: String, required: true }
}));