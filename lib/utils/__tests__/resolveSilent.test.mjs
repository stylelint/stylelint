import path from 'node:path';

import { fileURLToPath } from 'node:url';

import resolveSilent from '../resolveSilent.mjs';

const fixturesPath = fileURLToPath(new URL('./fixtures', import.meta.url));

it('should resolve ESM over commonjs for dual package', () => {
	expect(resolveSilent(fixturesPath, '@stylelint/dual-package')).toBe(
		path.resolve(fixturesPath, 'node_modules/@stylelint/dual-package/index.mjs'),
	);
	expect(resolveSilent(fixturesPath, '.')).toBe(path.resolve(fixturesPath, 'index.js'));
});

it('should return undefined for non-existent packages', () => {
	expect(resolveSilent(fixturesPath, 'non-existent-package')).toBeUndefined();
});

it('should return undefined for non-existent relative paths', () => {
	expect(resolveSilent(fixturesPath, './non-existent.js')).toBeUndefined();
	expect(resolveSilent(fixturesPath, '../non-existent.js')).toBeUndefined();
});

it('should resolve absolute paths', () => {
	const absolutePath = path.resolve(fixturesPath, 'index.js');

	expect(resolveSilent(fixturesPath, absolutePath)).toBe(absolutePath);
});

it('should return undefined for non-existent absolute paths', () => {
	const absolutePath = path.resolve(fixturesPath, 'non-existent.js');

	expect(resolveSilent(fixturesPath, absolutePath)).toBeUndefined();
});
