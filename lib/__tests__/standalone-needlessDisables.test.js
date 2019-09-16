'use strict';

const path = require('path');
const replaceBackslashes = require("./replaceBackslashes");
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
		files: replaceBackslashes(
      path.join(fixturesPath, 'empty-block-with-disables.css')
    ),
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
