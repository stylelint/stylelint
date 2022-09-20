'use strict';

const path = require('path');
const { promises: fs, existsSync } = require('fs');

const cli = require('../cli');
const replaceBackslashes = require('../testUtils/replaceBackslashes');

const fixturesPath = (...elems) => replaceBackslashes(path.join(__dirname, 'fixtures', ...elems));

const removeFile = async (filePath) => {
	if (existsSync(filePath)) {
		await fs.unlink(filePath);
	}
};

jest.mock('../utils/getStdin', () => () => Promise.resolve(''));

describe('buildCLI', () => {
	beforeAll(() => {
		jest.spyOn(process, 'exit').mockImplementation(() => {});
		jest.spyOn(process.stdout, 'write').mockImplementation(() => {});
		jest.spyOn(process.stderr, 'write').mockImplementation(() => {});
		jest.spyOn(console, 'log').mockImplementation(() => {});
		jest.spyOn(console, 'error').mockImplementation(() => {});
	});

	afterEach(async () => {
		await removeFile(fixturesPath('.stylelintcache'));
	});

	afterAll(() => {
		jest.restoreAllMocks();
	});

	it('--cache with same warning', async () => {
		await cli([
			'--cache',
			'--cache-location',
			fixturesPath('.stylelintcache'),
			'--config',
			fixturesPath('default-severity-warning.json'),
			fixturesPath('empty-block.css'),
		]);
		await cli([
			'--cache',
			'--cache-location',
			fixturesPath('.stylelintcache'),
			'--config',
			fixturesPath('default-severity-warning.json'),
			fixturesPath('empty-block.css'),
		]);
		expect(process.stdout.write).toHaveBeenCalledTimes(1);
	});

	it('--cache with different warning', async () => {
		await cli([
			'--cache',
			'--cache-location',
			fixturesPath('.stylelintcache'),
			'--config',
			fixturesPath('default-severity-warning.json'),
			fixturesPath('empty-block.css'),
		]);
		await cli([
			'--cache',
			'--cache-location',
			fixturesPath('.stylelintcache'),
			'--config',
			fixturesPath('config-block-no-empty.json'),
			fixturesPath('empty-block.css'),
		]);
		expect(process.stdout.write).toHaveBeenCalledTimes(2);
	});
});
