'use strict';

const path = require('path');
const replaceBackslashes = require('../testUtils/replaceBackslashes');
const standalone = require('../standalone');

const fixturesPath = replaceBackslashes(path.join(__dirname, 'fixtures'));

it('standalone with input css and `reportNeedlessDisables`', () => {
	const config = {
		quiet: true,
		rules: {
			'block-no-empty': true,
			'color-named': 'never',
		},
	};

	return standalone({
		code: '/* stylelint-disable color-named */\na {}',
		config,
		reportNeedlessDisables: true,
	}).then((linted) => {
		const needlessDisables = linted.needlessDisables;

		expect(typeof needlessDisables).toBe('object');
		expect(needlessDisables).toHaveLength(1);
		expect(needlessDisables[0].ranges).toHaveLength(1);
		expect(needlessDisables[0].ranges[0]).toEqual({
			start: 1,
			unusedRule: 'color-named',
		});

		expect(linted.results).toHaveLength(1);
		const warnings = linted.results[0].warnings;

		expect(typeof warnings).toBe('object');
		expect(warnings).toHaveLength(1);
		expect(warnings[0]).toEqual({
			line: 2,
			column: 3,
			rule: 'block-no-empty',
			severity: 'error',
			text: 'Unexpected empty block (block-no-empty)',
		});
	});
});

it('standalone with `reportNeedlessDisables` and correctly `stylelint-disable`', () => {
	const config = {
		quiet: true,
		rules: {
			'color-named': 'never',
		},
	};

	return standalone({
		code: '/* stylelint-disable color-named */\na { color: black; }',
		config,
		reportNeedlessDisables: true,
	}).then((linted) => {
		const needlessDisables = linted.needlessDisables;

		expect(typeof needlessDisables).toBe('object');
		expect(needlessDisables).toHaveLength(1);
		expect(needlessDisables[0].ranges).toHaveLength(0);

		expect(linted.results).toHaveLength(1);
		const warnings = linted.results[0].warnings;

		expect(typeof warnings).toBe('object');
		expect(warnings).toHaveLength(0);
	});
});

it('standalone with `reportNeedlessDisables` and `ignoreDisables`', () => {
	const config = {
		quiet: true,
		rules: {
			'color-named': 'never',
		},
	};

	return standalone({
		code: '/* stylelint-disable color-named */\na { color: black; }',
		config,
		reportNeedlessDisables: true,
		ignoreDisables: true,
	}).then((linted) => {
		const needlessDisables = linted.needlessDisables;

		expect(typeof needlessDisables).toBe('object');
		expect(needlessDisables).toHaveLength(1);
		expect(needlessDisables[0].ranges).toHaveLength(0);

		expect(linted.results).toHaveLength(1);
		const warnings = linted.results[0].warnings;

		expect(typeof warnings).toBe('object');
		expect(warnings).toHaveLength(1);
		expect(warnings[0]).toEqual({
			line: 2,
			column: 12,
			rule: 'color-named',
			severity: 'error',
			text: 'Unexpected named color "black" (color-named)',
		});
	});
});

it('standalone with input file(s) and `reportNeedlessDisables`', () => {
	const config = {
		quiet: true,
		rules: {
			'block-no-empty': true,
			'color-named': 'never',
		},
	};

	return standalone({
		files: replaceBackslashes(path.join(fixturesPath, 'empty-block-with-disables.css')),
		config,
		reportNeedlessDisables: true,
	}).then((linted) => {
		const needlessDisables = linted.needlessDisables;

		expect(typeof needlessDisables).toBe('object');
		expect(needlessDisables).toHaveLength(1);
		expect(needlessDisables[0].source).toBe(
			path.join(fixturesPath, 'empty-block-with-disables.css'),
		);
		expect(needlessDisables[0].ranges[0]).toEqual({
			start: 1,
			unusedRule: 'color-named',
		});
	});
});
