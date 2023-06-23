import { copyFile, utimes, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import fCache from 'file-entry-cache';

import hash from '../utils/hash.js';
import removeFile from '../testUtils/removeFile.js';
import replaceBackslashes from '../testUtils/replaceBackslashes.js';
import safeChdir from '../testUtils/safeChdir.js';
import standalone from '../standalone.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const isChanged = (file, targetFilePath) => {
	return file.source === targetFilePath && !file.ignored;
};

const fixturesPath = path.join(__dirname, 'fixtures');
const invalidFile = path.join(fixturesPath, 'empty-block.css');
const syntaxErrorFile = path.join(fixturesPath, 'syntax_error.css');
const validFile = path.join(fixturesPath, 'cache', 'valid.css');
const newFileDest = path.join(fixturesPath, 'cache', 'newFile.css');

// Config object is getting mutated internally.
// Return new object of the same structure to
// make sure config doesn't change between runs.
function getConfig(additional = {}) {
	return {
		files: replaceBackslashes(path.join(fixturesPath, 'cache', '*.css')),
		config: {
			rules: { 'block-no-empty': true, 'color-no-invalid-hex': true },
		},
		cache: true,
		...additional,
	};
}

describe('standalone cache', () => {
	const cwd = path.join(__dirname, 'tmp', 'standalone-cache');

	safeChdir(cwd);

	const expectedCacheFilePath = path.join(cwd, '.stylelintcache');

	beforeEach(async () => {
		// Initial run to warm up the cache
		await standalone(getConfig());
	});

	afterEach(async () => {
		// Clean up after each test case
		await removeFile(expectedCacheFilePath);
		await removeFile(newFileDest);
	});

	it('cache file is created at $CWD/.stylelintcache', async () => {
		// Ensure cache file exists
		expect(existsSync(expectedCacheFilePath)).toBe(true);

		const { cache } = fCache.createFromFile(expectedCacheFilePath);

		// Ensure cache file contains only linted css file
		expect(typeof cache.getKey(validFile)).toBe('object');
		expect(cache.getKey(validFile)).toBeTruthy();
		expect(cache.getKey(newFileDest)).toBeUndefined();
	});

	it('only changed files are linted', async () => {
		// Add "changed" file
		await copyFile(validFile, newFileDest);

		// Next run should lint only changed files
		const { results } = await standalone(getConfig());

		// Ensure only changed files are linted
		expect(results.some((file) => isChanged(file, validFile))).toBe(false);
		expect(results.some((file) => isChanged(file, newFileDest))).toBe(true);

		const { cache } = fCache.createFromFile(expectedCacheFilePath);

		expect(typeof cache.getKey(validFile)).toBe('object');
		expect(cache.getKey(validFile)).toBeTruthy();
		expect(typeof cache.getKey(newFileDest)).toBe('object');
		expect(cache.getKey(newFileDest)).toBeTruthy();
	});

	it('all files are linted on config change', async () => {
		await copyFile(validFile, newFileDest);

		// All file should be re-linted as config has changed
		const { results } = await standalone(
			getConfig({
				config: {
					rules: { 'block-no-empty': false },
				},
			}),
		);

		// Ensure all files are re-linted
		expect(results.some((file) => isChanged(file, validFile))).toBe(true);
		expect(results.some((file) => isChanged(file, newFileDest))).toBe(true);
	});

	it('invalid files are not cached', async () => {
		await copyFile(invalidFile, newFileDest);

		// Should lint only changed files
		const { errored, results } = await standalone(getConfig());

		expect(errored).toBe(true);

		// Ensure only changed files are linted
		expect(results.some((file) => isChanged(file, validFile))).toBe(false);
		expect(results.some((file) => isChanged(file, newFileDest))).toBe(true);

		const { cache } = fCache.createFromFile(expectedCacheFilePath);

		expect(typeof cache.getKey(validFile)).toBe('object');
		expect(cache.getKey(validFile)).toBeTruthy();
		expect(cache.getKey(newFileDest)).toBeUndefined();
	});

	it('warning files are not cached', async () => {
		await copyFile(invalidFile, newFileDest);

		const { errored, results } = await standalone(
			getConfig({
				config: {
					rules: { 'block-no-empty': [true, { severity: 'warning' }] },
				},
			}),
		);

		expect(errored).toBe(false);

		// cache is discarded because config changed
		expect(results.some((file) => isChanged(file, validFile))).toBe(true);
		expect(results.some((file) => isChanged(file, newFileDest))).toBe(true);

		const { cache } = fCache.createFromFile(expectedCacheFilePath);

		expect(typeof cache.getKey(validFile)).toBe('object');
		expect(cache.getKey(validFile)).toBeTruthy();
		expect(cache.getKey(newFileDest)).toBeUndefined();
	});

	it('files with syntax errors are not cached', async () => {
		await copyFile(syntaxErrorFile, newFileDest);

		// Should lint only changed files
		await standalone(getConfig());

		const { cache } = fCache.createFromFile(expectedCacheFilePath);

		expect(typeof cache.getKey(validFile)).toBe('object');
		expect(cache.getKey(validFile)).toBeTruthy();
		expect(cache.getKey(newFileDest)).toBeUndefined();
	});

	it('cache file is removed when cache is disabled', async () => {
		await standalone(getConfig({ cache: false }));
		expect(existsSync(expectedCacheFilePath)).toBe(false);
	});

	it("cache doesn't do anything if string is passed", async () => {
		// Ensure no cache file
		await removeFile(expectedCacheFilePath);

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
		expect(existsSync(expectedCacheFilePath)).toBe(false);
	});
});

describe('standalone cache uses cacheLocation', () => {
	const cwd = path.join(__dirname, 'tmp', 'standalone-cache-uses-cacheLocation');

	safeChdir(cwd);

	const cacheLocationFile = path.join(fixturesPath, 'cache', '.cachefile');
	const cacheLocationDir = path.join(fixturesPath, 'cache');
	const expectedCacheFilePath = path.join(cacheLocationDir, `.stylelintcache_${hash(cwd)}`);

	afterEach(async () => {
		// clean up after each test
		await removeFile(expectedCacheFilePath);
		await removeFile(cacheLocationFile);
	});

	it('cacheLocation is a file', async () => {
		await standalone(getConfig({ cacheLocation: cacheLocationFile }));

		// Ensure cache file is created
		expect(existsSync(cacheLocationFile)).toBe(true);

		const { cache } = fCache.createFromFile(cacheLocationFile);

		expect(typeof cache.getKey(validFile)).toBe('object');
		expect(cache.getKey(validFile)).toBeTruthy();
	});

	it('cacheLocation is a directory', async () => {
		await standalone(getConfig({ cacheLocation: cacheLocationDir }));

		// Ensure cache file is created
		expect(existsSync(expectedCacheFilePath)).toBe(true);

		const { cache } = fCache.createFromFile(expectedCacheFilePath);

		expect(typeof cache.getKey(validFile)).toBe('object');
		expect(cache.getKey(validFile)).toBeTruthy();
	});
});

describe('standalone cache (enabled in config)', () => {
	const cwd = path.join(__dirname, 'tmp', 'standalone-cache');

	safeChdir(cwd);

	const expectedCacheFilePath = path.join(cwd, '.stylelintcache');

	function getConfigWithCache(additional = {}) {
		return {
			files: replaceBackslashes(path.join(fixturesPath, 'cache', '*.css')),
			config: {
				cache: true,
				rules: { 'block-no-empty': true, 'color-no-invalid-hex': true },
			},
			...additional,
		};
	}

	beforeEach(async () => {
		// Initial run to warm up the cache
		await standalone(getConfigWithCache());
	});

	afterEach(async () => {
		// Clean up after each test case
		await removeFile(expectedCacheFilePath);
		await removeFile(newFileDest);
	});

	it('uses cache by default (option is not provided)', async () => {
		// Add "changed" file
		await copyFile(validFile, newFileDest);

		// Next run should lint only changed files
		const { results } = await standalone(getConfigWithCache());

		// Ensure only changed files are linted
		expect(results.some((file) => isChanged(file, validFile))).toBe(false);
		expect(results.some((file) => isChanged(file, newFileDest))).toBe(true);

		const { cache } = fCache.createFromFile(expectedCacheFilePath);

		expect(typeof cache.getKey(validFile)).toBe('object');
		expect(cache.getKey(validFile)).toBeTruthy();
		expect(typeof cache.getKey(newFileDest)).toBe('object');
		expect(cache.getKey(newFileDest)).toBeTruthy();
	});

	it('uses cache when option explicitly enables cache', async () => {
		// Add "changed" file
		await copyFile(validFile, newFileDest);

		// Next run should lint only changed files
		const { results } = await standalone(getConfigWithCache({ cache: true }));

		// Ensure only changed files are linted
		expect(results.some((file) => isChanged(file, validFile))).toBe(false);
		expect(results.some((file) => isChanged(file, newFileDest))).toBe(true);

		const { cache } = fCache.createFromFile(expectedCacheFilePath);

		expect(typeof cache.getKey(validFile)).toBe('object');
		expect(cache.getKey(validFile)).toBeTruthy();
		expect(typeof cache.getKey(newFileDest)).toBe('object');
		expect(cache.getKey(newFileDest)).toBeTruthy();
	});

	it('does not use cache when option explicitly disables cache', async () => {
		// Add "changed" file
		await copyFile(validFile, newFileDest);

		// Next run should lint all files (regardless of changed)
		const { results } = await standalone(getConfigWithCache({ cache: false }));

		// Ensure all files are linted
		expect(results.some((file) => isChanged(file, validFile))).toBe(true);
		expect(results.some((file) => isChanged(file, newFileDest))).toBe(true);

		const { cache } = fCache.createFromFile(expectedCacheFilePath);

		expect(cache.getKey(validFile)).toBeUndefined();
		expect(cache.getKey(newFileDest)).toBeUndefined();
	});
});

describe('standalone cache uses a config file', () => {
	const cwd = path.join(__dirname, 'tmp', 'standalone-cache-use-config-file');

	safeChdir(cwd);

	const configFile = path.join(cwd, '.stylelintrc.json');
	const lintedFile = path.join(cwd, 'a.css');

	beforeEach(async () => {
		await writeFile(lintedFile, 'a {}');
	});

	afterEach(async () => {
		await removeFile(configFile);
		await removeFile(lintedFile);
	});

	it('cache is discarded when a config file is changed', async () => {
		const config = { files: [lintedFile], config: undefined, cache: true };

		// No warnings when a rule is disabled.
		await writeFile(
			configFile,
			JSON.stringify({
				rules: { 'block-no-empty': null },
			}),
		);
		const { results } = await standalone(config);

		expect(results[0].warnings).toHaveLength(0);

		// Some warnings when a rule becomes enabled by changing the config.
		await writeFile(
			configFile,
			JSON.stringify({
				rules: { 'block-no-empty': true },
			}),
		);
		const { results: resultsNew } = await standalone(config);

		expect(resultsNew[0].warnings).toHaveLength(1);
	});
});

describe('standalone cache uses cacheStrategy', () => {
	const cwd = path.join(__dirname, 'tmp', 'standalone-cache-uses-cacheStrategy');

	safeChdir(cwd);

	const expectedCacheFilePath = path.join(cwd, '.stylelintcache');

	afterEach(async () => {
		// clean up after each test
		await removeFile(expectedCacheFilePath);
		await removeFile(newFileDest);
	});

	it('cacheStrategy is invalid', async () => {
		await expect(standalone(getConfig({ cacheStrategy: 'foo' }))).rejects.toThrow(
			'"foo" cache strategy is unsupported. Specify either "metadata" or "content"',
		);
	});

	it('cacheStrategy is "metadata"', async () => {
		const cacheStrategy = 'metadata';

		await copyFile(validFile, newFileDest);
		const { results } = await standalone(getConfig({ cacheStrategy }));

		expect(results.some((file) => isChanged(file, newFileDest))).toBe(true);

		// No content change, but file metadata id changed
		await utimes(newFileDest, new Date(), new Date());
		const { results: resultsCached } = await standalone(getConfig({ cacheStrategy }));

		expect(resultsCached.some((file) => isChanged(file, newFileDest))).toBe(true);
	});

	it('cacheStrategy is "content"', async () => {
		const cacheStrategy = 'content';

		await copyFile(validFile, newFileDest);
		const { results } = await standalone(getConfig({ cacheStrategy }));

		expect(results.some((file) => isChanged(file, newFileDest))).toBe(true);

		// No content change, but file metadata id changed
		await utimes(newFileDest, new Date(), new Date());
		const { results: resultsCached } = await standalone(getConfig({ cacheStrategy }));

		expect(resultsCached.some((file) => isChanged(file, newFileDest))).toBe(false);
	});
});
