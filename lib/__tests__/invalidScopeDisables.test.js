'use strict';

const path = require('path');
const { stripIndent } = require('common-tags');

const replaceBackslashes = require('../testUtils/replaceBackslashes');
const standalone = require('../standalone');

function fixture(name) {
	return replaceBackslashes(path.join(__dirname, 'fixtures', 'disableOptions', name));
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

	expect(results).toHaveLength(1);
	expect(invalidScopeDisables(results[0].warnings)).toEqual([
		{
			line: 1,
			column: 1,
			rule: '--report-invalid-scope-disables',
			text: 'Rule "block-no-empty" isn\'t enabled',
			severity: 'error',
		},
		{
			line: 5,
			column: 7,
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

	expect(results).toHaveLength(1);
	expect(invalidScopeDisables(results[0].warnings)).toEqual([
		{
			line: 1,
			column: 1,
			rule: '--report-invalid-scope-disables',
			text: 'Rule "block-no-empty" isn\'t enabled',
			severity: 'error',
		},
		{
			line: 5,
			column: 7,
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

	expect(results).toHaveLength(3);
	expect(invalidScopeDisables(results[0].warnings)).toEqual([
		{
			line: 1,
			column: 1,
			rule: '--report-invalid-scope-disables',
			text: 'Rule "color-named" isn\'t enabled',
			severity: 'error',
		},
	]);
	expect(invalidScopeDisables(results[1].warnings)).toEqual([
		{
			line: 5,
			column: 6,
			rule: '--report-invalid-scope-disables',
			text: 'Rule "color-named" isn\'t enabled',
			severity: 'error',
		},
	]);
	expect(invalidScopeDisables(results[2].warnings)).toHaveLength(0);
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
		ignorePath: fixture('.stylelintignore'),
		reportInvalidScopeDisables: true,
	});

	expect(results).toHaveLength(1);
	expect(invalidScopeDisables(results[0].warnings)).toEqual([
		{
			line: 5,
			column: 1,
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

	expect(results).toHaveLength(1);
	expect(invalidScopeDisables(results[0].warnings)).toHaveLength(0);
});

it('invalidScopeDisables for config file', async () => {
	const { results } = await standalone({
		files: [fixture('file-config/disabled-ranges-1.css')],
		reportInvalidScopeDisables: true,
	});

	expect(results).toHaveLength(1);
	expect(invalidScopeDisables(results[0].warnings)).toEqual([
		{
			line: 4,
			column: 1,
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

	expect(results).toHaveLength(1);
	expect(invalidScopeDisables(results[0].warnings)).toEqual([
		{
			line: 1,
			column: 1,
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

	expect(results).toHaveLength(1);
	expect(invalidScopeDisables(results[0].warnings)).toEqual([
		{
			line: 5,
			column: 7,
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

	expect(results).toHaveLength(1);
	expect(invalidScopeDisables(results[0].warnings)).toEqual([
		{
			line: 1,
			column: 1,
			rule: '--report-invalid-scope-disables',
			text: 'Rule "block-no-empty" isn\'t enabled',
			severity: 'warning',
		},
		{
			line: 5,
			column: 7,
			rule: '--report-invalid-scope-disables',
			text: 'Rule "block-no-empty" isn\'t enabled',
			severity: 'warning',
		},
	]);
});

function invalidScopeDisables(warnings) {
	return warnings.filter((warning) => warning.rule === '--report-invalid-scope-disables');
}
