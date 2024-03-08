import path from 'path';

import { fileURLToPath } from 'url';

import resolveSilent from '../utils/resolveSilent.mjs';

const fixturesPath = path.resolve(fileURLToPath(import.meta.url), '../fixtures');

it('should resolve ESM over commonjs for dual package', () => {
	expect(resolveSilent(fixturesPath, '@stylelint/dual-package')).toBe(
		path.resolve(fixturesPath, 'node_modules/@stylelint/dual-package/index.mjs'),
	);
});
