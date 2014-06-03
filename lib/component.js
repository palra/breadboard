var EventEmitter = require('events').EventEmitter,
    util = require('util');

/**
 * Component of the Breadboard IoC
 *
 * @param  {Array[string]} dependencies The name of the dependencies of the new component
 */
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

/**
 * Creates a new Component
 *
 * @param  {Array[string]} dependencies The name of the dependencies of the new component
 * @param  {object}        content      Object that will extend the base Component
 * @return {Component]}                 The new component
 */
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

/**
 * Load dependencies of the component
 *
 * @return {Component}   This component
 */
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