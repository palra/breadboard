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

module.exports = Component;