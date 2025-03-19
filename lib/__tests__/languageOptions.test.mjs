import { fileURLToPath } from 'node:url';
import path from 'node:path';

import standalone from '../standalone.mjs';
import { stripIndent } from 'common-tags';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

describe('standalone with languageOptions', () => {
	describe('custom at-rules', () => {
		it('does not trigger warning for valid custom at-rule usage', async () => {
			const data = await standalone({
				code: stripIndent`
					@example custom-ident {
						foo: 10;
						bar: red;
					}
				`,
				configFile: path.join(__dirname, 'fixtures/config-language-options.json'),
			});

			const { report, results } = data;

			expect(report).not.toContain('at-rule-no-unknown');
			expect(report).not.toContain('at-rule-descriptor-no-unknown');
			expect(report).not.toContain('at-rule-descriptor-value-no-unknown');
			expect(report).not.toContain('at-rule-prelude-no-invalid');

			expect(results).toHaveLength(1);
			expect(results[0].warnings).toHaveLength(0);
		});

		it('triggers warning for unknown at-rule', async () => {
			const data = await standalone({
				code: '@foo { foo: bar; }',
				configFile: path.join(__dirname, 'fixtures/config-language-options.json'),
			});

			const { report, results } = data;

			expect(report).toContain('at-rule-no-unknown');

			expect(results).toHaveLength(1);
			expect(results[0].warnings).toHaveLength(1);

			const warning = results[0].warnings[0];

			expect(warning.rule).toBe('at-rule-no-unknown');
			expect(warning.text).toContain('Unexpected unknown at-rule');
			expect(warning.text).toContain('foo');
		});

		it('triggers warning for unknown descriptor in custom at-rule', async () => {
			const data = await standalone({
				code: '@example custom-ident { baz: red; }',
				configFile: path.join(__dirname, 'fixtures/config-language-options.json'),
			});

			const { report, results } = data;

			expect(report).toContain('at-rule-descriptor-no-unknown');

			expect(results).toHaveLength(1);
			expect(results[0].warnings).toHaveLength(1);

			const warning = results[0].warnings[0];

			expect(warning.rule).toBe('at-rule-descriptor-no-unknown');
			expect(warning.text).toContain('Unexpected unknown descriptor');
			expect(warning.text).toContain('baz');
		});

		it('triggers warning for invalid type of descriptor in custom at-rule', async () => {
			const data = await standalone({
				code: '@example custom-ident { foo: red; }',
				configFile: path.join(__dirname, 'fixtures/config-language-options.json'),
			});

			const { report, results } = data;

			expect(report).toContain('at-rule-descriptor-value-no-unknown');

			expect(results).toHaveLength(1);
			expect(results[0].warnings).toHaveLength(1);

			const warning = results[0].warnings[0];

			expect(warning.rule).toBe('at-rule-descriptor-value-no-unknown');
			expect(warning.text).toContain('Unexpected unknown value');
			expect(warning.text).toContain('foo');
		});

		it('triggers warning for invalid prelude in custom at-rule', async () => {
			const data = await standalone({
				code: '@example 123 {}',
				configFile: path.join(__dirname, 'fixtures/config-language-options.json'),
			});

			const { report, results } = data;

			expect(report).toContain('at-rule-prelude-no-invalid');

			expect(results).toHaveLength(1);
			expect(results[0].warnings).toHaveLength(1);

			const warning = results[0].warnings[0];

			expect(warning.rule).toBe('at-rule-prelude-no-invalid');
			expect(warning.text).toContain('Unexpected invalid prelude');
			expect(warning.text).toContain('123');
		});
	});

	describe('cssWideKeywords', () => {
		it('does not trigger warning for valid css-wide keyword', async () => {
			const data = await standalone({
				code: 'a { color: my-global-value; }',
				configFile: path.join(__dirname, 'fixtures/config-language-options.json'),
			});

			const { report, results } = data;

			expect(report).not.toContain('declaration-property-value-no-unknown');

			expect(results).toHaveLength(1);
			expect(results[0].warnings).toHaveLength(0);
		});

		it('triggers warning for unknown css-wide keyword', async () => {
			const data = await standalone({
				code: 'a { color: foo; }',
				configFile: path.join(__dirname, 'fixtures/config-language-options.json'),
			});

			const { report, results } = data;

			expect(report).toContain('declaration-property-value-no-unknown');

			expect(results).toHaveLength(1);
			expect(results[0].warnings).toHaveLength(1);

			const warning = results[0].warnings[0];

			expect(warning.rule).toBe('declaration-property-value-no-unknown');
			expect(warning.text).toContain('Unexpected unknown value');
			expect(warning.text).toContain('color');
		});
	});

	describe('properties', () => {
		it('does not trigger warning for valid custom property and value', async () => {
			const data = await standalone({
				code: 'a { bar: red; }',
				configFile: path.join(__dirname, 'fixtures/config-language-options.json'),
			});

			const { report, results } = data;

			expect(report).not.toContain('declaration-property-value-no-unknown');

			expect(results).toHaveLength(1);
			expect(results[0].warnings).toHaveLength(0);
		});

		it('triggers warning for invalid value of custom property', async () => {
			const data = await standalone({
				code: 'a { bar: 10px; }',
				configFile: path.join(__dirname, 'fixtures/config-language-options.json'),
			});

			const { report, results } = data;

			expect(report).toContain('declaration-property-value-no-unknown');

			expect(results).toHaveLength(1);
			expect(results[0].warnings).toHaveLength(1);

			const warning = results[0].warnings[0];

			expect(warning.rule).toBe('declaration-property-value-no-unknown');
			expect(warning.text).toContain('Unexpected unknown value');
			expect(warning.text).toContain('bar');
		});

		it('does not trigger warning for valid extended property type', async () => {
			const data = await standalone({
				code: stripIndent`
					a {
						top: var(--foo);
						bar: red;
					}
				`,
				configFile: path.join(__dirname, 'fixtures/config-language-options.json'),
			});

			const { report, results } = data;

			expect(report).not.toContain('declaration-property-value-no-unknown');
			expect(report).not.toContain('property-no-unknown');

			expect(results).toHaveLength(1);
			expect(results[0].warnings).toHaveLength(0);
		});

		it('triggers warning for invalid extended property type', async () => {
			const data = await standalone({
				code: 'a { top: --foo(red); }',
				configFile: path.join(__dirname, 'fixtures/config-language-options.json'),
			});

			const { report, results } = data;

			expect(report).toContain('declaration-property-value-no-unknown');

			expect(results).toHaveLength(1);
			expect(results[0].warnings).toHaveLength(1);

			const warning = results[0].warnings[0];

			expect(warning.rule).toBe('declaration-property-value-no-unknown');
			expect(warning.text).toContain('Unexpected unknown value');
			expect(warning.text).toContain('top');
		});

		it('triggers warning for unknown property', async () => {
			const data = await standalone({
				code: 'a { foo: 10px; }',
				configFile: path.join(__dirname, 'fixtures/config-language-options.json'),
			});

			const { report, results } = data;

			expect(report).toContain('property-no-unknown');

			expect(results).toHaveLength(1);
			expect(results[0].warnings).toHaveLength(1);

			const warning = results[0].warnings[0];

			expect(warning.rule).toBe('property-no-unknown');
			expect(warning.text).toContain('Unexpected unknown property');
			expect(warning.text).toContain('foo');
		});
	});

	describe('types', () => {
		it('triggers warning for invalid type usage in property', async () => {
			const data = await standalone({
				code: 'a { top: --foo(red); }',
				configFile: path.join(__dirname, 'fixtures/config-language-options.json'),
			});

			const { report, results } = data;

			expect(report).toContain('declaration-property-value-no-unknown');

			expect(results).toHaveLength(1);
			expect(results[0].warnings).toHaveLength(1);

			const warning = results[0].warnings[0];

			expect(warning.rule).toBe('declaration-property-value-no-unknown');
			expect(warning.text).toContain('Unexpected unknown value');
			expect(warning.text).toContain('top');
		});

		it('does not trigger warning for valid type usage in property', async () => {
			const data = await standalone({
				code: 'a { top: --foo(5px); }',
				configFile: path.join(__dirname, 'fixtures/config-language-options.json'),
			});

			const { report, results } = data;

			expect(report).not.toContain('declaration-property-value-no-unknown');

			expect(results).toHaveLength(1);
			expect(results[0].warnings).toHaveLength(0);
		});
	});
});
