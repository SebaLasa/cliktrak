var validation = module.exports;
validation.validate = {};

validation.validate.Required = function (obj, fields) {
	var result = new Array();
	fields.forEach(function(fieldName) {

		if (!fieldName.contains('.')) {
			if(!obj[fieldName]) {
				result.push(fieldName);
			}
			return;
		};

		var parent = fieldName.split('.')[0];
		var child = fieldName.split('.')[1];

		if(!obj[parent] || !obj[parent][child]) {
			result.push(fieldName);
		}
	})

	return result;
}

validation.validate.Email = function(email) { 
	var re = new RegExp('^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$');
	return re.test(email);
} 

validation.validate.Password = function(pass) {
	if (pass.length < 6) {
		return 'Password must be 6 characters long.';
	}

	if(!/[A-Z]/.test(pass) && !/[a-z]/.test(pass)) {
		return 'Password must have at least one letter.';
	};

	if(!/\d/.test(pass)) {
		return 'Password must have at least one number.';
	};
}

validation.validate.ObjectId = function (objectId) {
	var re = new RegExp("^[0-9a-fA-F]{24}$");
	return re.test(objectId);
}