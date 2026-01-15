import { fileURLToPath } from 'node:url';
import path from 'node:path';

import createStylelint from '../createStylelint.mjs';
import getConfigForFile from '../getConfigForFile.mjs';
import pluginWarnAboutFoo from './fixtures/plugin-warn-about-foo.mjs';
import withMockedPlatform from '../testUtils/withMockedPlatform.mjs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

test('augmented config loads', async () => {
	const stylelint = createStylelint();
	const filepath = path.join(__dirname, 'fixtures/getConfigForFile/a/b/foo.css');

	await expect(getConfigForFile({ stylelint, searchPath: filepath })).resolves.toEqual({
		config: {
			plugins: [path.join(__dirname, '/fixtures/plugin-warn-about-foo.mjs')],
			rules: {
				'block-no-empty': [true],
				'plugin/warn-about-foo': ['always'],
			},
			pluginFunctions: {
				'plugin/warn-about-foo': pluginWarnAboutFoo.rule,
			},
		},
		filepath: path.join(__dirname, 'fixtures/getConfigForFile/a/.stylelintrc'),
	});
});

describe('path normalization for caches', () => {
	test('specified config cache reuses entry across drive-letter casing on Windows', async () => {
		const stylelint = createStylelint({ config: { rules: {} } });
		const driveUpper = 'C:\\foo.css';
		const driveLower = 'c:\\foo.css';

		const first = await withMockedPlatform('win32', () =>
			getConfigForFile({ stylelint, searchPath: driveUpper, filePath: driveUpper }),
		);

		const second = await withMockedPlatform('win32', () =>
			getConfigForFile({ stylelint, searchPath: driveLower, filePath: driveLower }),
		);

		expect(second).toBe(first);
		expect(stylelint._specifiedConfigCache.get(stylelint._options.config)?.size).toBe(1);
	});

	test('specified config cache remains case-sensitive on non-Windows platforms', async () => {
		// Drive letters do not exist on non-Windows platforms, but nonetheless
		// we want to ensure that the drive-letter casing logic is not applied.
		const stylelint = createStylelint({ config: { rules: {} } });
		const driveUpper = 'C:\\foo.css';
		const driveLower = 'c:\\foo.css';

		const first = await withMockedPlatform('linux', () =>
			getConfigForFile({ stylelint, searchPath: driveUpper, filePath: driveUpper }),
		);

		const second = await withMockedPlatform('linux', () =>
			getConfigForFile({ stylelint, searchPath: driveLower, filePath: driveLower }),
		);

		expect(second).not.toBe(first);
		expect(stylelint._specifiedConfigCache.get(stylelint._options.config)?.size).toBe(2);
	});
});
