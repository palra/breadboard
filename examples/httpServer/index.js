var Breadboard = require('../../lib'),
    Component = Breadboard.Component,
    bb = new Breadboard();

var expressServer = Component.new({
    init: function() {
        this.app = require('express')();
    },
    addRoute: function(verb, path, fn) {
        arguments = Array.prototype.slice.call(arguments, 1);
        this.app[verb.toLowerCase()](path, fn);
    },
    listen: function(port) {
        this.app.listen(port);
    }
});

var httpServer = Component.new({
    init: function() {
        this.app = require('express')();
        this.routes = {};
    },
    addRoute: function(verb, path, fn) {
        this.routes[path] = {
            verb: verb,
            fn: fn
        };
    },
    listen: function(port) {
        this.app.listen(port);
    }
});

// ====================================

bb.add('server', expressServer);
//bb.add('server', httpServer);
// (Un)comment the line you want

bb.load();

var server = bb.get('server');
server.addRoute('GET', '/', function(req, res) {
    res.send('Hello world !');
});

server.listen(3000);