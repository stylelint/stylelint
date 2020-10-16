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
