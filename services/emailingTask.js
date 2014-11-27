var nodemailer = require('nodemailer'),
    async = require('async'),
    _ = require('lodash'),
    model = app.model,
    domain = require('./clicksDomain');

module.exports.run = function (cb) {
    var today = new Date();
    model.emailing.Task.find({
        dateStart: {$lt: today},
        dateEnd: {$gt: today}
    }).populate(['contacts', 'page', 'customPage']).exec(function (err, tasks) {
        if (err) {
            return cb(err);
        }
        async.each(tasks, function (task, messageCallback) {
            if (task.page) {
                model.Page.populate(task.page, 'urlConfiguration').then(function () {
                    generateMessages(task, messageCallback);
                }).end();
            } else {
                model.CustomPage.populate(task.customPage, 'urlConfiguration').then(function () {
                    generateMessages(task, messageCallback);
                }).end();
            }
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
                value = domain(task.customPage.urlConfiguration.subdomain) + customValue.urlGenerated;
            } else {
                value = domain(task.page.urlConfiguration.subdomain) + '/p/' + task.company + '.' + task.page._id;
            }
        } else if (field.property.indexOf('param') > -1) {
            // TODO AN adjust array index.
            value = customValue ? customValue[field.property.replace('param', 'parameter')] : field.property;
        } else {
            value = contact[field.property];
        }
        message = message.replace(field.text, value);
    });
    return message;
}

function generateMessages(task, callback) {
    if (task.state != model.enums.taskStates[0]) {
        return callback();
    }
    task.state = model.enums.taskStates[1];
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
                    var paramToMatchWithContacts = task.paramToMatchWithContacts.replace('param', 'parameter');
                    console.log('paramToMatchWithContacts',paramToMatchWithContacts);
                    var matches = _.compact(customPageValues.map(function (customValue) {
                        var contact = _.find(contacts, function (contact) {
                            return contact[task.contactFieldMatch] == customValue[paramToMatchWithContacts]
                        });
                        return contact ? {contact: contact, customValue: customValue} : null;
                    }));
                    var fields = getTemplateMessageFields(task.message);
                    _.forEach(matches, function (match) {
                        task.messages.push({
                            contact: match.contact._id,
                            email: match.contact.email,
                            message: getCompiledMessageTemplate(task, fields, match.contact, match.customValue)
                        });
                    });
                    task.save(callback);
                });
            }
        );
        return;
    }

    var fields = getTemplateMessageFields(task.message);
    task.contacts.map(function (contact) {
        task.messages.push({
            contact: contact._id,
            email: contact.email,
            message: getCompiledMessageTemplate(task, fields, contact)
        });
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
            task.state = model.enums.taskStates[err ? 3 : 2];
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
