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
		expect(getModulePath(fixturesPath, '@stylelint/dual-package')).toBe(
			path.resolve(fixturesPath, 'node_modules/@stylelint/dual-package/index.mjs'),
		);
	});

	it('throws when the module cannot be resolved', () => {
		expect(() => getModulePath(tempDir, 'non-existent-package')).toThrow(
			/Could not find "non-existent-package"/,
		);
	});

	it('returns the cached path without re-checking the filesystem', () => {
		const modulePath = getModulePath(tempDir, './foo.mjs');

		fs.rmSync(modulePath);

		expect(getModulePath(tempDir, './foo.mjs')).toBe(modulePath);
	});

	it('re-resolves after the cache is cleared', () => {
		const modulePath = getModulePath(tempDir, './foo.mjs');

		fs.rmSync(modulePath);
		clearModulePathCache();

		expect(() => getModulePath(tempDir, './foo.mjs')).toThrow(/Could not find "\.\/foo\.mjs"/);
	});
});
