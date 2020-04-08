/* eslint no-console: off */
'use strict';

const cli = require('../../lib/cli');
const path = require('path');
const pkg = require('../../package.json');
const { replaceBackslashes } = require('../systemTestUtils');

jest.mock('get-stdin');

describe('CLI', () => {
	beforeAll(() => {
		jest.spyOn(process, 'exit').mockImplementation(() => {});
		jest.spyOn(process.stdout, 'write').mockImplementation(() => {});
		jest.spyOn(console, 'log').mockImplementation(() => {});
	});

	afterAll(() => {
		jest.restoreAllMocks();
	});

	it('basic', async () => {
		await cli([]);

		expect(process.exit).toHaveBeenCalledWith(2);

		expect(console.log).toHaveBeenCalledTimes(1);
		expect(console.log).toHaveBeenCalledWith(
			expect.stringContaining('Usage: stylelint [input] [options]'),
		);
	});

	it('--help', async () => {
		await cli(['--help']);

		expect(process.exit).toHaveBeenCalledWith(0);

		expect(console.log).toHaveBeenCalledTimes(1);
		expect(console.log.mock.calls[0][0]).toMatchSnapshot();
	});

	it('--version', async () => {
		await cli(['--version']);

		expect(process.exitCode).toBeUndefined();

		expect(console.log).toHaveBeenCalledTimes(1);
		expect(console.log).toHaveBeenCalledWith(expect.stringContaining(pkg.version));
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
