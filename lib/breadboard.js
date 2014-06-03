var EventEmitter = require('events').EventEmitter,
    util = require('util');

/**
 * Creates a new IoC Container
 * @constructor
 */
function Breadboard() {
    this.components = {};
    this._toLoad = {};
    this.setMaxListeners(0);

    Breadboard.Component.prototype._breadboard = this;

    return;
}

util.inherits(Breadboard, EventEmitter);

/**
 * Registers a new component to the container. It doesn't load it, ie it doesn't
 * loads its dependencies, only add it to the array of objects waiting to be loaded.
 * @param {string}             name      The name of the component
 * @param {Component|Function} component The component, or a function returning the component
 *
 * @throws {Error} Argument `name` must be a string
 * @throws {Error} Argument `component` must be a Component or a function
 */
Breadboard.prototype.add = function(name, component) {
    if (!_.isString(name))
        throw new Error('Invalid name');
    else {
        if (component instanceof Breadboard.Component) {
            component._meta.name = name;
            this._toLoad[name] = component;
        } else if (_.isFunction(component)) {
            this._toLoad[name] = component;
        } else {
            throw new Error("Not a valid component");
        }
    }
};

/**
 * Removes a loaded component or a registered component
 * @param  {string} name The name of the component you want to remove
 * @return {Boolean}     Is the component successfully removed ?
 */
Breadboard.prototype.remove = function(name) {
    if (!_.isString(name))
        return false
    else {
        var ret = false;
        if (this._toLoad.hasOwnProperty(name)) {
            delete this._toLoad[name];
            ret = true;
        }
        if (this.components.hasOwnProperty(name)) {
            delete this.components[name];
            ret = true;
        }

        return ret;
    }
};

/**
 * Returns a component identified by his name. Lazy loads it if the component
 * was added with a function in Breadboard#add
 * @param  {string}         component The component name
 * @return {Component|void}           The component or nothing, if it was not found
 */
Breadboard.prototype.get = function(component) {
    if (_.isString(component)) {
        return this.components[component];
    } else {
        return;
    }
};

/**
 * Does the container has this component ?
 * @param  {string}  component The name of the component you are looking for
 * @return {Boolean}           Is the component addded ?
 */
Breadboard.prototype.has = function(component) {
    if (_.isString(component))
        return (this.components[component] !== undefined);
    else
        return false;
};


/**
 * Load dependencies of each components
 *
 * @throws {Error} if a component is not a valid component
 * @fires Breadboard#components:loaded
 */
Breadboard.prototype.load = function() {
    for (var name in this._toLoad) {
        var comp = this._toLoad[name];
        if (this._toLoad.hasOwnProperty(name)) {
            if (_.isFunction(comp)) {
                var component = comp();
                if (component instanceof Breadboard.Component) {
                    this.components[name] = component;
                    delete this._toLoad[name];
                } else {
                    throw new Error(name + "'s lazy load function does not return a Component");
                }
            } else {
                this.components[name] = comp;
                delete this._toLoad[name];
            }
        }
    }

    for (var name in this.components) {
        var comp = this.components[name];
        if (this.components.hasOwnProperty(name)) {
            comp._loadDependencies();
        }
    }

    /**
     * Event fired when components are all loaded
     *
     * @event Breadboard#components:loaded
     * @type {Components[]}
     */
    this.emit('components:loaded', this.components);
};

Breadboard.Component = require('./component');

module.exports = Breadboard;