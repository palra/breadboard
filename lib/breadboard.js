var EventEmitter = require('events').EventEmitter,
	util = require('util');

function Breadboard() {
	this.components = {};
	this.setMaxListeners(0);

	Breadboard.Component.prototype._breadboard = this;

	return;
}

util.inherits(Breadboard, EventEmitter);

Breadboard.prototype.add = function(component) {
	if (component instanceof Breadboard.Component) {
		this.components[component._meta.name] = component;
		this.emit('component:added', this.components[component._meta.name]);
	} else {
		throw new Error("Not a valid component");
	}
	return this;
};

Breadboard.prototype.get = function(component) {
	if (_.isString(component)) {
		return this.components[component];
	} else {
		throw new Error("Not a valid component name");
	}
};

Breadboard.prototype.has = function(component) {
	return (this.get(component) !== undefined);
};


Breadboard.prototype.remove = function(toRemove) {
	for (var name in this.components) {
		if(this.components.hasOwnProperty(name)
		&& this.components[name]._meta.name == toRemove) {
			delete this.components[name];
			this.emit('component:removed', toRemove);
			return this;
		}
	}

	throw new Error("No component named "+toRemove);
};

Breadboard.prototype.load = function() {
	for (var name in this.components) {
		if(this.components.hasOwnProperty(name)) {
			this.get(name)._loadDependencies();			
		}
	}

	this.emit('component:loaded', this.components);
}

Breadboard.Component = require('./component');

module.exports = Breadboard;
