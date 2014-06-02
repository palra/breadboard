var EventEmitter = require('events').EventEmitter,
	util = require('util');

function Breadboard() {
	this.components = {};
	this.setMaxListeners(0);
	return;
}

util.inherits(Breadboard, EventEmitter);

Breadboard.prototype.add = function(component) {
	if (component instanceof Breadboard.Component) {
		this.components[component._meta.name] = component;
	} else {
		throw new Error("Invalid argument provided to Breadboard#add method");
	}
	return this;
};

Breadboard.prototype.remove = function(toRemove) {
	for (var name in this.components) {
		if(this.components.hasOwnProperty(name)) {
			if(this.components[name]._meta.name == toRemove) {
				delete this.components[name];
				return this;
			}
		}
	}

	throw new Error("No component named "+toRemove);
};

Breadboard.Component = require('./component');

module.exports = Breadboard;
