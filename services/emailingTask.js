var nodemailer = require('nodemailer'),
    async = require('async'),
    model = app.model;

module.exports.run = function (cb) {
    var today = new Date();
    model.emailing.Task.find({dateStart: { $lt: today }, dateEnd: { $gt: today }}).populate('contacts').exec(function (err, tasks) {
        if (err) {
            return cb(err);
        }

        async.each(tasks, function (task, messageCallback) {
            generateMessages(task, messageCallback);
        }, function (err) {
            if (err) {
                return cb(err);
            }
            tasks.filter(function (task) {
                return task.messages.every(function (message) {
                    return !!message.dateSent;
                });
            });
            sendEmails(tasks, cb);
        });
    });
};

function getTemplateMessageFields(message) {
    var seeker = /##([\w\d]+)##/gi;
    var match;
    var matches = [];
    while (match = seeker.exec(message)) {
        matches.push({
            text: match[0],
            property: match[1]
        });
    }
    return matches;
}

function getCompiledMessageTemplate(message, fields, contact) {
    fields.forEach(function (field) {
        // TODO put the real page URL.
        message = message.replace(field.text, field.property == 'url' ? 'http://www.gogle.com' : contact[field.property]);
    });
    return message;
}

function generateMessages(task, callback) {
    if (task.messages && task.messages.length) {
        return callback();
    }
    if (!task.contacts || !task.contacts.length) {
        return callback();
    }

    var fields = getTemplateMessageFields(task.message);
    task.messages = task.contacts.map(function (contact) {
        return {
            contact: contact._id,
            email: contact.email,
            message: getCompiledMessageTemplate(task.message, fields, contact)
        };
    });
    task.save(callback);
}

function sendEmails(tasks, callback) {
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: app.config.email.user,
            pass: app.config.email.password
        }
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
    }, callback);
}

function sendEmail(transporter, task, message, callback) {
    var mailOptions = {
        from: "ClikTrak <" + app.config.email.user + ">", // sender address
        to: message.email,
        subject: task.subject,
        html: message.message
    };
    transporter.sendMail(mailOptions, function (err) {
        callback(err);
    });
}
