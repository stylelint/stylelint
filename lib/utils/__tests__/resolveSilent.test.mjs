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
