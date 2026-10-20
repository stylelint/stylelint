import assert from 'node:assert/strict';
import { it } from 'node:test';
import path from 'node:path';

import { fileURLToPath } from 'node:url';

import resolveSilent from '../resolveSilent.mjs';

const fixturesPath = fileURLToPath(new URL('./fixtures', import.meta.url));

it('should resolve ESM over commonjs for dual package', () => {
	assert.equal(
		resolveSilent(fixturesPath, '@stylelint/dual-package'),
		path.resolve(fixturesPath, 'node_modules/@stylelint/dual-package/index.mjs'),
	);
});

it('should return undefined for filename-less paths', () => {
	assert.equal(resolveSilent(fixturesPath, '.'), undefined);
	assert.equal(resolveSilent(fixturesPath, './'), undefined);
	assert.equal(resolveSilent(fixturesPath, fixturesPath), undefined);
});

it('should return undefined for extension-less paths', () => {
	assert.equal(resolveSilent(fixturesPath, './index'), undefined);
	assert.equal(resolveSilent(fixturesPath, '@stylelint/loader-a/index'), undefined);
	assert.equal(resolveSilent(fixturesPath, path.resolve(fixturesPath, 'index')), undefined);
});

it('should return undefined for non-existent packages', () => {
	assert.equal(resolveSilent(fixturesPath, 'non-existent-package'), undefined);
});

it('should return undefined for non-existent relative paths', () => {
	assert.equal(resolveSilent(fixturesPath, './non-existent.js'), undefined);
	assert.equal(resolveSilent(fixturesPath, '../non-existent.js'), undefined);
});

it('should resolve absolute paths', () => {
	const absolutePath = path.resolve(fixturesPath, 'index.js');

	assert.equal(resolveSilent(fixturesPath, absolutePath), absolutePath);
});

it('should return undefined for non-existent absolute paths', () => {
	const absolutePath = path.resolve(fixturesPath, 'non-existent.js');

	assert.equal(resolveSilent(fixturesPath, absolutePath), undefined);
});
