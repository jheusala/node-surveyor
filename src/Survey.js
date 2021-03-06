/* Survey implementation
 * Copyright Jaakko-Heikki Heusala <jheusala@iki.fi>
 */

/** Survey object constructor */
function Survey() {
	var self = this;
	var args = Array.prototype.slice.call(arguments);
	self._keys = {};
	self._data = [];
}

var special_keys = {
	"version": { "hidden": true},
	"header": { "hidden": true},
	"footer": { "hidden": true},
	"end": { "hidden": false}
};

/** Simple get/set helper */
function _getset_helper(self, args, key) {
	args = Array.prototype.slice.call(args);
	if(args.length === 0) {
		return self._keys[key];
	}
	var obj = {
		'description': []
	};
	if( special_keys[key] ) {
		Object.keys(special_keys[key]).forEach(function(k) {
			obj[k] = special_keys[key][k];
		});
	}
	args.forEach(function(arg) {
		
		if(typeof arg === 'string') {

			// The ID of the widget as a string, like "#tag"
			if(arg[0] === '#') {
				obj.id = arg.substr(1).trim();
				return;
			}

			// Text description, like: "Sample Dialog"
			obj.description.push( arg.trim() );
			return;
		}
		
		if(typeof arg === 'object') {

			// Values as an array, like: ['Yes', 'No']
			if(arg instanceof Array) {
				if(obj.values === undefined) {
					obj.values = [];
				}
				obj.values.push.apply(obj.values, arg);
				return;
			}

			// Custom settings from an object
			Object.keys(arg).forEach(function(key) {
				obj[key] = arg[key];
			});
			return;
		}

		throw new Error('Unsupported type for argument: ' + arg + ' (' + (typeof arg) + ')');
		
	});

	// Setup keyword
	if(obj.id !== undefined) {
		key = obj.id;
	}
	
	if(key === undefined) {
		throw new Error("No id for object!");
	}

	if(self._keys[key] !== undefined) {
		throw new Error("ID exists already!");
	}

	obj._key = key;
	self._keys[key] = obj;
	
	if(!obj.hidden) {
		self._data.push(obj);
	}
}

/** Get/set current survey version */
Survey.prototype.version = function() {
	return _getset_helper(this, arguments, 'version');
};

/** Get/set header */
Survey.prototype.header = function(value) {
	return _getset_helper(this, arguments, 'header');
};

/** Get/set footer */
Survey.prototype.footer = function(value) {
	return _getset_helper(this, arguments, 'footer');
};

/** Get/set footer */
Survey.prototype.end = function(value) {
	return _getset_helper(this, arguments, 'end');
};

/** Get/set other */
Survey.prototype.add = function() {
	return _getset_helper(this, arguments);
};

/** Get one or more item by key(s). You can submit any number of keys or arrays of keys. */
Survey.prototype.get = function() {
	var self = this;
	var result = {};
	var args = Array.prototype.slice.call(arguments);
	function do_array(a) {
		a.forEach(function(key) {
			if(key && (typeof key === 'object') && (key instanceof Array) ) {
				do_array(key);
			} else {
				result[key] = self._keys[key];
			}
		});
	}
	do_array(args);
	return result;
};

/** Get available keywords */
Survey.prototype.keys = function() {
	var self = this;
	var result = [];
	self._data.forEach(function(obj) {
		result.push( obj._key );
	});
	return result;
};

// Export module
module.exports = Survey;

/* EOF */
