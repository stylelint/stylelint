import path from 'node:path';
import process from 'node:process';

import createStylelint from '../createStylelint.mjs';
import isPathIgnored from '../isPathIgnored.mjs';

test('isPathIgnored()', async () => {
	const config = {
		ignoreFiles: ['**/*.css', '!**/invalid-hex.css'],
		rules: { 'block-no-empty': true },
	};
	const stylelint = createStylelint({ config });

	await expect(
		Promise.all([
			isPathIgnored(stylelint, 'a.css'),
			isPathIgnored(stylelint, 'foo/bar/baz.css'),
			isPathIgnored(stylelint, 'foo/bar/baz.scss'),
			isPathIgnored(stylelint, 'foo/invalid-hex.css'),
		]),
	).resolves.toEqual([true, true, false, false]);
});

const isWindowsHost = process.platform === 'win32';
const win32OnlyTest = isWindowsHost ? test : test.skip;

win32OnlyTest('normalizes string ignoreFiles on Windows', async () => {
	const cwd = process.cwd();
	const uppercasePath = path.win32
		.join(cwd, 'foo.css')
		.replace(/^([a-z]):/i, (drive) => drive.toUpperCase());
	const lowercasePath = uppercasePath.replace(/^([A-Z]):/, (drive) => drive.toLowerCase());

	const stylelint = createStylelint({
		config: {
			ignoreFiles: uppercasePath,
			rules: { 'block-no-empty': true },
		},
	});

	const ignored = await isPathIgnored(stylelint, lowercasePath);

	expect(ignored).toBe(true);
});
