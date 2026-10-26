import { describe, test } from 'node:test';

import createStylelint from '../createStylelint.mjs';
import getPostcssResult from '../getPostcssResult.mjs';
import withMockedPlatform from '../testUtils/withMockedPlatform.mjs';

describe('getPostcssResult cache normalization', () => {
	test('postcss result cache reuses entry across drive-letter casing on Windows', async (t) => {
		const stylelint = createStylelint();
		const driveUpper = 'D:\\path\\to\\file.css';
		const driveLower = 'd:\\path\\to\\file.css';

		const first = await withMockedPlatform('win32', () =>
			getPostcssResult(stylelint, { code: 'a {}', filePath: driveUpper }),
		);

		const second = await withMockedPlatform('win32', () =>
			getPostcssResult(stylelint, { code: 'a {}', filePath: driveLower }),
		);

		t.assert.strictEqual(second, first);
		t.assert.strictEqual(stylelint._postcssResultCache.size, 1);
	});

	test('postcss result cache remains case-sensitive on non-Windows platforms', async (t) => {
		// Drive letters do not exist on non-Windows platforms, but nonetheless
		// we want to ensure that the drive-letter casing logic is not applied.
		const stylelint = createStylelint();
		const driveUpper = 'E:\\path\\to\\file.css';
		const driveLower = 'e:\\path\\to\\file.css';

		const first = await withMockedPlatform('linux', () =>
			getPostcssResult(stylelint, { code: 'a {}', filePath: driveUpper }),
		);

		const second = await withMockedPlatform('linux', () =>
			getPostcssResult(stylelint, { code: 'a {}', filePath: driveLower }),
		);

		t.assert.notStrictEqual(second, first);
		t.assert.strictEqual(stylelint._postcssResultCache.size, 2);
	});
});
