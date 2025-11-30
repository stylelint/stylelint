import { stripIndent } from 'common-tags';

import standalone from '../standalone.mjs';

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

		expect(results[0].warnings).toHaveLength(0);
		expect(results[0].fix).toBeUndefined();
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

		expect(results[0].warnings).toHaveLength(1);
		expect(results[0].warnings[0].fix).toBeTruthy();
		expect(results[0].warnings[0].fix.text).toBe('FFFF');
		expect(results[0].warnings[0].fix.range).toEqual([14, 15]);
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

		expect(results[0].warnings).toHaveLength(1);
		expect(results[0].warnings[0].fix).toBeUndefined();
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

		expect(results[0].warnings).toHaveLength(0);
		expect(results[0].fix).toBeUndefined();
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

		expect(results[0].warnings).toHaveLength(2);
		expect(results[0].warnings[0].fix).toBeTruthy();
		expect(results[0].warnings[0].fix.text).toBe('FFFF');
		expect(results[0].warnings[0].fix.range).toEqual([14, 15]);

		expect(results[0].warnings[1].fix).toBeTruthy();
		expect(results[0].warnings[1].fix.text).toBe('0000');
		expect(results[0].warnings[1].fix.range).toEqual([32, 33]);
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

		expect(results[0].warnings).toHaveLength(2);
		// First warning should have fix
		expect(results[0].warnings[0].fix).toBeTruthy();
		expect(results[0].warnings[0].fix.text).toBe('abbc');
		expect(results[0].warnings[0].fix.range).toEqual([34, 35]);

		// Second warning should not have fix due to overlapping range
		expect(results[0].warnings[1].fix).toBeUndefined();
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

		expect(results[0].warnings).toHaveLength(1);
		expect(results[0].warnings[0].fix).toBeTruthy();
		expect(results[0].warnings[0].fix.text).toBe('\n\n');
		expect(results[0].warnings[0].fix.range).toEqual([12, 13]);
	});
});
