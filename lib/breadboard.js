var EventEmitter = require('events').EventEmitter,
    util = require('util');

function Breadboard() {
    this.components = {};
    this._lazy = {};
    this.setMaxListeners(0);

    Breadboard.Component.prototype._breadboard = this;

    return;
}

util.inherits(Breadboard, EventEmitter);

Breadboard.prototype.add = function(name, component) {
    if (!_.isString(name))
        throw new Error('Invalid name');
    else {
        if (component instanceof Breadboard.Component) {
            component._meta.name = name;
            this.components[name] = component;
            this.emit('component:added', this.components[name]);
        } else if (_.isFunction(component)) {
            this._lazy[name] = component;
        } else {
            throw new Error("Not a valid component");
        }
    }
};

Breadboard.prototype.get = function(component) {
    if (_.isString(component)) {
        if (_.isFunction(this._lazy[component])) {
            this.add(component, this._lazy[component]());
            delete this._lazy[component];
        }
        return this.components[component];
    } else {
        return;
    }
};

Breadboard.prototype.has = function(component) {
    return (this.components[component] !== undefined);
};

Breadboard.prototype.remove = function(toRemove) {
    for (var name in this.components) {
        if (this.components.hasOwnProperty(name) && this.components[name]._meta.name == toRemove) {
            delete this.components[name];
            this.emit('component:removed', toRemove);
            return true;
        }
    }

    return false;
};

Breadboard.prototype.load = function() {
    for (var name in this.components) {
        if (this.components.hasOwnProperty(name)) {
            this.get(name)._loadDependencies();
        }
    }

    this.emit('component:loaded', this.components);
};

Breadboard.Component = require('./component');

module.exports = Breadboard;