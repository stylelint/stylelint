import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';
import { tmpdir } from 'node:os';

const require = createRequire(import.meta.url);
const fileCacheUrl = new URL('../FileCache.mjs', import.meta.url).href;
const fileEntryCachePath = require.resolve('file-entry-cache');

function runInCleanNodeProcess(script) {
	execFileSync(process.execPath, ['--input-type=module'], {
		input: script,
		stdio: ['pipe', 'pipe', 'pipe'],
	});
}

describe('FileCache', () => {
	let tmpDir;

	beforeEach(() => {
		tmpDir = mkdtempSync(path.join(tmpdir(), 'stylelint-file-cache-'));
	});

	afterEach(() => {
		rmSync(tmpDir, { recursive: true, force: true });
	});

	it('loads file-entry-cache only when the cache is used', () => {
		const cacheFile = path.join(tmpDir, '.stylelintcache');
		const sourceFile = path.join(tmpDir, 'a.css');

		writeFileSync(sourceFile, 'a {}');

		expect(() =>
			runInCleanNodeProcess(`
			import assert from 'node:assert/strict';
			import { createRequire } from 'node:module';

			const require = createRequire(${JSON.stringify(import.meta.url)});
			const fileEntryCachePath = ${JSON.stringify(fileEntryCachePath)};
			const { default: FileCache } = await import(${JSON.stringify(fileCacheUrl)});
			const cache = new FileCache(${JSON.stringify(cacheFile)});

			assert.equal(require.cache[fileEntryCachePath], undefined);

			cache.calcHashOfConfig({ rules: {} });

			assert.equal(require.cache[fileEntryCachePath], undefined);

			cache.hasFileChanged(${JSON.stringify(sourceFile)});

			assert.notEqual(require.cache[fileEntryCachePath], undefined);

			cache.destroy();
		`),
		).not.toThrow();
	});

	it('can destroy an unused cache file without loading file-entry-cache', () => {
		const cacheFile = path.join(tmpDir, '.stylelintcache');

		writeFileSync(cacheFile, '{}');

		expect(() =>
			runInCleanNodeProcess(`
			import assert from 'node:assert/strict';
			import { createRequire } from 'node:module';
			import { existsSync } from 'node:fs';

			const require = createRequire(${JSON.stringify(import.meta.url)});
			const fileEntryCachePath = ${JSON.stringify(fileEntryCachePath)};
			const { default: FileCache } = await import(${JSON.stringify(fileCacheUrl)});
			const cache = new FileCache(${JSON.stringify(cacheFile)});

			cache.destroy();

			assert.equal(existsSync(${JSON.stringify(cacheFile)}), false);
			assert.equal(require.cache[fileEntryCachePath], undefined);
		`),
		).not.toThrow();
	});
});
