import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { it } from 'node:test';
import path from 'node:path';

import assertItemsPartialDeepStrictEqual from '../testUtils/assertItemsPartialDeepStrictEqual.mjs';
import replaceBackslashes from '../testUtils/replaceBackslashes.mjs';
import standalone from '../standalone.mjs';
import stripIndent from '../testUtils/stripIndent.mjs';

function fixture(name) {
	const dir = fileURLToPath(new URL('./fixtures/disableOptions', import.meta.url));

	return replaceBackslashes(path.join(dir, name));
}

it('invalidScopeDisables simple case', async () => {
	const config = {
		rules: {
			'block-closing-brace-newline-after': ['always'],
			'block-closing-brace-newline-before': ['always'],
		},
	};

	const css = stripIndent`
		/* stylelint-disable block-no-empty */
		a {}
		/* stylelint-enable block-no-empty */
		a {
			b {} /* stylelint-disable-line block-no-empty */
		}
		`;

	const { results } = await standalone({
		config,
		code: css,
		reportInvalidScopeDisables: true,
	});

	assert.equal(results.length, 1);
	assertItemsPartialDeepStrictEqual(invalidScopeDisables(results[0].warnings), [
		{
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 38,
			rule: '--report-invalid-scope-disables',
			text: 'Rule "block-no-empty" isn\'t enabled',
			severity: 'error',
		},
		{
			line: 5,
			column: 7,
			endLine: 5,
			endColumn: 49,
			rule: '--report-invalid-scope-disables',
			text: 'Rule "block-no-empty" isn\'t enabled',
			severity: 'error',
		},
	]);
});

it('invalidScopeDisables from config', async () => {
	const config = {
		reportInvalidScopeDisables: true,
		rules: {
			'block-closing-brace-newline-after': ['always'],
			'block-closing-brace-newline-before': ['always'],
		},
	};

	const css = stripIndent`
		/* stylelint-disable block-no-empty */
		a {}
		/* stylelint-enable block-no-empty */
		a {
			b {} /* stylelint-disable-line block-no-empty */
		}
		`;

	const { results } = await standalone({
		config,
		code: css,
	});

	assert.equal(results.length, 1);
	assertItemsPartialDeepStrictEqual(invalidScopeDisables(results[0].warnings), [
		{
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 38,
			rule: '--report-invalid-scope-disables',
			text: 'Rule "block-no-empty" isn\'t enabled',
			severity: 'error',
		},
		{
			line: 5,
			column: 7,
			endLine: 5,
			endColumn: 49,
			rule: '--report-invalid-scope-disables',
			text: 'Rule "block-no-empty" isn\'t enabled',
			severity: 'error',
		},
	]);
});

it('invalidScopeDisables complex case', async () => {
	const config = {
		rules: {
			'block-no-empty': true,
		},
	};

	const { results } = await standalone({
		config,
		files: [
			fixture('disabled-ranges-1.css'),
			fixture('disabled-ranges-2.css'),
			// ignore files contain `CssSyntaxError`
			fixture('disabled-ranges-3.css'),
		],
		reportInvalidScopeDisables: true,
	});

	assert.equal(results.length, 3);
	assertItemsPartialDeepStrictEqual(invalidScopeDisables(results[0].warnings), [
		{
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 35,
			rule: '--report-invalid-scope-disables',
			text: 'Rule "color-named" isn\'t enabled',
			severity: 'error',
		},
	]);
	assertItemsPartialDeepStrictEqual(invalidScopeDisables(results[1].warnings), [
		{
			line: 5,
			column: 6,
			endLine: 5,
			endColumn: 45,
			rule: '--report-invalid-scope-disables',
			text: 'Rule "color-named" isn\'t enabled',
			severity: 'error',
		},
	]);
	assert.equal(invalidScopeDisables(results[2].warnings).length, 0);
});

it('invalidScopeDisables ignored case', async () => {
	const config = {
		rules: {
			'color-named': 'never',
		},
	};

	const { results } = await standalone({
		config,
		files: [fixture('disabled-ranges-1.css'), fixture('ignored-file.css')],
		ignoreDisables: true,
		ignorePath: [fixture('.stylelintignore')],
		reportInvalidScopeDisables: true,
	});

	assert.equal(results.length, 1);
	assertItemsPartialDeepStrictEqual(invalidScopeDisables(results[0].warnings), [
		{
			line: 5,
			column: 1,
			endLine: 5,
			endColumn: 38,
			rule: '--report-invalid-scope-disables',
			text: 'Rule "block-no-empty" isn\'t enabled',
			severity: 'error',
		},
	]);
});

it('invalidScopeDisables without config', async () => {
	const { results } = await standalone({
		config: {
			rules: {},
		},
		code: 'a {}',
		ignoreDisables: true,
		reportInvalidScopeDisables: true,
	});

	assert.equal(results.length, 1);
	assert.equal(invalidScopeDisables(results[0].warnings).length, 0);
});

it('invalidScopeDisables for config file', async () => {
	const { results } = await standalone({
		files: [fixture('file-config/disabled-ranges-1.css')],
		reportInvalidScopeDisables: true,
	});

	assert.equal(results.length, 1);
	assertItemsPartialDeepStrictEqual(invalidScopeDisables(results[0].warnings), [
		{
			line: 4,
			column: 1,
			endLine: 4,
			endColumn: 27,
			rule: '--report-invalid-scope-disables',
			text: 'Rule "foo" isn\'t enabled',
			severity: 'error',
		},
	]);
});

it('invalidScopeDisables true except', async () => {
	const config = {
		rules: {
			'block-closing-brace-newline-after': ['always'],
			'block-closing-brace-newline-before': ['always'],
		},
	};

	const css = stripIndent`
		/* stylelint-disable block-no-empty */
		a {}
		/* stylelint-enable block-no-empty */
		a {
			b {} /* stylelint-disable-line color-hex-case */
		}
		`;

	const { results } = await standalone({
		config,
		code: css,
		reportInvalidScopeDisables: [true, { except: ['color-hex-case'] }],
	});

	assert.equal(results.length, 1);
	assertItemsPartialDeepStrictEqual(invalidScopeDisables(results[0].warnings), [
		{
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 38,
			rule: '--report-invalid-scope-disables',
			text: 'Rule "block-no-empty" isn\'t enabled',
			severity: 'error',
		},
	]);
});

it('invalidScopeDisables false except', async () => {
	const config = {
		rules: {
			'block-closing-brace-newline-after': ['always'],
			'block-closing-brace-newline-before': ['always'],
		},
	};

	const css = stripIndent`
		/* stylelint-disable block-no-empty */
		a {}
		/* stylelint-enable block-no-empty */
		a {
			b {} /* stylelint-disable-line invalid-hex-case */
		}
		`;

	const { results } = await standalone({
		config,
		code: css,
		reportInvalidScopeDisables: [false, { except: 'invalid-hex-case' }],
	});

	assert.equal(results.length, 1);
	assertItemsPartialDeepStrictEqual(invalidScopeDisables(results[0].warnings), [
		{
			line: 5,
			column: 7,
			endLine: 5,
			endColumn: 51,
			rule: '--report-invalid-scope-disables',
			text: 'Rule "invalid-hex-case" isn\'t enabled',
			severity: 'error',
		},
	]);
});

it('invalidScopeDisables severity', async () => {
	const config = {
		rules: {
			'block-closing-brace-newline-after': ['always'],
			'block-closing-brace-newline-before': ['always'],
		},
	};

	const css = stripIndent`
		/* stylelint-disable block-no-empty */
		a {}
		/* stylelint-enable block-no-empty */
		a {
			b {} /* stylelint-disable-line block-no-empty */
		}
		`;

	const { results } = await standalone({
		config,
		code: css,
		reportInvalidScopeDisables: [true, { severity: 'warning' }],
	});

	assert.equal(results.length, 1);
	assertItemsPartialDeepStrictEqual(invalidScopeDisables(results[0].warnings), [
		{
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 38,
			rule: '--report-invalid-scope-disables',
			text: 'Rule "block-no-empty" isn\'t enabled',
			severity: 'warning',
		},
		{
			line: 5,
			column: 7,
			endLine: 5,
			endColumn: 49,
			rule: '--report-invalid-scope-disables',
			text: 'Rule "block-no-empty" isn\'t enabled',
			severity: 'warning',
		},
	]);
});

function invalidScopeDisables(warnings) {
	return warnings.filter((warning) => warning.rule === '--report-invalid-scope-disables');
}
