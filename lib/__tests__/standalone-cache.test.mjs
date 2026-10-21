import { afterEach, beforeEach, describe, it } from 'node:test';
import { copyFile, rm, utimes, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

import hash from '../utils/hash.mjs';
import readJSONFile from '../testUtils/readJSONFile.mjs';
import replaceBackslashes from '../testUtils/replaceBackslashes.mjs';
import safeChdir from '../testUtils/safeChdir.mjs';
import standalone from '../standalone.mjs';

const dirname = import.meta.dirname;

const isChanged = (file, targetFilePath) => {
	return file.source === targetFilePath && !file.ignored;
};

const fixturesPath = path.join(dirname, 'fixtures');
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

// The hashes vary per run, so compare the files with the type of their hash.
function hashTypesByFile(cacheFilePath) {
	return Object.fromEntries(
		Object.entries(readJSONFile(cacheFilePath)).map(([file, value]) => [file, typeof value]),
	);
}

describe('standalone cache', () => {
	const cwd = path.join(dirname, 'tmp', 'standalone-cache');

	safeChdir(cwd);

	const expectedCacheFilePath = path.join(cwd, '.stylelintcache');

	beforeEach(async () => {
		// Initial run to warm up the cache
		await standalone(getConfig());
	});

	afterEach(async () => {
		// Clean up after each test case
		await rm(expectedCacheFilePath, { force: true });
		await rm(newFileDest, { force: true });
	});

	it('cache file is created at $CWD/.stylelintcache', async (t) => {
		// Ensure cache file contains only linted css file
		t.assert.deepStrictEqual(hashTypesByFile(expectedCacheFilePath), { [validFile]: 'string' });
	});

	it('only changed files are linted', async (t) => {
		// Add "changed" file
		await copyFile(validFile, newFileDest);

		// Next run should lint only changed files
		const { results } = await standalone(getConfig());

		// Ensure only changed files are linted
		t.assert.strictEqual(
			results.some((file) => isChanged(file, validFile)),
			false,
		);
		t.assert.strictEqual(
			results.some((file) => isChanged(file, newFileDest)),
			true,
		);

		t.assert.deepStrictEqual(hashTypesByFile(expectedCacheFilePath), {
			[validFile]: 'string',
			[newFileDest]: 'string',
		});
	});

	it('all files are linted on config change', async (t) => {
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
		t.assert.strictEqual(
			results.some((file) => isChanged(file, validFile)),
			true,
		);
		t.assert.strictEqual(
			results.some((file) => isChanged(file, newFileDest)),
			true,
		);
	});

	it('invalid files are not cached', async (t) => {
		await copyFile(invalidFile, newFileDest);

		// Should lint only changed files
		const { errored, results } = await standalone(getConfig());

		t.assert.strictEqual(errored, true);

		// Ensure only changed files are linted
		t.assert.strictEqual(
			results.some((file) => isChanged(file, validFile)),
			false,
		);
		t.assert.strictEqual(
			results.some((file) => isChanged(file, newFileDest)),
			true,
		);

		t.assert.deepStrictEqual(hashTypesByFile(expectedCacheFilePath), { [validFile]: 'string' });
	});

	it('warning files are not cached', async (t) => {
		await copyFile(invalidFile, newFileDest);

		const { errored, results } = await standalone(
			getConfig({
				config: {
					rules: { 'block-no-empty': [true, { severity: 'warning' }] },
				},
			}),
		);

		t.assert.strictEqual(errored, false);

		// cache is discarded because config changed
		t.assert.strictEqual(
			results.some((file) => isChanged(file, validFile)),
			true,
		);
		t.assert.strictEqual(
			results.some((file) => isChanged(file, newFileDest)),
			true,
		);

		t.assert.deepStrictEqual(hashTypesByFile(expectedCacheFilePath), { [validFile]: 'string' });
	});

	it('files with syntax errors are not cached', async (t) => {
		await copyFile(syntaxErrorFile, newFileDest);

		// Should lint only changed files
		await standalone(getConfig());

		t.assert.deepStrictEqual(hashTypesByFile(expectedCacheFilePath), { [validFile]: 'string' });
	});

	it('files with a special comment problem are not cached', async (t) => {
		const inputFile = path.join(fixturesPath, 'empty-block-with-disables.css');

		await copyFile(inputFile, newFileDest);

		const { errored, results } = await standalone(
			getConfig({
				config: {
					rules: {},
				},
				reportNeedlessDisables: true,
			}),
		);

		t.assert.strictEqual(errored, true);
		t.assert.strictEqual(results[0].warnings[0].rule, '--report-needless-disables');

		t.assert.deepStrictEqual(hashTypesByFile(expectedCacheFilePath), { [validFile]: 'string' });
	});

	it('entries for deleted files are removed', async (t) => {
		await copyFile(validFile, newFileDest);
		await standalone(getConfig());
		await rm(newFileDest);
		await standalone(getConfig());

		t.assert.deepStrictEqual(hashTypesByFile(expectedCacheFilePath), { [validFile]: 'string' });
	});

	it('cache files in the previous format are replaced', async (t) => {
		// The `flatted` format that `file-entry-cache` wrote
		await writeFile(
			expectedCacheFilePath,
			JSON.stringify([
				['1'],
				{ key: '2', value: '3' },
				validFile,
				{ size: 18, mtime: 0, data: '4' },
				{ hashOfConfig: '5' },
				'bgSGIERCvv',
			]),
		);

		const { results } = await standalone(getConfig());

		t.assert.strictEqual(
			results.some((file) => isChanged(file, validFile)),
			true,
		);
		t.assert.deepStrictEqual(hashTypesByFile(expectedCacheFilePath), { [validFile]: 'string' });
	});

	it('corrupt cache files are removed and recreated', async (t) => {
		await writeFile(expectedCacheFilePath, 'something invalid !');

		await standalone(getConfig({ cache: true }));

		t.assert.strictEqual(existsSync(expectedCacheFilePath), true);
	});

	it('cache file is removed when cache is disabled', async (t) => {
		await standalone(getConfig({ cache: false }));
		t.assert.strictEqual(existsSync(expectedCacheFilePath), false);
	});

	it("cache doesn't do anything if string is passed", async (t) => {
		// Ensure no cache file
		await rm(expectedCacheFilePath, { force: true });

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

		t.assert.strictEqual(lintResults.errored, false);
		t.assert.strictEqual(existsSync(expectedCacheFilePath), false);
	});
});

describe('standalone cache uses cacheLocation', () => {
	const cwd = path.join(dirname, 'tmp', 'standalone-cache-uses-cacheLocation');

	safeChdir(cwd);

	const cacheLocationFile = path.join(fixturesPath, 'cache', '.cachefile');
	const cacheLocationDir = path.join(fixturesPath, 'cache');
	const expectedCacheFilePath = path.join(cacheLocationDir, `.stylelintcache_${hash(cwd)}`);

	afterEach(async () => {
		// clean up after each test
		await rm(expectedCacheFilePath, { force: true });
		await rm(cacheLocationFile, { force: true });
	});

	it('cacheLocation is a file', async (t) => {
		await standalone(getConfig({ cacheLocation: cacheLocationFile }));

		t.assert.deepStrictEqual(hashTypesByFile(cacheLocationFile), { [validFile]: 'string' });
	});

	it('cacheLocation is a directory', async (t) => {
		await standalone(getConfig({ cacheLocation: cacheLocationDir }));

		t.assert.deepStrictEqual(hashTypesByFile(expectedCacheFilePath), { [validFile]: 'string' });
	});
});

describe('standalone cache (enabled in config)', () => {
	const cwd = path.join(dirname, 'tmp', 'standalone-cache');

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
		await rm(expectedCacheFilePath, { force: true });
		await rm(newFileDest, { force: true });
	});

	it('uses cache by default (option is not provided)', async (t) => {
		// Add "changed" file
		await copyFile(validFile, newFileDest);

		// Next run should lint only changed files
		const { results } = await standalone(getConfigWithCache());

		// Ensure only changed files are linted
		t.assert.strictEqual(
			results.some((file) => isChanged(file, validFile)),
			false,
		);
		t.assert.strictEqual(
			results.some((file) => isChanged(file, newFileDest)),
			true,
		);

		t.assert.deepStrictEqual(hashTypesByFile(expectedCacheFilePath), {
			[validFile]: 'string',
			[newFileDest]: 'string',
		});
	});

	it('uses cache when option explicitly enables cache', async (t) => {
		// Add "changed" file
		await copyFile(validFile, newFileDest);

		// Next run should lint only changed files
		const { results } = await standalone(getConfigWithCache({ cache: true }));

		// Ensure only changed files are linted
		t.assert.strictEqual(
			results.some((file) => isChanged(file, validFile)),
			false,
		);
		t.assert.strictEqual(
			results.some((file) => isChanged(file, newFileDest)),
			true,
		);

		t.assert.deepStrictEqual(hashTypesByFile(expectedCacheFilePath), {
			[validFile]: 'string',
			[newFileDest]: 'string',
		});
	});

	it('does not use cache when option explicitly disables cache', async (t) => {
		// Add "changed" file
		await copyFile(validFile, newFileDest);

		// Next run should lint all files (regardless of changed)
		const { results } = await standalone(getConfigWithCache({ cache: false }));

		// Ensure all files are linted
		t.assert.strictEqual(
			results.some((file) => isChanged(file, validFile)),
			true,
		);
		t.assert.strictEqual(
			results.some((file) => isChanged(file, newFileDest)),
			true,
		);

		t.assert.strictEqual(existsSync(expectedCacheFilePath), false);
	});
});

describe('standalone cache uses a config file', () => {
	const cwd = path.join(dirname, 'tmp', 'standalone-cache-use-config-file');

	safeChdir(cwd);

	const configFile = path.join(cwd, '.stylelintrc.json');
	const lintedFile = path.join(cwd, 'a.css');
	const expectedCacheFilePath = path.join(cwd, '.stylelintcache');

	beforeEach(async () => {
		await writeFile(lintedFile, 'a {}');
	});

	afterEach(async () => {
		await rm(cwd, { recursive: true, force: true });
	});

	it('cache is discarded when a config file is changed', async (t) => {
		const config = { files: [lintedFile], config: undefined, cache: true };

		// No warnings when a rule is disabled.
		await writeFile(
			configFile,
			JSON.stringify({
				rules: { 'block-no-empty': null },
			}),
		);
		const { results } = await standalone(config);

		t.assert.strictEqual(results[0].warnings.length, 0);

		// Some warnings when a rule becomes enabled by changing the config.
		await writeFile(
			configFile,
			JSON.stringify({
				rules: { 'block-no-empty': true },
			}),
		);
		const { results: resultsNew } = await standalone(config);

		t.assert.strictEqual(resultsNew[0].warnings.length, 1);
	});

	it('enables cache in a config file', async (t) => {
		const options = { files: [lintedFile] };

		await writeFile(configFile, JSON.stringify({ cache: true, rules: {} }));
		await standalone(options);

		t.assert.strictEqual(existsSync(expectedCacheFilePath), true);
	});

	it('disables cache when the option precedes, regardless of a config file', async (t) => {
		const options = { files: [lintedFile], cache: false };

		await writeFile(configFile, JSON.stringify({ cache: true, rules: {} }));
		await standalone(options);

		t.assert.strictEqual(existsSync(expectedCacheFilePath), false);
	});

	it('disables cache when the config precedes, regardless of a config file', async (t) => {
		const config = { files: [lintedFile], config: { cache: false, rules: {} } };

		await writeFile(configFile, JSON.stringify({ cache: true, rules: {} }));
		await standalone(config);

		t.assert.strictEqual(existsSync(expectedCacheFilePath), false);
	});
});

describe('standalone cache uses cacheStrategy', () => {
	const cwd = path.join(dirname, 'tmp', 'standalone-cache-uses-cacheStrategy');

	safeChdir(cwd);

	const expectedCacheFilePath = path.join(cwd, '.stylelintcache');

	afterEach(async () => {
		// clean up after each test
		await rm(expectedCacheFilePath, { force: true });
		await rm(newFileDest, { force: true });
	});

	it('cacheStrategy is invalid', async (t) => {
		await t.assert.rejects(standalone(getConfig({ cacheStrategy: 'foo' })), {
			message: '"foo" cache strategy is unsupported. Specify either "metadata" or "content"',
		});
	});

	it('cacheStrategy is "metadata"', async (t) => {
		const cacheStrategy = 'metadata';

		await copyFile(validFile, newFileDest);
		const { results } = await standalone(getConfig({ cacheStrategy }));

		t.assert.strictEqual(
			results.some((file) => isChanged(file, newFileDest)),
			true,
		);

		// No content change, but file metadata id changed
		// Note: needs a time offset for fast test machines
		await utimes(newFileDest, Date.now() / 1000, Date.now() / 1000 + 1);

		const { results: resultsCached } = await standalone(getConfig({ cacheStrategy }));

		t.assert.strictEqual(
			resultsCached.some((file) => isChanged(file, newFileDest)),
			true,
		);
	});

	it('cacheStrategy is "content" and the file is modified', async (t) => {
		const cacheStrategy = 'content';

		await copyFile(validFile, newFileDest);

		const { results } = await standalone(getConfig({ cacheStrategy }));

		t.assert.strictEqual(
			results.some((file) => isChanged(file, newFileDest)),
			true,
		);

		await copyFile(syntaxErrorFile, newFileDest);

		const { results: resultsCached } = await standalone(getConfig({ cacheStrategy }));

		t.assert.strictEqual(
			resultsCached.some((file) => isChanged(file, newFileDest)),
			true,
		);
	});

	it('cacheStrategy is "content" and only the timestamps are different', async (t) => {
		const cacheStrategy = 'content';

		await copyFile(validFile, newFileDest);
		const { results } = await standalone(getConfig({ cacheStrategy }));

		t.assert.strictEqual(
			results.some((file) => isChanged(file, newFileDest)),
			true,
		);

		// No content change, but file metadata is changed
		await utimes(newFileDest, new Date(), new Date());
		const { results: resultsCached } = await standalone(getConfig({ cacheStrategy }));

		t.assert.strictEqual(
			resultsCached.some((file) => isChanged(file, newFileDest)),
			false,
		);
	});

	it('cacheStrategy is "content" and only the content is different', async (t) => {
		const cacheStrategy = 'content';

		const now = new Date();

		await copyFile(validFile, newFileDest);
		await utimes(newFileDest, now, now);

		const { results } = await standalone(getConfig({ cacheStrategy }));

		t.assert.strictEqual(
			results.some((file) => isChanged(file, newFileDest)),
			true,
		);

		// No file metadata change, but content is changed
		await copyFile(syntaxErrorFile, newFileDest);
		await utimes(newFileDest, now, now);

		const { results: resultsCached } = await standalone(getConfig({ cacheStrategy }));

		t.assert.strictEqual(
			resultsCached.some((file) => isChanged(file, newFileDest)),
			true,
		);
	});
});
