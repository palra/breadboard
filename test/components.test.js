var assert = require("assert");

describe('Components', function() {

    var components = {}, bb;

    beforeEach(function() {
        delete bb;
        bb = new Breadboard();
        components = {
            foo: Breadboard.Component.new({
                method: function() {
                    return 'foo';
                },
            }),
            bar: Breadboard.Component.new(['foo'], {
                dependenciesLoaded: function(deps) {
                    this.foo = deps['foo'];
                },
                anotherMethod: function() {
                    return 'bar';
                },
                useMyDependency: function() {
                    return this.foo.method();
                }
            }),
        }
    });

    it('should load components', function() {
        bb.add('foo', components.foo);
        bb.components.should.not.have.property('foo');

        bb.load();
        bb.components.should.have.property('foo');

        bb.components.foo.method().should.be.eql('foo');

        (function() {
            bb.add('name', {
                _meta: {
                    name: 'foo'
                },
                method: function() {
                    return 'foo';
                }
            });
        }).should.
        throw (/Not a valid component$/);

        (function() {
            var fake = Breadboard.Component.new();
            bb.add(fake);
        }).should.
        throw (/Invalid name/);
    });

    it('should lazy load components', function() {
        bb.add('test', function() {
            return Breadboard.Component.new([], {
                aMethod: function() {
                    return 'aMethod';
                }
            });
        });

        bb.components.should.not.have.property('test');
        bb.has('test').should.be.false;

        (bb.get('test') === undefined).should.be.true;

        bb.load();
        bb.get('test').should.have.property('aMethod');

        (function() {
            bb.add('anotherTest', function() {
                return 'Not a component';
            });
            bb.load();
        }).should.
        throw (/does not return a Component/);

    });

    it('should unload components', function() {
        bb.add('foo', components.foo);
        bb.remove('foo').should.be.true;

        bb.add('foo', components.foo);
        bb.load();
        bb.remove('foo').should.be.true;

        bb.remove('bar').should.be.false;

        bb.remove(['nope']).should.be.false;
    });

    it('should list components', function() {
        bb.add('foo', components.foo);
        bb.add('bar', components.bar);

        bb.load();

        bb.components.should.have.properties('foo', 'bar');

        bb.get('foo').should.be.eql(components.foo);
        bb.get('bar').should.be.eql(components.bar);

        bb.has('notAComponent').should.be.false;
        (bb.get('notAComponent') === undefined).should.be.true;

        bb.has(['notAValid', 'Component Name']).should.be.false;
        (bb.get({
            notAValid: 'Component Name'
        }) === undefined).should.be.true;
    });

    it('should load dependencies', function() {
        bb.add('foo', components.foo);
        bb.add('bar', components.bar);

        bb.load();

        bb.components.bar.useMyDependency().should.be.eql('foo');
    });

    it('should not load non existing dependencies', function() {
        (function() {
            bb.add('baz', Breadboard.Component.new(['lololol']));
            bb.load();
        }).should.
        throw (/lololol/);
    });

    it('should not inject yourself to your dependencies', function() {
        (function() {
            var baz = Breadboard.Component.new(['bar', 'baz'], {
                againAnotherMethod: function() {
                    return 'baz';
                }
            });
            bb.add('bar', components.bar);
            bb.add('foo', components.foo);
            bb.add('baz', baz);
            bb.load();
        }).should.
        throw (/Can't add yourself as a dependency/);
    });

});