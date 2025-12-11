// NOTE: This test uses the `node:test` module to avoid the Jest issue
// that has not supported `require(ESM)` yet.
// Ref https://github.com/jestjs/jest/issues/15275

const test = require('node:test');
const assert = require('node:assert/strict');

const stylelint = require('../index.cjs');

test('require(ESM) in CommonJS plugin', async () => {
	const result = await stylelint.lint({
		code: '.foo {}',
		config: {
			plugins: [require('./fixtures/plugin-warn-about-foo.cjs')],
			rules: {
				'plugin/warn-about-foo': 'always',
				'block-no-empty': true,
			},
		},
	});
	const warnings = result.results[0].warnings;

	assert.equal(warnings.length, 2);
	assert.equal(warnings[0].text, 'found .foo (plugin/warn-about-foo)');
	assert.equal(warnings[1].text, 'Unexpected empty block (block-no-empty)');
});
