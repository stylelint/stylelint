'use strict';

const path = require('path');
const replaceBackslashes = require('../testUtils/replaceBackslashes');
const standalone = require('../standalone');

const fixturesPath = replaceBackslashes(path.join(__dirname, 'fixtures'));
const config = {
	quiet: true,
	rules: {
		'block-no-empty': true,
	},
};

it('standalone with input css and `reportInvalidScopeDisables`', () => {
	return standalone({
		code: '/* stylelint-disable color-named */\na {}',
		config,
		reportInvalidScopeDisables: true,
	}).then((linted) => {
		const invalidScopeDisables = linted.invalidScopeDisables;

		expect(typeof invalidScopeDisables).toBe('object');
		expect(invalidScopeDisables).toHaveLength(1);
		expect(invalidScopeDisables[0].ranges).toHaveLength(1);
		expect(invalidScopeDisables[0].ranges[0]).toEqual({
			start: 1,
			unusedRule: 'color-named',
		});
	});
});

it('standalone with input file(s) and `reportInvalidScopeDisables`', () => {
	return standalone({
		files: replaceBackslashes(path.join(fixturesPath, 'empty-block-with-disables.css')),
		config,
		reportInvalidScopeDisables: true,
	}).then((linted) => {
		const invalidScopeDisables = linted.invalidScopeDisables;

		expect(typeof invalidScopeDisables).toBe('object');
		expect(invalidScopeDisables).toHaveLength(1);
		expect(invalidScopeDisables[0].source).toBe(
			path.join(fixturesPath, 'empty-block-with-disables.css'),
		);
		expect(invalidScopeDisables[0].ranges[0]).toEqual({
			start: 1,
			unusedRule: 'color-named',
		});
	});
});
