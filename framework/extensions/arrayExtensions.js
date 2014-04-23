// Array query extensions
Array.prototype.contains = function (element) {
	return this.indexOf(element) != -1;
}

Array.prototype.select = function () {
	var filter = arguments;
	return this.map(function (e) {
		var result = {};


		if (filter.length == 1) {
			return e[filter[0]];
		};

		for (var key in filter) {
			var arg = filter[key];
			if (!arg) { continue; };

			result[arg] = e[arg];
		}

		return result;
	});
}

Array.prototype.where = function (query) {
	if (!query) {
		return this;
	}

	if (typeof(query) == 'function') {
		return this.filter(query);
	};

	return this.filter(function (e) {
		var result = true;

		for (var key in query) {
			var value = query[key];
			var elementValue = e[key];

			result = result && elementValue == value;
		}

		return result;
	});
}

Array.prototype.any = function (query) {
	var result = this.where(query);

	return result && result.length > 0;
}

Array.prototype.first = function (query) {
	var result = this.where(query);

	if (result && result.length > 0) {
		return result[0];
	}
}

Array.prototype.last = function (query) {
	var result = this.where(query);

	if (result && result.length > 0) {
		return result[result.length-1];
	}
}

Array.prototype.set = function (values) {
	this.forEach(function (e) {
		for (var key in values) {
			e[key] = values[key];
		}
	});
}

Array.prototype.remove = function (item) {
	var index = this.indexOf(item);
	if (index != -1) {
		this.splice(index, 1);
	};
}

Array.prototype.sum = function (field) {
	var arr = this;

	if (field) {
		arr = this.select(field);
	};

	var total = 0;
	arr.forEach(function(e) {
		total = total + Number(e);
	});

	return total || 0;
}

Array.prototype.flatten = function() {
    var r = [];
    for (var i = 0; i < this.length; ++i) {
        var v = this[i];
        if (v instanceof Array) {
            Array.prototype.push.apply(this, v.flatten());
        } else {
            r.push(v);
        }
    }
    return r;
};

Array.prototype.distinct = function (field) {
	var arr = this;
	var selector;
	var result = [];

	if (field) {
		selector = function(item) { return item[field]; };
	}
	else {
		selector = function(item) { return item; };
	}

	arr.forEach(function(e) {
		if (e) {
			var value = selector(e);

			if (value && !arr.contains(value)) {
				result.push(value);
			}
		}
	});

	return result || [];
};