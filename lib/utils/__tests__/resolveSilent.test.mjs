import { it } from 'node:test';
import path from 'node:path';

import { fileURLToPath } from 'node:url';

import resolveSilent from '../resolveSilent.mjs';

const fixturesPath = fileURLToPath(new URL('./fixtures', import.meta.url));

it('should resolve ESM over commonjs for dual package', (t) => {
	t.assert.strictEqual(
		resolveSilent(fixturesPath, '@stylelint/dual-package'),
		path.resolve(fixturesPath, 'node_modules/@stylelint/dual-package/index.mjs'),
	);
});

it('should return undefined for filename-less paths', (t) => {
	t.assert.strictEqual(resolveSilent(fixturesPath, '.'), undefined);
	t.assert.strictEqual(resolveSilent(fixturesPath, './'), undefined);
	t.assert.strictEqual(resolveSilent(fixturesPath, fixturesPath), undefined);
});

it('should return undefined for extension-less paths', (t) => {
	t.assert.strictEqual(resolveSilent(fixturesPath, './index'), undefined);
	t.assert.strictEqual(resolveSilent(fixturesPath, '@stylelint/loader-a/index'), undefined);
	t.assert.strictEqual(resolveSilent(fixturesPath, path.resolve(fixturesPath, 'index')), undefined);
});

it('should return undefined for non-existent packages', (t) => {
	t.assert.strictEqual(resolveSilent(fixturesPath, 'non-existent-package'), undefined);
});

it('should return undefined for non-existent relative paths', (t) => {
	t.assert.strictEqual(resolveSilent(fixturesPath, './non-existent.js'), undefined);
	t.assert.strictEqual(resolveSilent(fixturesPath, '../non-existent.js'), undefined);
});

it('should resolve absolute paths', (t) => {
	const absolutePath = path.resolve(fixturesPath, 'index.js');

	t.assert.strictEqual(resolveSilent(fixturesPath, absolutePath), absolutePath);
});

it('should return undefined for non-existent absolute paths', (t) => {
	const absolutePath = path.resolve(fixturesPath, 'non-existent.js');

	t.assert.strictEqual(resolveSilent(fixturesPath, absolutePath), undefined);
});
