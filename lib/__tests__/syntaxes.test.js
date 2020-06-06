'use strict';

const syntaxes = require('../syntaxes/index');

const inputs = Object.keys(syntaxes).map((name) => [
	name,
	require(`../syntaxes/syntax-${name}.js`), // directly require modules to bypass importLazy() in syntaxes/index.js
]);

describe('syntaxes', () => {
	it.each(inputs)('syntax is an object with parse and stringify keys: %s', (name, module) => {
		expect(module).toMatchObject({
			parse: expect.any(Function),
			stringify: expect.any(Function),
		});
	});
});
