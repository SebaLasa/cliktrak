var validation = module.exports;
validation.validate = {};

validation.validate.required = function (obj, fields) {
    var result = [];
    fields.forEach(function (fieldName) {

        if (!fieldName.contains('.')) {
            if (!obj[fieldName]) {
                result.push(fieldName);
            }
            return;
        }

        var parent = fieldName.split('.')[0];
        var child = fieldName.split('.')[1];

        if (!obj[parent] || !obj[parent][child]) {
            result.push(fieldName);
        }
    });

    return result;
};

validation.validate.email = function (email) {
    return new RegExp('^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$').test(email);
};

validation.validate.password = function (pass) {
    if (pass.length < 6) {
        return 'Password must be 6 characters long.';
    }

    if (!/[A-Z]/.test(pass) && !/[a-z]/.test(pass)) {
        return 'Password must have at least one letter.';
    }

    if (!/\d/.test(pass)) {
        return 'Password must have at least one number.';
    }
};

validation.validate.objectId = function (objectId) {
    var re = new RegExp("^[0-9a-fA-F]{24}$");
    return re.test(objectId);
};