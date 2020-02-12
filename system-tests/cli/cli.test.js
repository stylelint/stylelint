/* eslint no-console: off */
'use strict';

const cli = require('../../lib/cli');
const path = require('path');
const pkg = require('../../package.json');
const { replaceBackslashes } = require('../systemTestUtils');

jest.mock('get-stdin');

describe('CLI', () => {
	let processRestore;
	let logRestore;

	beforeAll(() => {
		processRestore = { ...process };
		logRestore = { ...console };
		process.exit = (exitCode) => (process.exitCode = exitCode);
	});

	afterAll(() => {
		Object.assign(process, processRestore);
		Object.assign(console, logRestore);
	});

	beforeEach(() => {
		process.exitCode = undefined;
		console.log = jest.fn();
		process.stdout.write = jest.fn();
	});

	it('basic', async () => {
		await cli([]);

		expect(process.exitCode).toBe(2);
		expect(console.log.mock.calls).toHaveLength(1);
		const lastCallArgs = console.log.mock.calls.pop();

		expect(lastCallArgs).toHaveLength(1);
		expect(lastCallArgs.pop()).toMatch('Usage: stylelint [input] [options]');
	});

	it('--help', async () => {
		await cli(['--help']);

		expect(process.exitCode).toBe(0);
		expect(console.log.mock.calls).toHaveLength(1);
		const lastCallArgs = console.log.mock.calls.pop();

		expect(lastCallArgs).toHaveLength(1);
		expect(lastCallArgs.pop()).toMatchSnapshot();
	});

	it('--version', async () => {
		await cli(['--version']);

		expect(process.exitCode).toBeUndefined();
		expect(console.log.mock.calls).toHaveLength(1);
		const lastCallArgs = console.log.mock.calls.pop();

		expect(lastCallArgs).toHaveLength(1);
		expect(lastCallArgs.pop()).toMatch(pkg.version);
	});

	it('--print-config', async () => {
		await cli([
			'--print-config',
			'--config',
			path.join(__dirname, 'config.json'),
			replaceBackslashes(path.join(__dirname, 'stylesheet.css')),
		]);

		expect(process.exitCode).toBeUndefined();
		expect(process.stdout.write).toHaveBeenCalledTimes(1);
		expect(process.stdout.write).toHaveBeenLastCalledWith(
			JSON.stringify(
				{
					rules: {
						'block-no-empty': [true],
						'no-empty-source': [true],
					},
				},
				null,
				'  ',
			),
		);
	});

	it('--report-needless-disables', async () => {
		await cli([
			'--report-needless-disables',
			'--config',
			path.join(__dirname, 'config.json'),
			replaceBackslashes(path.join(__dirname, 'stylesheet.css')),
		]);

		expect(process.exitCode).toBe(2);
		expect(process.stdout.write).toHaveBeenCalledTimes(2);
		expect(process.stdout.write).toHaveBeenNthCalledWith(
			1,
			expect.stringContaining('unused rule: color-named'),
		);
		expect(process.stdout.write).toHaveBeenNthCalledWith(
			2,
			expect.stringContaining('Unexpected empty block'),
		);
	});

	it('--stdin', async () => {
		await cli(['--stdin', '--config', path.join(__dirname, 'config.json')]);

		expect(process.exitCode).toBe(2);

		expect(process.stdout.write).toHaveBeenCalledTimes(1);
		expect(process.stdout.write).toHaveBeenNthCalledWith(
			1,
			expect.stringContaining('Unexpected empty source'),
		);
	});
});
