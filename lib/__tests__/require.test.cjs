const test = require('node:test');
const assert = require('node:assert/strict');

const stylelint = require('../index.mjs');

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
	assert.equal(warnings[1].text, 'Empty block (block-no-empty)');
});
