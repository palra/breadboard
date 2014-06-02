describe('Components', function () {

	var components = {}, bb;

	beforeEach(function() {
		bb = new Breadboard();
		components = {
			foo: Breadboard.Component.new({
				_meta: {
					name: 'foo'
				},
				method: function() {
					return 'foo';
				}
			}),
			bar: Breadboard.Component.new({
				_meta: {
					name: 'bar'
				},
				anotherMethod: function() {
					return 'bar';
				}
			})
		}
	});

	it('should load components', function() {
		bb.add(components.foo);
		bb.components.should.have.properties('foo');
		(function(){
			bb.add({
				_meta: {
					name: 'foo'
				},
				method: function() {
					return 'foo';
				}
			});
		}).should.throw(/Invalid argument/);
	});
	
	it('should unload components', function() {
		bb.add(components.foo);
		bb.remove('foo');
		(function(){
			bb.remove('bar');
		}).should.throw(/No component named/);
	});

	it('should list components');
	it('should manage dependencies');
	it('should manage optional dependencies');
});