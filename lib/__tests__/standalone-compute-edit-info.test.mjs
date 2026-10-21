import { describe, it } from 'node:test';

import standalone from '../standalone.mjs';
import stripIndent from '../testUtils/stripIndent.mjs';

describe('standalone with computeEditInfo', () => {
	it('should not record EditInfo when fix is enabled', async (t) => {
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

		t.assert.strictEqual(results[0].warnings.length, 0);
		t.assert.strictEqual(results[0].fix, undefined);
	});

	it('should record EditInfo when only computeEditInfo is enabled', async (t) => {
		const { results } = await standalone({
			code: 'a { color: #FFF; }',
			config: {
				rules: {
					'color-hex-length': 'long',
				},
			},
			computeEditInfo: true,
		});

		t.assert.strictEqual(results[0].warnings.length, 1);
		t.assert.ok(results[0].warnings[0].fix);
		t.assert.strictEqual(results[0].warnings[0].fix.text, 'FFFF');
		t.assert.deepStrictEqual(results[0].warnings[0].fix.range, [14, 15]);
	});

	it('should not record EditInfo when rule has disableFix', async (t) => {
		const { results } = await standalone({
			code: 'a { color: #FFF; }',
			config: {
				rules: {
					'color-hex-length': ['long', { disableFix: true }],
				},
			},
			computeEditInfo: true,
		});

		t.assert.strictEqual(results[0].warnings.length, 1);
		t.assert.strictEqual(results[0].warnings[0].fix, undefined);
	});

	it('should not record EditInfo for disabled rules', async (t) => {
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

		t.assert.strictEqual(results[0].warnings.length, 0);
		t.assert.strictEqual(results[0].fix, undefined);
	});

	it('should record EditInfo for multiple warnings', async (t) => {
		const { results } = await standalone({
			code: 'a { color: #FFF; background: #000; }',
			config: {
				rules: {
					'color-hex-length': 'long',
				},
			},
			computeEditInfo: true,
		});

		t.assert.strictEqual(results[0].warnings.length, 2);
		t.assert.ok(results[0].warnings[0].fix);
		t.assert.strictEqual(results[0].warnings[0].fix.text, 'FFFF');
		t.assert.deepStrictEqual(results[0].warnings[0].fix.range, [14, 15]);

		t.assert.ok(results[0].warnings[1].fix);
		t.assert.strictEqual(results[0].warnings[1].fix.text, '0000');
		t.assert.deepStrictEqual(results[0].warnings[1].fix.range, [32, 33]);
	});

	it('should record only first EditInfo for overlapping ranges', async (t) => {
		const { results } = await standalone({
			code: 'a { background: linear-gradient(#abc, #00fc); }',
			config: {
				rules: {
					'color-hex-length': 'long',
				},
			},
			computeEditInfo: true,
		});

		t.assert.strictEqual(results[0].warnings.length, 2);
		// First warning should have fix
		t.assert.ok(results[0].warnings[0].fix);
		t.assert.strictEqual(results[0].warnings[0].fix.text, 'abbc');
		t.assert.deepStrictEqual(results[0].warnings[0].fix.range, [34, 35]);

		// Second warning should not have fix due to overlapping range
		t.assert.strictEqual(results[0].warnings[1].fix, undefined);
	});

	it('should use the correct syntax when computing EditInfo', async (t) => {
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

		t.assert.strictEqual(results[0].warnings.length, 1);
		t.assert.ok(results[0].warnings[0].fix);
		t.assert.strictEqual(results[0].warnings[0].fix.text, '\n\n');
		t.assert.deepStrictEqual(results[0].warnings[0].fix.range, [12, 13]);
	});
});
