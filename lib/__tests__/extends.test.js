'use strict';

const configExtendingAnotherExtend = require('./fixtures/config-extending-another-extend.json');
const configExtendingOne = require('./fixtures/config-extending-one');
const configExtendingThreeWithOverride = require('./fixtures/config-extending-three-with-override');
const path = require('path');
const standalone = require('../standalone');

const fixturesPath = path.join(__dirname, 'fixtures');

it('basic extending', () => {
	return standalone({
		code: 'a {}',
		config: configExtendingOne,
		configBasedir: path.join(__dirname, 'fixtures'),
	}).then((linted) => {
		expect(typeof linted.output).toBe('string');
		expect(linted.results).toHaveLength(1);
		expect(linted.results[0].warnings).toHaveLength(1);
		expect(linted.results[0].warnings[0].rule).toBe('block-no-empty');
	});
});

it('recursive extending', () => {
	return standalone({
		code: 'a {}',
		config: configExtendingAnotherExtend,
		configBasedir: path.join(__dirname, 'fixtures'),
	}).then((linted) => {
		expect(typeof linted.output).toBe('string');
		expect(linted.results).toHaveLength(1);
		expect(linted.results[0].warnings).toHaveLength(1);
		expect(linted.results[0].warnings[0].rule).toBe('block-no-empty');
	});
});

it('extending with overrides', () => {
	return standalone({
		code: 'a {}',
		config: configExtendingThreeWithOverride,
		configBasedir: path.join(__dirname, 'fixtures'),
	}).then((linted) => {
		expect(linted.results[0].warnings).toHaveLength(0);
	});
});

it('extending configuration and no configBasedir', () => {
	return standalone({
		code: 'a {}',
		config: configExtendingOne,
	})
		.then(() => {
			throw new Error('should have failed');
		})
		.catch((err) => {
			expect(err.code).toBe(78);
		});
});

it('extending a config that is overridden', () => {
	return standalone({
		code: 'a { b: "c" }',
		config: {
			extends: [`${fixturesPath}/config-string-quotes-single`],
			rules: { 'string-quotes': 'double' },
		},
	}).then((linted) => {
		expect(linted.results[0].warnings).toHaveLength(0);
	});
});

describe('extending a config from process.cwd', () => {
	let actualCwd;

	beforeAll(() => {
		actualCwd = process.cwd();
		process.chdir(__dirname);
	});

	afterAll(() => {
		process.chdir(actualCwd);
	});

	it('works', () => {
		return standalone({
			code: 'a { b: "c" }',
			config: {
				extends: ['./fixtures/config-string-quotes-single'],
			},
		}).then((linted) => {
			expect(linted.results[0].warnings).toHaveLength(1);
		});
	});
});
