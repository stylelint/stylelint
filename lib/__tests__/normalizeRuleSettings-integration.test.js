'use strict';

const path = require('path');
const standalone = require('../standalone');

it('[normalized rule settings] primary option array', () => {
	return standalone({
		code: 'a:focus {}',
		config: {
			rules: {
				'selector-pseudo-class-blacklist': ['focus'],
			},
		},
	}).then((linted) => {
		expect(linted.results[0].warnings[0].rule).toBe('selector-pseudo-class-blacklist');
	});
});

it('[normalized rule settings] primary option array in array', () => {
	return standalone({
		code: 'a:focus {}',
		config: {
			rules: {
				'selector-pseudo-class-blacklist': [['focus']],
			},
		},
	}).then((linted) => {
		expect(linted.results[0].warnings[0].rule).toBe('selector-pseudo-class-blacklist');
	});
});

it('[normalized rule settings] no-array primary, primary option null', () => {
	return standalone({
		code: 'a:focus {}',
		config: {
			extends: [path.join(__dirname, 'fixtures/config-block-no-empty.json')],
			rules: {
				'block-no-empty': null,
			},
		},
	}).then((linted) => {
		expect(linted.results[0].warnings).toHaveLength(0);
	});
});

it('[normalized rule settings] no-array primary, primary option null in array', () => {
	return standalone({
		code: 'a:focus {}',
		config: {
			extends: [path.join(__dirname, 'fixtures/config-block-no-empty.json')],
			rules: {
				'block-no-empty': [null],
			},
		},
	}).then((linted) => {
		expect(linted.results[0].warnings).toHaveLength(0);
	});
});

it('[normalized rule settings] array primary, primary option null', () => {
	return standalone({
		code: 'a { top: 10px; }',
		config: {
			extends: [path.join(__dirname, 'fixtures/config-no-pixels.json')],
			rules: {
				'unit-blacklist': null,
			},
		},
	}).then((linted) => {
		expect(linted.results[0].warnings).toHaveLength(0);
	});
});

it('[normalized rule settings] array primary, primary option null in array', () => {
	return standalone({
		code: 'a { top: 10px; }',
		config: {
			extends: [path.join(__dirname, 'fixtures/config-no-pixels.json')],
			rules: {
				'unit-blacklist': [null],
			},
		},
	}).then((linted) => {
		expect(linted.results[0].invalidOptionWarnings).toHaveLength(0);
	});
});
