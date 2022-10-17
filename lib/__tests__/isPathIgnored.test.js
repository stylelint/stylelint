'use strict';

const createStylelint = require('../createStylelint');
const isPathIgnored = require('../isPathIgnored');

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
