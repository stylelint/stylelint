'use strict';

const invalidScopeDisables = require('../invalidScopeDisables');
const path = require('path');
const replaceBackslashes = require('../testUtils/replaceBackslashes');
const standalone = require('../standalone');
const stripIndent = require('common-tags').stripIndent;

function fixture(name) {
	return replaceBackslashes(path.join(__dirname, './fixtures/disableOptions', name));
}

function source(name) {
	return path.join(__dirname, './fixtures/disableOptions', name);
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
	}).then((linted) => {
		const report = invalidScopeDisables(linted.results, config);

		expect(report).toHaveLength(1);
		expect(report[0].ranges).toHaveLength(2);
		expect(report[0].ranges).toEqual([
			{ end: 3, start: 1, unusedRule: 'block-no-empty' },
			{ end: 5, start: 5, unusedRule: 'block-no-empty' },
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
	}).then((linted) => {
		expect(invalidScopeDisables(linted.results, config)).toEqual([
			{
				source: source('disabled-ranges-1.css'),
				ranges: [{ start: 1, end: 3, unusedRule: 'color-named' }],
			},
			{
				source: source('disabled-ranges-2.css'),
				ranges: [{ start: 5, end: 5, unusedRule: 'color-named' }],
			},
		]);
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
	}).then((linted) => {
		expect(invalidScopeDisables(linted.results, config)).toEqual([
			{
				source: source('disabled-ranges-1.css'),
				ranges: [{ start: 5, end: 7, unusedRule: 'block-no-empty' }],
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
	}).then((linted) => {
		expect(invalidScopeDisables(linted.results)).toEqual([]);
	});
});

it('invalidScopeDisables for config file', () => {
	return standalone({
		files: [fixture('file-config/disabled-ranges-1.css')],
		reportInvalidScopeDisables: true,
	}).then((linted) => {
		expect(linted.invalidScopeDisables).toHaveLength(1);
		expect(linted.invalidScopeDisables[0].ranges).toEqual([
			{
				end: undefined,
				start: 4,
				unusedRule: 'foo',
			},
		]);
	});
});
