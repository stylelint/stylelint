import { fileURLToPath } from 'node:url';
import path from 'node:path';

import standalone from '../standalone.mjs';
import { stripIndent } from 'common-tags';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

describe('standalone with languageOptions', () => {
	describe('custom at-rules', () => {
		it('triggers warning for unknown descriptor "baz" in custom at-rule "@example"', async () => {
			const data = await standalone({
				code: stripIndent`
                    @example custom-ident {
                        foo: 10;
                        bar: red;
                        baz: 20;
                    }
                `,
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

		it('triggers warning for invalid type of descriptor "foo" in custom at-rule "@example"', async () => {
			const data = await standalone({
				code: stripIndent`
                    @example custom-ident {
                        foo: red;
                        bar: red;
                    }
                `,
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

		it('triggers warning for invalid prelude in custom at-rule "@example"', async () => {
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
	});

	describe('properties', () => {
		it('triggers warning for unknown property', async () => {
			const data = await standalone({
				code: 'a { top: --bar(5px); }',
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

		it('triggers warning for invalid property type', async () => {
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

	describe('types', () => {
		it('triggers warning for unknown type', async () => {
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

		it('does not trigger warning for valid type', async () => {
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
