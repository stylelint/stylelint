'use strict';

const path = require('path');
const replaceBackslashes = require('../testUtils/replaceBackslashes');
const standalone = require('../standalone');
const stripIndent = require('common-tags').stripIndent;

function fixture(name) {
	return replaceBackslashes(path.join(__dirname, './fixtures/disableOptions', name));
}

it('invalidScopeDisables simple case', () => {
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

	return standalone({
		config,
		code: css,
		reportInvalidScopeDisables: true,
	}).then((linted) => {
		const results = linted.results;

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
				column: 8,
				rule: '--report-invalid-scope-disables',
				text: 'Rule "block-no-empty" isn\'t enabled',
				severity: 'error',
			},
		]);
	});
});

it('invalidScopeDisables complex case', () => {
	const config = {
		rules: {
			'block-no-empty': true,
		},
	};

	return standalone({
		config,
		files: [
			fixture('disabled-ranges-1.css'),
			fixture('disabled-ranges-2.css'),
			// ignore files contain `CssSyntaxError`
			fixture('disabled-ranges-3.css'),
		],
		reportInvalidScopeDisables: true,
	}).then((linted) => {
		const results = linted.results;

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
});

it('invalidScopeDisables ignored case', () => {
	const config = {
		rules: {
			'color-named': 'never',
		},
	};

	return standalone({
		config,
		files: [fixture('disabled-ranges-1.css'), fixture('ignored-file.css')],
		ignoreDisables: true,
		ignorePath: fixture('.stylelintignore'),
		reportInvalidScopeDisables: true,
	}).then((linted) => {
		const results = linted.results;

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
});

it('invalidScopeDisables without config', () => {
	return standalone({
		config: {
			rules: {},
		},
		code: 'a {}',
		ignoreDisables: true,
		reportInvalidScopeDisables: true,
	}).then((linted) => {
		const results = linted.results;

		expect(results).toHaveLength(1);
		expect(invalidScopeDisables(results[0].warnings)).toHaveLength(0);
	});
});

it('invalidScopeDisables for config file', () => {
	return standalone({
		files: [fixture('file-config/disabled-ranges-1.css')],
		reportInvalidScopeDisables: true,
	}).then((linted) => {
		const results = linted.results;

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
});

function invalidScopeDisables(warnings) {
	return warnings.filter((warning) => warning.rule === '--report-invalid-scope-disables');
}
