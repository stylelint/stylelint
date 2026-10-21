import { describe, it } from 'node:test';
import path from 'node:path';

import standalone from '../standalone.mjs';
import stripIndent from '../testUtils/stripIndent.mjs';

const dirname = import.meta.dirname;

describe('standalone with languageOptions', () => {
	describe('custom at-rules', () => {
		it('does not trigger warning for valid custom at-rule usage', async (t) => {
			const data = await standalone({
				code: stripIndent`
					@example custom-ident {
						foo: 10;
						bar: red;
					}
				`,
				configFile: path.join(dirname, 'fixtures/config-language-options.json'),
			});

			const { report, results } = data;

			t.assert.ok(!report.includes('at-rule-no-unknown'));
			t.assert.ok(!report.includes('at-rule-descriptor-no-unknown'));
			t.assert.ok(!report.includes('at-rule-descriptor-value-no-unknown'));
			t.assert.ok(!report.includes('at-rule-prelude-no-invalid'));

			t.assert.strictEqual(results.length, 1);
			t.assert.strictEqual(results[0].warnings.length, 0);
		});

		it('triggers warning for unknown at-rule', async (t) => {
			const data = await standalone({
				code: '@foo { foo: bar; }',
				configFile: path.join(dirname, 'fixtures/config-language-options.json'),
			});

			const { report, results } = data;

			t.assert.ok(report.includes('at-rule-no-unknown'));

			t.assert.strictEqual(results.length, 1);
			t.assert.strictEqual(results[0].warnings.length, 1);

			const warning = results[0].warnings[0];

			t.assert.strictEqual(warning.rule, 'at-rule-no-unknown');
			t.assert.ok(warning.text.includes('Unknown at-rule'));
			t.assert.ok(warning.text.includes('foo'));
		});

		it('triggers warning for unknown descriptor in custom at-rule', async (t) => {
			const data = await standalone({
				code: '@example custom-ident { baz: red; }',
				configFile: path.join(dirname, 'fixtures/config-language-options.json'),
			});

			const { report, results } = data;

			t.assert.ok(report.includes('at-rule-descriptor-no-unknown'));

			t.assert.strictEqual(results.length, 1);
			t.assert.strictEqual(results[0].warnings.length, 1);

			const warning = results[0].warnings[0];

			t.assert.strictEqual(warning.rule, 'at-rule-descriptor-no-unknown');
			t.assert.ok(warning.text.includes('Unknown descriptor'));
			t.assert.ok(warning.text.includes('baz'));
		});

		it('triggers warning for invalid type of descriptor in custom at-rule', async (t) => {
			const data = await standalone({
				code: '@example custom-ident { foo: red; }',
				configFile: path.join(dirname, 'fixtures/config-language-options.json'),
			});

			const { report, results } = data;

			t.assert.ok(report.includes('at-rule-descriptor-value-no-unknown'));

			t.assert.strictEqual(results.length, 1);
			t.assert.strictEqual(results[0].warnings.length, 1);

			const warning = results[0].warnings[0];

			t.assert.strictEqual(warning.rule, 'at-rule-descriptor-value-no-unknown');
			t.assert.ok(warning.text.includes('Unknown value'));
			t.assert.ok(warning.text.includes('foo'));
		});

		it('triggers warning for invalid prelude in custom at-rule', async (t) => {
			const data = await standalone({
				code: '@example 123 {}',
				configFile: path.join(dirname, 'fixtures/config-language-options.json'),
			});

			const { report, results } = data;

			t.assert.ok(report.includes('at-rule-prelude-no-invalid'));

			t.assert.strictEqual(results.length, 1);
			t.assert.strictEqual(results[0].warnings.length, 1);

			const warning = results[0].warnings[0];

			t.assert.strictEqual(warning.rule, 'at-rule-prelude-no-invalid');
			t.assert.ok(warning.text.includes('Invalid prelude'));
			t.assert.ok(warning.text.includes('123'));
		});
	});

	describe('cssWideKeywords', () => {
		it('does not trigger warning for valid css-wide keyword', async (t) => {
			const data = await standalone({
				code: 'a { color: my-global-value; }',
				configFile: path.join(dirname, 'fixtures/config-language-options.json'),
			});

			const { report, results } = data;

			t.assert.ok(!report.includes('declaration-property-value-no-unknown'));

			t.assert.strictEqual(results.length, 1);
			t.assert.strictEqual(results[0].warnings.length, 0);
		});

		it('triggers warning for unknown css-wide keyword', async (t) => {
			const data = await standalone({
				code: 'a { color: foo; }',
				configFile: path.join(dirname, 'fixtures/config-language-options.json'),
			});

			const { report, results } = data;

			t.assert.ok(report.includes('declaration-property-value-no-unknown'));

			t.assert.strictEqual(results.length, 1);
			t.assert.strictEqual(results[0].warnings.length, 1);

			const warning = results[0].warnings[0];

			t.assert.strictEqual(warning.rule, 'declaration-property-value-no-unknown');
			t.assert.ok(warning.text.includes('Unknown value'));
			t.assert.ok(warning.text.includes('color'));
		});
	});

	describe('properties', () => {
		it('does not trigger warning for valid custom property and value', async (t) => {
			const data = await standalone({
				code: 'a { bar: red; }',
				configFile: path.join(dirname, 'fixtures/config-language-options.json'),
			});

			const { report, results } = data;

			t.assert.ok(!report.includes('declaration-property-value-no-unknown'));

			t.assert.strictEqual(results.length, 1);
			t.assert.strictEqual(results[0].warnings.length, 0);
		});

		it('triggers warning for invalid value of custom property', async (t) => {
			const data = await standalone({
				code: 'a { bar: 10px; }',
				configFile: path.join(dirname, 'fixtures/config-language-options.json'),
			});

			const { report, results } = data;

			t.assert.ok(report.includes('declaration-property-value-no-unknown'));

			t.assert.strictEqual(results.length, 1);
			t.assert.strictEqual(results[0].warnings.length, 1);

			const warning = results[0].warnings[0];

			t.assert.strictEqual(warning.rule, 'declaration-property-value-no-unknown');
			t.assert.ok(warning.text.includes('Unknown value'));
			t.assert.ok(warning.text.includes('bar'));
		});

		it('does not trigger warning for valid extended property type', async (t) => {
			const data = await standalone({
				code: stripIndent`
					a {
						top: var(--foo);
						bar: red;
					}
				`,
				configFile: path.join(dirname, 'fixtures/config-language-options.json'),
			});

			const { report, results } = data;

			t.assert.ok(!report.includes('declaration-property-value-no-unknown'));
			t.assert.ok(!report.includes('property-no-unknown'));

			t.assert.strictEqual(results.length, 1);
			t.assert.strictEqual(results[0].warnings.length, 0);
		});

		it('triggers warning for invalid extended property type', async (t) => {
			const data = await standalone({
				code: 'a { top: --foo(red); }',
				configFile: path.join(dirname, 'fixtures/config-language-options.json'),
			});

			const { report, results } = data;

			t.assert.ok(report.includes('declaration-property-value-no-unknown'));

			t.assert.strictEqual(results.length, 1);
			t.assert.strictEqual(results[0].warnings.length, 1);

			const warning = results[0].warnings[0];

			t.assert.strictEqual(warning.rule, 'declaration-property-value-no-unknown');
			t.assert.ok(warning.text.includes('Unknown value'));
			t.assert.ok(warning.text.includes('top'));
		});

		it('triggers warning for unknown property', async (t) => {
			const data = await standalone({
				code: 'a { foo: 10px; }',
				configFile: path.join(dirname, 'fixtures/config-language-options.json'),
			});

			const { report, results } = data;

			t.assert.ok(report.includes('property-no-unknown'));

			t.assert.strictEqual(results.length, 1);
			t.assert.strictEqual(results[0].warnings.length, 1);

			const warning = results[0].warnings[0];

			t.assert.strictEqual(warning.rule, 'property-no-unknown');
			t.assert.ok(warning.text.includes('Unknown property'));
			t.assert.ok(warning.text.includes('foo'));
		});
	});

	describe('units', () => {
		it('does not trigger warning for custom unit in declaration value', async (t) => {
			const data = await standalone({
				code: 'a { top: 10--foo; }',
				configFile: path.join(dirname, 'fixtures/config-language-options.json'),
			});

			const { report, results } = data;

			t.assert.ok(!report.includes('declaration-property-value-no-unknown'));
			t.assert.ok(!report.includes('unit-no-unknown'));

			t.assert.strictEqual(results.length, 1);
			t.assert.strictEqual(results[0].warnings.length, 0);
		});

		it('triggers warnings for unknown custom unit', async (t) => {
			const data = await standalone({
				code: 'a { top: 10--bar; }',
				configFile: path.join(dirname, 'fixtures/config-language-options.json'),
			});

			const { results } = data;

			t.assert.strictEqual(results.length, 1);

			const warnings = results[0].warnings;

			t.assert.ok(warnings.length >= 1);

			const rules = warnings.map((w) => w.rule);

			t.assert.ok(rules.includes('unit-no-unknown'));
		});
	});

	describe('types', () => {
		it('triggers warning for invalid type usage in property', async (t) => {
			const data = await standalone({
				code: 'a { top: --foo(red); }',
				configFile: path.join(dirname, 'fixtures/config-language-options.json'),
			});

			const { report, results } = data;

			t.assert.ok(report.includes('declaration-property-value-no-unknown'));

			t.assert.strictEqual(results.length, 1);
			t.assert.strictEqual(results[0].warnings.length, 1);

			const warning = results[0].warnings[0];

			t.assert.strictEqual(warning.rule, 'declaration-property-value-no-unknown');
			t.assert.ok(warning.text.includes('Unknown value'));
			t.assert.ok(warning.text.includes('top'));
		});

		it('does not trigger warning for valid type usage in property', async (t) => {
			const data = await standalone({
				code: 'a { top: --foo(5px); }',
				configFile: path.join(dirname, 'fixtures/config-language-options.json'),
			});

			const { report, results } = data;

			t.assert.ok(!report.includes('declaration-property-value-no-unknown'));

			t.assert.strictEqual(results.length, 1);
			t.assert.strictEqual(results[0].warnings.length, 0);
		});
	});
});
