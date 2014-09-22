var nodemailer = require('nodemailer'),
    async = require('async'),
    _ = require('lodash'),
    model = app.model,
    domain = require('domain');

module.exports.run = function (cb) {

    var today = new Date();
    model.emailing.Task.find({dateStart: { $lt: today }, dateEnd: { $gt: today }}).populate(['contacts']).exec(function (err, tasks) {
        if (err) {
            return cb(err);
        }

        async.each(tasks, function (task, messageCallback) {
            console.log("------------------------TASK--------------------------------");
            console.log(task);
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

function getCompiledMessageTemplate(task, fields, contact, customValue) {
    var message = task.message;
    fields.forEach(function (field) {
        var value;
        if (field.property == 'url') {
            if (customValue) {
                value = customValue.urlGenerated;
            } else {
                value = domain() + '/p/' + task.company + '.' + task.page;
            }
        } else if (field.property.indexOf('parameter') > -1) {
            value = customValue ? customValue[field.property] : field.property;
        } else {
            value = contact[field.property];
        }
        message = message.replace(field.text, value);
    });
    return message;
}

function generateMessages(task, callback) {
    if (!task.messages || !task.messages.length) {
        return callback();
    }
    if (!task.contacts || !task.contacts.length) {

        if (!task.contactFieldMatch || !task.paramToMatchWithContacts) {
            return callback();
        }

        model.Contact.find({company: task.company, deleted: false}, function (err, contacts) {

                if (err) {
                    return callback(err);
                }

                model.CustomPageValue.find({customPage: task.customPage}, function (err, customPageValues) {

                    if (err) {
                        return callback(err);
                    }
                    var matches = _.compact(customPageValues.map(function (customValue) {
                        var contact = contacts.find(function (contact) {
                            return contact[task.contactFieldMatch] == customValue[task.paramToMatchWithContacts]
                        });
                        return contact ? { contact: contact, customValue: customValue } : null;
                    }));

                    var fields = getTemplateMessageFields(task.message);
                    task.messages = matches.map(function (match) {

                        return {
                            contact: match.contact._id,
                            email: match.contact.email,
                            message: getCompiledMessageTemplate(task, fields, match.contact, match.customValue)
                        };
                    });

                    task.save(callback);
                });
            }
        );
        return;
    }

    var fields = getTemplateMessageFields(task.message);

    task.messages = task.contacts.map(function (contact) {
        return {
            contact: contact._id,
            email: contact.email,
            message: getCompiledMessageTemplate(task, fields, contact)
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
