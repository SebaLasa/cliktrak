var mongo = require('mongoose');

module.exports.connect = function (cs, cb) {
    mongo.connection.on('error', function () {
        cb('Error connecting DB!');
    });

    mongo.connection.once('open', function () {
        cb(null, mongo.connection);
    });

    mongo.connect(cs);
};