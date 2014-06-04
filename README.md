Breadboard
==========

A lightweight IoC Container for [node](http://nodejs.org/).

[![breadboard](http://palra.github.io/breadboard/breadboard.png)](http://palra.github.io/breadboard/docs)

[![Build Status](https://travis-ci.org/palra/breadboard.svg?branch=master)](https://travis-ci.org/palra/breadboard) [![Code Climate](https://codeclimate.com/github/palra/breadboard.png)](https://codeclimate.com/github/palra/breadboard) [![Coverage Status](https://coveralls.io/repos/palra/breadboard/badge.png?branch=master)](https://coveralls.io/r/palra/breadboard?branch=master)

## Why Breadboard ?

In electronics, a breadboard is a construction base for fast prototyping. 

## Quick start

First, install the module :
    
    npm install breadboard

Then, you can start using it : 

```javascript
var Breadboard = require("./lib"),
    Component = Breadboard.Component,
    bb = new Breadboard();

bb.add('foo', Component.new({
    method: function() {
        return 'Hello world !'
    }
}));

bb.add('bar', Component.new(['foo'], {
    useFoo: function() {
        return this.foo.method();
    }
}).on('dependencies:loaded', function(dependencies) {
    this.foo = dependencies['foo'];
}));

bb.load();

bb.has('bar'); // => true

var bar = bb.get('bar');
bar.useFoo(); // => 'Hello world !'
```