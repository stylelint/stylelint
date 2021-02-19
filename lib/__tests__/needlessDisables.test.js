'use strict';

const path = require('path');
const replaceBackslashes = require('../testUtils/replaceBackslashes');
const standalone = require('../standalone');
const stripIndent = require('common-tags').stripIndent;

function fixture(name) {
	return replaceBackslashes(path.join(__dirname, './fixtures/disableOptions', name));
}

it('needlessDisables simple case', () => {
	const config = {
		rules: { 'block-no-empty': true },
	};

	const css = stripIndent`
    /* stylelint-disable */
    a {}
    /* stylelint-enable */
    a {
      b {} /* stylelint-disable-line block-no-empty */
    }
    /* stylelint-disable */
    a { color: pink; }
    /* stylelint-enable */
    a {
      b { color: pink; } /* stylelint-disable-line block-no-empty */
    }
    `;

	return standalone({
		config,
		code: css,
		reportNeedlessDisables: true,
	}).then((linted) => {
		const results = linted.results;

		expect(results).toHaveLength(1);
		const warnings = results[0].warnings;

		expect(warnings).toEqual([
			{
				line: 7,
				column: 1,
				text: 'Needless disable for "all"',
				rule: '--report-needless-disables',
				severity: 'error',
			},
			{
				line: 11,
				column: 22,
				text: 'Needless disable for "block-no-empty"',
				rule: '--report-needless-disables',
				severity: 'error',
			},
		]);
	});
});

it('needlessDisables with config', () => {
	const config = {
		reportNeedlessDisables: true,
		rules: { 'block-no-empty': true },
	};

	const css = stripIndent`
    /* stylelint-disable */
    a {}
    /* stylelint-enable */
    a {
      b {} /* stylelint-disable-line block-no-empty */
    }
    /* stylelint-disable */
    a { color: pink; }
    /* stylelint-enable */
    a {
      b { color: pink; } /* stylelint-disable-line block-no-empty */
    }
    `;

	return standalone({
		config,
		code: css,
	}).then((linted) => {
		const results = linted.results;

		expect(results).toHaveLength(1);
		const warnings = results[0].warnings;

		expect(warnings).toEqual([
			{
				line: 7,
				column: 1,
				text: 'Needless disable for "all"',
				rule: '--report-needless-disables',
				severity: 'error',
			},
			{
				line: 11,
				column: 22,
				text: 'Needless disable for "block-no-empty"',
				rule: '--report-needless-disables',
				severity: 'error',
			},
		]);
	});
});

it('needlessDisables with multiple rules', () => {
	const config = {
		rules: { 'block-no-empty': true, 'color-named': true },
	};

	const css = stripIndent`
    /* stylelint-disable-next-line block-no-empty, color-named */
    a {}
    `;

	return standalone({
		config,
		code: css,
		reportNeedlessDisables: true,
	}).then((linted) => {
		const results = linted.results;

		expect(results).toHaveLength(1);
		const warnings = results[0].warnings;

		expect(warnings).toEqual([
			{
				line: 1,
				column: 1,
				text: 'Needless disable for "color-named"',
				rule: '--report-needless-disables',
				severity: 'error',
			},
		]);
	});
});

it('needlessDisables complex case', () => {
	const config = {
		rules: {
			'block-no-empty': true,
			'color-named': 'never',
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
		reportNeedlessDisables: true,
	}).then((linted) => {
		const results = linted.results;

		expect(results).toHaveLength(3);
		expect(needlessDisables(results[0].warnings)).toEqual([
			{
				line: 1,
				column: 1,
				text: 'Needless disable for "color-named"',
				rule: '--report-needless-disables',
				severity: 'error',
			},
			{
				line: 5,
				column: 1,
				text: 'Needless disable for "block-no-empty"',
				rule: '--report-needless-disables',
				severity: 'error',
			},
		]);

		expect(needlessDisables(results[1].warnings)).toEqual([
			{
				line: 6,
				column: 19,
				text: 'Needless disable for "block-no-empty"',
				rule: '--report-needless-disables',
				severity: 'error',
			},
			{
				line: 8,
				column: 1,
				text: 'Needless disable for "block-no-empty"',
				rule: '--report-needless-disables',
				severity: 'error',
			},
			{
				line: 5,
				column: 6,
				text: 'Needless disable for "color-named"',
				rule: '--report-needless-disables',
				severity: 'error',
			},
		]);

		expect(needlessDisables(results[2].warnings)).toHaveLength(0);
	});
});

it('needlessDisables ignored case', () => {
	const config = {
		rules: {
			'block-no-empty': true,
		},
	};

	return standalone({
		config,
		files: [fixture('disabled-ranges-1.css'), fixture('ignored-file.css')],
		reportNeedlessDisables: true,
		ignorePath: fixture('.stylelintignore'),
	}).then((linted) => {
		const results = linted.results;

		expect(results).toHaveLength(1);
		const warnings = results[0].warnings;

		expect(needlessDisables(warnings)).toEqual([
			{
				line: 10,
				column: 19,
				text: 'Needless disable for "all"',
				rule: '--report-needless-disables',
				severity: 'error',
			},
			{
				line: 1,
				column: 1,
				text: 'Needless disable for "color-named"',
				rule: '--report-needless-disables',
				severity: 'error',
			},
			{
				line: 5,
				column: 1,
				text: 'Needless disable for "block-no-empty"',
				rule: '--report-needless-disables',
				severity: 'error',
			},
		]);
	});
});

it('needlessDisables true except', () => {
	const config = {
		rules: { 'color-hex-case': true },
	};

	const css = stripIndent`
    /* stylelint-disable */
    a {}
    /* stylelint-enable */
    a {
      b {} /* stylelint-disable-line block-no-empty */
    }
    /* stylelint-disable */
    a { color: pink; }
    /* stylelint-enable */
    a {
      b { color: pink; } /* stylelint-disable-line color-hex-case */
    }
    `;

	return standalone({
		config,
		code: css,
		reportNeedlessDisables: [true, { except: 'block-no-empty' }],
	}).then((linted) => {
		const results = linted.results;

		expect(results).toHaveLength(1);
		const warnings = results[0].warnings;

		expect(warnings).toEqual([
			{
				line: 1,
				column: 1,
				text: 'Needless disable for "all"',
				rule: '--report-needless-disables',
				severity: 'error',
			},
			{
				line: 7,
				column: 1,
				text: 'Needless disable for "all"',
				rule: '--report-needless-disables',
				severity: 'error',
			},
			{
				line: 11,
				column: 22,
				text: 'Needless disable for "color-hex-case"',
				rule: '--report-needless-disables',
				severity: 'error',
			},
		]);
	});
});

it('needlessDisables false except', () => {
	const config = {
		rules: { 'color-hex-case': true },
	};

	const css = stripIndent`
    /* stylelint-disable */
    a {}
    /* stylelint-enable */
    a {
      b {} /* stylelint-disable-line block-no-empty */
    }
    /* stylelint-disable */
    a { color: pink; }
    /* stylelint-enable */
    a {
      b { color: pink; } /* stylelint-disable-line color-hex-case */
    }
    `;

	return standalone({
		config,
		code: css,
		reportNeedlessDisables: [false, { except: 'color-hex-case' }],
	}).then((linted) => {
		const results = linted.results;

		expect(results).toHaveLength(1);
		const warnings = results[0].warnings;

		expect(warnings).toEqual([
			{
				line: 11,
				column: 22,
				text: 'Needless disable for "color-hex-case"',
				rule: '--report-needless-disables',
				severity: 'error',
			},
		]);
	});
});

it('needlessDisables severity', () => {
	const config = {
		rules: { 'block-no-empty': true },
	};

	const css = stripIndent`
    /* stylelint-disable */
    a {}
    /* stylelint-enable */
    a {
      b {} /* stylelint-disable-line block-no-empty */
    }
    /* stylelint-disable */
    a { color: pink; }
    /* stylelint-enable */
    a {
      b { color: pink; } /* stylelint-disable-line block-no-empty */
    }
    `;

	return standalone({
		config,
		code: css,
		reportNeedlessDisables: [true, { severity: 'warning' }],
	}).then((linted) => {
		const results = linted.results;

		expect(results).toHaveLength(1);
		const warnings = results[0].warnings;

		expect(warnings).toEqual([
			{
				line: 7,
				column: 1,
				text: 'Needless disable for "all"',
				rule: '--report-needless-disables',
				severity: 'warning',
			},
			{
				line: 11,
				column: 22,
				text: 'Needless disable for "block-no-empty"',
				rule: '--report-needless-disables',
				severity: 'warning',
			},
		]);
	});
});

function needlessDisables(warnings) {
	return warnings.filter((warning) => warning.rule === '--report-needless-disables');
}
