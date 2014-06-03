var EventEmitter = require('events').EventEmitter,
    util = require('util');

function Component(dependencies) {
    this.setMaxListeners(0);

    this._meta = {
        name: '',
        dependencies: {},
    };

    var that = this;

    if (_.isArray(dependencies))
        if (dependencies.length > 0)
            dependencies.forEach(function(item) {
                that._meta.dependencies[item] = undefined;
            });

    this.dependenciesLoaded = function() {
        return this;
    };
}

util.inherits(Component, EventEmitter);

Component.new = function(dependencies, content) {
    var ret;

    if (!(dependencies instanceof Array)) {
        content = dependencies;
        dependencies = [];
    }

    ret = new Component(dependencies);
    _.assign(ret, content);
    return ret;
};

Object.defineProperty(Component.prototype, '_loadDependencies', {
    enumerable: false,
    writable: false,
    value: function() {
        for (var name in this._meta.dependencies) {
            if (this._meta.dependencies.hasOwnProperty(name)) {
                if (name != this._meta.name) {
                    if (this._breadboard.has(name)) {
                        this._meta.dependencies[name] =
                            this._breadboard.get(name);
                    } else {
                        throw new Error("No component named " + name);
                    }
                } else {
                    throw new Error("Can't add yourself as a dependency");
                }
            }
        }

        this.dependenciesLoaded(this._meta.dependencies);
        return this;
    }
});

module.exports = Component;