import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import standalone from '../standalone.mjs';
import stripIndent from '../testUtils/stripIndent.mjs';

describe('standalone with computeEditInfo', () => {
	it('should not record EditInfo when fix is enabled', async () => {
		const { results } = await standalone({
			code: 'a { color: #FFF; }',
			config: {
				rules: {
					'color-hex-length': 'long',
				},
			},
			fix: true,
			computeEditInfo: true,
		});

		assert.equal(results[0].warnings.length, 0);
		assert.equal(results[0].fix, undefined);
	});

	it('should record EditInfo when only computeEditInfo is enabled', async () => {
		const { results } = await standalone({
			code: 'a { color: #FFF; }',
			config: {
				rules: {
					'color-hex-length': 'long',
				},
			},
			computeEditInfo: true,
		});

		assert.equal(results[0].warnings.length, 1);
		assert.ok(results[0].warnings[0].fix);
		assert.equal(results[0].warnings[0].fix.text, 'FFFF');
		assert.deepEqual(results[0].warnings[0].fix.range, [14, 15]);
	});

	it('should not record EditInfo when rule has disableFix', async () => {
		const { results } = await standalone({
			code: 'a { color: #FFF; }',
			config: {
				rules: {
					'color-hex-length': ['long', { disableFix: true }],
				},
			},
			computeEditInfo: true,
		});

		assert.equal(results[0].warnings.length, 1);
		assert.equal(results[0].warnings[0].fix, undefined);
	});

	it('should not record EditInfo for disabled rules', async () => {
		const { results } = await standalone({
			code: stripIndent`
				/* stylelint-disable color-hex-length */
				a { color: #FFF; }
			`,
			config: {
				rules: {
					'color-hex-length': 'long',
				},
			},
			computeEditInfo: true,
		});

		assert.equal(results[0].warnings.length, 0);
		assert.equal(results[0].fix, undefined);
	});

	it('should record EditInfo for multiple warnings', async () => {
		const { results } = await standalone({
			code: 'a { color: #FFF; background: #000; }',
			config: {
				rules: {
					'color-hex-length': 'long',
				},
			},
			computeEditInfo: true,
		});

		assert.equal(results[0].warnings.length, 2);
		assert.ok(results[0].warnings[0].fix);
		assert.equal(results[0].warnings[0].fix.text, 'FFFF');
		assert.deepEqual(results[0].warnings[0].fix.range, [14, 15]);

		assert.ok(results[0].warnings[1].fix);
		assert.equal(results[0].warnings[1].fix.text, '0000');
		assert.deepEqual(results[0].warnings[1].fix.range, [32, 33]);
	});

	it('should record only first EditInfo for overlapping ranges', async () => {
		const { results } = await standalone({
			code: 'a { background: linear-gradient(#abc, #00fc); }',
			config: {
				rules: {
					'color-hex-length': 'long',
				},
			},
			computeEditInfo: true,
		});

		assert.equal(results[0].warnings.length, 2);
		// First warning should have fix
		assert.ok(results[0].warnings[0].fix);
		assert.equal(results[0].warnings[0].fix.text, 'abbc');
		assert.deepEqual(results[0].warnings[0].fix.range, [34, 35]);

		// Second warning should not have fix due to overlapping range
		assert.equal(results[0].warnings[1].fix, undefined);
	});

	it('should use the correct syntax when computing EditInfo', async () => {
		const { results } = await standalone({
			customSyntax: 'postcss-scss',
			code: '// a comment\na {\n\tcolor: red;\n}',
			config: {
				rules: {
					'rule-empty-line-before': 'always',
				},
			},
			computeEditInfo: true,
		});

		assert.equal(results[0].warnings.length, 1);
		assert.ok(results[0].warnings[0].fix);
		assert.equal(results[0].warnings[0].fix.text, '\n\n');
		assert.deepEqual(results[0].warnings[0].fix.range, [12, 13]);
	});
});
