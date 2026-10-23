const test = require('node:test');

const stylelint = require('../index.mjs');

test('require(ESM) in CommonJS plugin', async (t) => {
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

	t.assert.strictEqual(warnings.length, 2);
	t.assert.strictEqual(warnings[0].text, 'found .foo (plugin/warn-about-foo)');
	t.assert.strictEqual(warnings[1].text, 'Empty block (block-no-empty)');
});
