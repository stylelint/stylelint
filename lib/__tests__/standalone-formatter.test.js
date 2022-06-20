'use strict';

const configBlockNoEmpty = require('./fixtures/config-block-no-empty');
const standalone = require('../standalone');
const stringFormatter = require('../formatters/stringFormatter');
const stripAnsi = require('strip-ansi');

it('standalone with input css and alternate formatter specified by keyword', async () => {
	const { output } = await standalone({
		code: 'a {}',
		config: configBlockNoEmpty,
		formatter: 'string',
	});

	expect(typeof output).toBe('string');

	const strippedOutput = stripAnsi(output);

	expect(strippedOutput).toContain('1:3');
	expect(strippedOutput).toContain('block-no-empty');
});

it('standalone with input css and alternate formatter function', async () => {
	const { output } = await standalone({
		code: 'a {}',
		config: configBlockNoEmpty,
		formatter: stringFormatter,
	});

	expect(typeof output).toBe('string');

	const strippedOutput = stripAnsi(output);

	expect(strippedOutput).toContain('1:3');
	expect(strippedOutput).toContain('block-no-empty');
});

it('standalone with invalid formatter option', async () => {
	await expect(
		standalone({
			code: 'a {}',
			config: configBlockNoEmpty,
			formatter: 'invalid',
		}),
	).rejects.toThrow(
		'You must use a valid formatter option: "compact", "json", "string", "tap", "unix", "verbose" or a function',
	);
});
