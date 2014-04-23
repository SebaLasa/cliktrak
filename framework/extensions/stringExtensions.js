String.prototype.contains = function(pattern) {
	return this.indexOf(pattern) != -1;
}

String.prototype.endsWith = function (suffix) {
	return (this.substr(this.length - suffix.length) === suffix);
}

String.prototype.startsWith = function(prefix) {
	return (this.substr(0, prefix.length) === prefix);
}

String.prototype.left = function(length) {
	return this.substr(0, length);
}

String.prototype.right = function(length) {
	return this.substr(this.length-length, length);
}