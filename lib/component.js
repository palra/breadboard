var EventEmitter = require('events').EventEmitter,
	util = require('util');

function Component(name, dependencies) {
	this.setMaxListeners(0);

	if(_.isEmpty(name))
		throw new Error("No name provided to the component");

	this._meta = {
		name: name,
		dependencies: {},
	};

	if(_.isArray(dependencies))
		if(dependencies.length > 0)
			this._addDependencies.apply(this, dependencies);
		
	this.dependenciesLoaded = function() {
		return this;
	};
}

util.inherits(Component, EventEmitter);

Component.new = function(name, dependencies, content) {
	var ret;

	if(!(dependencies instanceof Array)) {
		content = dependencies;
		dependencies = [];
	}

	ret = new Component(name, dependencies);
	_.assign(ret, content);
	return ret;
};

Object.defineProperty(Component.prototype, '_addDependencies', {
	enumerable: false,
	writable: false,
	value: function() {
		for(var i = 0; i < arguments.length; i++) {
			if(arguments[i] == this._meta.name) {
				throw new Error("You can't add yourself as a dependency");
			} else {
				this._meta.dependencies[arguments[i]] = undefined;
			}
		}

		return this;
	}
});

Object.defineProperty(Component.prototype, '_loadDependencies', {
	enumerable: false,
	writable: false,
	value : function() {
		for(var name in this._meta.dependencies) {
			if(this._meta.dependencies.hasOwnProperty(name)) {
				if(this._breadboard.has(name)) {
					this._meta.dependencies[name] = 
						this._breadboard.get(name);
				} else {
					throw new Error("No component named "+name);
				}
			}
		}

		this.dependenciesLoaded(this._meta.dependencies);
		return this;
	}
});

module.exports = Component;
