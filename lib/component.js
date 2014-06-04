var EventEmitter = require('events').EventEmitter,
    util = require('util');

/**
 * Component of the Breadboard IoC
 *
 * @constructor
 * @param  {Array} dependencies The name of the dependencies of the new component
 */
function Component(dependencies) {
    this._meta = {
        name: '',
        dependencies: {},
    };

    var that = this;

    if (util.isArray(dependencies))
        if (dependencies.length > 0)
            dependencies.forEach(function(item) {
                that._meta.dependencies[item] = undefined;
            });
}

util.inherits(Component, EventEmitter);

/**
 * Creates a new Component
 *
 * @param  {Array} dependencies The name of the dependencies of the new component
 * @param  {object}        content      Object that will extend the base Component
 * @return {Component}                 The new component
 */
Component.new = function(dependencies, content) {
    var ret;

    if (!util.isArray(dependencies)) {
        content = dependencies;
        dependencies = [];
    }

    ret = new Component(dependencies);
    _.assign(ret, content);
    if (_.isFunction(ret.init))
        ret.init();
    return ret;
};

/**
 * Load dependencies of the component
 *
 * @name Component#_loadDependencies
 * @private
 * @return {Component} This component
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

        /**
         * Event fired when dependencies are loaded
         *
         * @event Component#dependencies:loaded
         * @type {Object.<string, Component>}
         */
        this.emit('dependencies:loaded', this._meta.dependencies);

        return this;
    }
});

module.exports = Component;