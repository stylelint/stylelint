'use strict';

const path = require('path');
const replaceBackslashes = require('../testUtils/replaceBackslashes');
const standalone = require('../standalone');
const stripIndent = require('common-tags').stripIndent;

function source(name) {
	return path.join(__dirname, './fixtures/disableOptions', name);
}

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
		const report = linted.needlessDisables;

		expect(report).toHaveLength(1);
		expect(report[0].ranges).toEqual([
			{ start: 7, end: 9, unusedRule: 'all' },
			{ start: 11, end: 11, unusedRule: 'block-no-empty' },
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
		expect(linted.needlessDisables).toEqual([
			{
				source: source('disabled-ranges-1.css'),
				ranges: [
					{ start: 1, end: 3, unusedRule: 'color-named' },
					{ start: 5, end: 7, unusedRule: 'block-no-empty' },
					{ start: 10, end: 10, unusedRule: 'block-no-empty' },
				],
			},
			{
				source: source('disabled-ranges-2.css'),
				ranges: [
					{ start: 5, end: 5, unusedRule: 'color-named' },
					{ start: 6, end: 6, unusedRule: 'block-no-empty' },
					{ start: 8, end: 10, unusedRule: 'block-no-empty' },
				],
			},
		]);
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
		expect(linted.needlessDisables).toEqual([
			{
				source: source('disabled-ranges-1.css'),
				ranges: [
					{ start: 1, end: 3, unusedRule: 'color-named' },
					{ start: 5, end: 7, unusedRule: 'block-no-empty' },
					{ start: 10, end: 10, unusedRule: 'all' },
				],
			},
		]);
	});
});
