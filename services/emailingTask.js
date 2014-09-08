var nodemailer = require('nodemailer'),
    async = require('async'),
    model = app.model;

module.exports.run = function (cb) {
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: app.config.email.user,
            pass: app.config.email.password
        }
    });
    var today = new Date();
    model.emailing.Task.find({dateStart: { $lt: today }, dateEnd: { $gt: today }}, function (err, tasks) {
        if (err) {
            return cb(err);
        }

        // TODO AN generate messages if the collection is null or empty.
        tasks.filter(function (task) {
            return task.messages.every(function (message) {
                return !!message.dateSent;
            });
        });

        async.each(tasks, function (task, taskCallback) {
            async.each(task.messages, function (message, messageCallback) {
                if (message.dateSent) {
                    return messageCallback();
                }
                sendEmail(transporter, task, message, function (err) {
                    message.dateSent = new Date();
                    message.error = err;
                    messageCallback(err);
                });
            }, function (err) {
                task.error = err;
                task.save(function (err) {
                    taskCallback(err);
                });
            });
        }, cb);
    });
};

function sendEmail(transporter, task, message, callback) {
    var mailOptions = {
        from: "ClikTrak <" + app.config.email.user + ">", // sender address
        to: message.email,
        subject: task.subject,
        html: task.message
    };
    transporter.sendMail(mailOptions, function (err) {
        callback(err);
    });
}
