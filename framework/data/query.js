var query = module.exports;

query.caseInsensitive = function(pattern) {
	return new RegExp(pattern, 'i');
}

query.like = function(pattern) {
	return new RegExp('.*' + pattern + '.*', 'i');
}

query.notEquals = function(value) {
	return { $ne : value };
}

query.in = function(value) {
	return { $in : value };
}