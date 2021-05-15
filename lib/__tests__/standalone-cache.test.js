'use strict';

const hash = require('../utils/hash');
const path = require('path');
const standalone = require('../standalone');
const fixturesPath = path.join(__dirname, 'fixtures');
const fCache = require('file-entry-cache');
const replaceBackslashes = require('../testUtils/replaceBackslashes');
const { promises: fs, constants: fsConstants } = require('fs');

const fileExists = (filePath) =>
	fs.access(filePath, fsConstants.F_OK).then(
		() => true,
		() => false,
	);

const cwd = process.cwd();
const invalidFile = path.join(fixturesPath, 'empty-block.css');
const syntaxErrorFile = path.join(fixturesPath, 'syntax_error.css');
const validFile = path.join(fixturesPath, 'cache', 'valid.css');
const newFileDest = path.join(fixturesPath, 'cache', 'newFile.css');

// Config object is getting mutated internally.
// Return new object of the same structure to
// make sure config doesn't change between runs.
function getConfig() {
	return {
		files: replaceBackslashes(path.join(fixturesPath, 'cache', '*.css')),
		config: {
			rules: { 'block-no-empty': true, 'color-no-invalid-hex': true },
		},
		cache: true,
	};
}

describe('standalone cache', () => {
	const expectedCacheFilePath = path.join(cwd, '.stylelintcache');

	beforeEach(() => {
		// Initial run to warm up the cache
		return standalone(getConfig());
	});

	afterEach(() => {
		// Clean up after each test case
		return Promise.all([
			fs.unlink(expectedCacheFilePath).catch(() => {
				// fs.unlink() throws an error if file doesn't exist and it's ok. We just
				// want to make sure it's not there for next test.
			}),
			fs.unlink(newFileDest).catch(() => {
				// fs.unlink() throws an error if file doesn't exist and it's ok. We just
				// want to make sure it's not there for next test.
			}),
		]);
	});

	it('cache file is created at $CWD/.stylelintcache', () => {
		// Ensure cache file exists
		return fileExists(expectedCacheFilePath).then((isFileExist) => {
			expect(Boolean(isFileExist)).toBe(true);

			const fileCache = fCache.createFromFile(expectedCacheFilePath);
			const { cache } = fileCache;

			// Ensure cache file contains only linted css file
			expect(typeof cache.getKey(validFile) === 'object').toBe(true);
			expect(typeof cache.getKey(newFileDest) === 'undefined').toBe(true);
		});
	});

	it('only changed files are linted', () => {
		// Add "changed" file
		return fs
			.copyFile(validFile, newFileDest)
			.then(() => {
				// Next run should lint only changed files
				return standalone(getConfig());
			})
			.then((output) => {
				// Ensure only changed files are linted
				const isValidFileLinted = Boolean(output.results.find((file) => file.source === validFile));
				const isNewFileLinted = Boolean(output.results.find((file) => file.source === newFileDest));

				expect(isValidFileLinted).toBe(false);
				expect(isNewFileLinted).toBe(true);

				const fileCache = fCache.createFromFile(expectedCacheFilePath);
				const { cache } = fileCache;

				expect(typeof cache.getKey(validFile) === 'object').toBe(true);
				expect(typeof cache.getKey(newFileDest) === 'object').toBe(true);
			});
	});

	it('all files are linted on config change', () => {
		const changedConfig = getConfig();

		changedConfig.config.rules['block-no-empty'] = false;

		return fs
			.copyFile(validFile, newFileDest)
			.then(() => {
				// All file should be re-linted as config has changed
				return standalone(changedConfig);
			})
			.then((output) => {
				// Ensure all files are re-linted
				const isValidFileLinted = Boolean(output.results.find((file) => file.source === validFile));
				const isNewFileLinted = Boolean(output.results.find((file) => file.source === newFileDest));

				expect(isValidFileLinted).toBe(true);
				expect(isNewFileLinted).toBe(true);
			});
	});

	it('invalid files are not cached', () => {
		return fs
			.copyFile(invalidFile, newFileDest)
			.then(() => {
				// Should lint only changed files
				return standalone(getConfig());
			})
			.then((output) => {
				expect(output.errored).toBe(true);
				// Ensure only changed files are linted
				const isValidFileLinted = Boolean(output.results.find((file) => file.source === validFile));
				const isInvalidFileLinted = Boolean(
					output.results.find((file) => file.source === newFileDest),
				);

				expect(isValidFileLinted).toBe(false);
				expect(isInvalidFileLinted).toBe(true);

				const fileCache = fCache.createFromFile(expectedCacheFilePath);
				const { cache } = fileCache;

				expect(typeof cache.getKey(validFile) === 'object').toBe(true);
				expect(typeof cache.getKey(newFileDest) === 'undefined').toBe(true);
			});
	});
	it('files with syntax errors are not cached', () => {
		return fs
			.copyFile(syntaxErrorFile, newFileDest)
			.then(() => {
				// Should lint only changed files
				return standalone(getConfig());
			})
			.then(() => {
				const fileCache = fCache.createFromFile(expectedCacheFilePath);
				const { cache } = fileCache;

				expect(typeof cache.getKey(validFile) === 'object').toBe(true);
				expect(typeof cache.getKey(newFileDest) === 'undefined').toBe(true);
			});
	});
	it('cache file is removed when cache is disabled', async () => {
		const noCacheConfig = getConfig();

		noCacheConfig.cache = false;

		await standalone(noCacheConfig);
		await expect(fileExists(expectedCacheFilePath)).resolves.toBe(false);
	});
	// eslint-disable-next-line jest/no-disabled-tests
	it.skip("cache doesn't do anything if string is passed", async () => {
		const config = {
			code: '.foo {}',
			codeFilename: 'foo.css',
			cache: true,
			config: {
				rules: {
					'color-no-invalid-hex': true,
				},
			},
		};

		const lintResults = await standalone(config);

		expect(lintResults.errored).toBe(false);

		await expect(fileExists(expectedCacheFilePath)).resolves.toBe(false);
	});
});
describe('standalone cache uses cacheLocation', () => {
	const cacheLocationFile = path.join(fixturesPath, 'cache', '.cachefile');
	const cacheLocationDir = path.join(fixturesPath, 'cache');
	const expectedCacheFilePath = path.join(cacheLocationDir, `.stylelintcache_${hash(cwd)}`);

	afterEach(() => {
		// clean up after each test
		return Promise.all([
			fs.unlink(expectedCacheFilePath).catch(() => {
				// fs.unlink() throws an error if file doesn't exist and it's ok. We just
				// want to make sure it's not there for next test.
			}),
			fs.unlink(cacheLocationFile).catch(() => {
				// fs.unlink() throws an error if file doesn't exist and it's ok. We just
				// want to make sure it's not there for next test.
			}),
		]);
	});
	it('cacheLocation is a file', () => {
		const config = getConfig();

		config.cacheLocation = cacheLocationFile;

		return standalone(config)
			.then(() => {
				// Ensure cache file is created
				return fileExists(cacheLocationFile);
			})
			.then((fileStats) => {
				expect(Boolean(fileStats)).toBe(true);

				const fileCache = fCache.createFromFile(cacheLocationFile);
				const { cache } = fileCache;

				expect(typeof cache.getKey(validFile) === 'object').toBe(true);
			});
	});
	it('cacheLocation is a directory', () => {
		const config = getConfig();

		config.cacheLocation = cacheLocationDir;

		return standalone(config)
			.then(() => {
				return fileExists(expectedCacheFilePath);
			})
			.then((cacheFileStats) => {
				// Ensure cache file is created
				expect(Boolean(cacheFileStats)).toBe(true);

				const fileCache = fCache.createFromFile(expectedCacheFilePath);
				const { cache } = fileCache;

				expect(typeof cache.getKey(validFile) === 'object').toBe(true);
			});
	});
});
