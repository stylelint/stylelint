'use strict';

const configBlockNoEmpty = require('./fixtures/config-block-no-empty');
const standalone = require('../standalone');
const stringFormatter = require('../formatters/stringFormatter');
const stripAnsi = require('strip-ansi');

it('standalone with input css and alternate formatter specified by keyword', () => {
	return standalone({
		code: 'a {}',
		config: configBlockNoEmpty,
		formatter: 'string',
	}).then((linted) => {
		const output = linted.output;

		const strippedOutput = stripAnsi(output);

		expect(typeof output).toBe('string');
		expect(strippedOutput).toContain('1:3');
		expect(strippedOutput).toContain('block-no-empty');
	});
});

it('standalone with input css and alternate formatter function', () => {
	return standalone({
		code: 'a {}',
		config: configBlockNoEmpty,
		formatter: stringFormatter,
	}).then((linted) => {
		const output = linted.output;

		const strippedOutput = stripAnsi(output);

		expect(typeof output).toBe('string');
		expect(strippedOutput).toContain('1:3');
		expect(strippedOutput).toContain('block-no-empty');
	});
});

it('standalone with invalid formatter option', () => {
	return standalone({
		code: 'a {}',
		config: configBlockNoEmpty,
		formatter: 'invalid',
	}).catch((err) => {
		expect(err).toEqual(
			new Error(
				'You must use a valid formatter option: "compact", "json", "string", "unix", "verbose" or a function',
			),
		);
	});
});

it('standalone formatter receives {needlessDisables} as second argument', () => {
	const formatter = jest.fn((results, { needlessDisables }) => {
		return JSON.stringify({ results, needlessDisables }, null, 2);
	});

	return standalone({
		code: `
			/* stylelint-disable yo */
			a {}
		`,
		config: configBlockNoEmpty,
		reportNeedlessDisables: true,
		formatter,
	}).then((linted) => {
		const { output, results, needlessDisables } = linted;

		expect(needlessDisables).not.toBeUndefined();
		expect(needlessDisables).toHaveLength(1);

		expect(typeof output).toBe('string');
		expect(formatter).toHaveBeenCalledTimes(1);
		expect(output).toBe(JSON.stringify({ results, needlessDisables }, null, 2));
	});
});

it('standalone formatter receives {invalidScopeDisables} as second argument', () => {
	const formatter = jest.fn((results, { invalidScopeDisables }) => {
		return JSON.stringify({ results, invalidScopeDisables }, null, 2);
	});

	return standalone({
		code: `
			/* stylelint-disable indentation */
			a { color: red; }
		`,
		config: configBlockNoEmpty,
		reportInvalidScopeDisables: true,
		formatter,
	}).then((linted) => {
		const { output, results, invalidScopeDisables } = linted;

		expect(invalidScopeDisables).not.toBeUndefined();
		expect(invalidScopeDisables).toHaveLength(1);

		expect(typeof output).toBe('string');
		expect(formatter).toHaveBeenCalledTimes(1);
		expect(output).toBe(JSON.stringify({ results, invalidScopeDisables }, null, 2));
	});
});
