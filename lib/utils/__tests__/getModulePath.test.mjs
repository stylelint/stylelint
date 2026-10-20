import { afterEach, beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { fileURLToPath } from 'node:url';

import getModulePath, { clearModulePathCache } from '../getModulePath.mjs';

const fixturesPath = fileURLToPath(new URL('./fixtures', import.meta.url));

let tempDir = '';

beforeEach(() => {
	clearModulePathCache();
	tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'stylelint-getModulePath-'));
	fs.writeFileSync(path.join(tempDir, 'foo.mjs'), 'export default {};\n');
});

afterEach(() => {
	fs.rmSync(tempDir, { recursive: true, force: true });
});

describe('getModulePath', () => {
	it('resolves a module from the provided directory', () => {
		assert.equal(
			getModulePath(fixturesPath, '@stylelint/dual-package'),
			path.resolve(fixturesPath, 'node_modules/@stylelint/dual-package/index.mjs'),
		);
	});

	it('throws when the module cannot be resolved', () => {
		assert.throws(() => getModulePath(tempDir, 'non-existent-package'), {
			message: /Could not find "non-existent-package"/,
		});
	});

	it('returns the cached path without re-checking the filesystem', () => {
		const modulePath = getModulePath(tempDir, './foo.mjs');

		fs.rmSync(modulePath);

		assert.equal(getModulePath(tempDir, './foo.mjs'), modulePath);
	});

	it('re-resolves after the cache is cleared', () => {
		const modulePath = getModulePath(tempDir, './foo.mjs');

		fs.rmSync(modulePath);
		clearModulePathCache();

		assert.throws(() => getModulePath(tempDir, './foo.mjs'), {
			message: /Could not find "\.\/foo\.mjs"/,
		});
	});
});
