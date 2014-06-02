var EventEmitter = require('events').EventEmitter,
	util = require('util');

function Component(name) {
	this.setMaxListeners(0);
	this._meta = {
		name: (name || '')
	};
}

util.inherits(Component, EventEmitter);

Component.new = function(content) {
	var ret;
	ret = new Component();
	_.assign(ret, content);
	return ret;
};


module.exports = Component;
