var assert = require("assert");

describe('Components', function () {

	var components = {}, bb;

	beforeEach(function() {
		bb = new Breadboard();
		components = {
			foo: Breadboard.Component.new('foo', {
				method: function() {
					return 'foo';
				},
			}),
			bar: Breadboard.Component.new('bar', ['foo'], {
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
		bb.add(components.foo);
		bb.components.should.have.property('foo');

		bb.components.foo.method().should.be.eql('foo');

		(function(){
			bb.add({
				_meta: {
					name: 'foo'
				},
				method: function() {
					return 'foo';
				}
			});
		}).should.throw(/valid component$/);

		(function(){
			var fake = Breadboard.Component.new();
		}).should.throw(/No name/);
	});
	
	it('should unload components', function() {
		bb.add(components.foo);
		bb.remove('foo');

		(function(){
			bb.remove('bar');
		}).should.throw(/No component named/);
	});

	it('should list components', function() {
		bb.add(components.foo);
		bb.add(components.bar);

		bb.components.should.have.properties('foo', 'bar');

		bb.get('foo').should.be.eql(components.foo);
		bb.get('bar').should.be.eql(components.bar);

		bb.has('notAComponent').should.be.false;
		(bb.get('notAComponent') === undefined).should.be.true;

		(function(){
			bb.has(['notAValid', 'Component Name']);
		}).should.throw(/valid component name/);
	});

	it('should load dependencies', function() {
		bb.add(components.foo);
		bb.add(components.bar);

		bb.load();

		bb.components.bar.useMyDependency().should.be.eql('foo');
	});

	it('should not load non existing dependencies', function() {
		(function(){
			bb.add(Breadboard.Component.new('baz', ['lololol']));
			bb.load();
		}).should.throw(/lololol/);
	});

	it('should not inject yourself to your dependencies', function(){
		(function(){
			var baz = Breadboard.Component.new('baz', ['bar', 'baz'], {
				againAnotherMethod: function() {
					return 'baz';
				}
			});
		}).should.throw(/can't add yourself as a dependency/);
	});
		
});