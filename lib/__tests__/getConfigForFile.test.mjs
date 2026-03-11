import path from 'node:path';

import createStylelint from '../createStylelint.mjs';
import getConfigForFile from '../getConfigForFile.mjs';
import pluginWarnAboutFoo from './fixtures/plugin-warn-about-foo.mjs';
import withMockedPlatform from '../testUtils/withMockedPlatform.mjs';

const dirname = import.meta.dirname;

test('augmented config loads', async () => {
	const stylelint = createStylelint();
	const filepath = path.join(dirname, 'fixtures/getConfigForFile/a/b/foo.css');

	await expect(getConfigForFile({ stylelint, searchPath: filepath })).resolves.toEqual({
		config: {
			plugins: [path.join(dirname, '/fixtures/plugin-warn-about-foo.mjs')],
			rules: {
				'block-no-empty': [true],
				'plugin/warn-about-foo': ['always'],
			},
			pluginFunctions: {
				'plugin/warn-about-foo': pluginWarnAboutFoo.rule,
			},
		},
		filepath: path.join(dirname, 'fixtures/getConfigForFile/a/.stylelintrc'),
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

describe('augmented config cache', () => {
	test('caches augmented config for same config file and target file', async () => {
		const stylelint = createStylelint();
		const filepath = path.join(dirname, 'fixtures/getConfigForFile/a/b/foo.css');

		const first = await getConfigForFile({ stylelint, searchPath: filepath, filePath: filepath });
		const second = await getConfigForFile({ stylelint, searchPath: filepath, filePath: filepath });

		// Should return the exact same cached object.
		expect(second).toBe(first);
		expect(stylelint._augmentedConfigCache.size).toBe(1);
	});

	test('creates separate cache entries for different target files', async () => {
		const stylelint = createStylelint();
		const filepath1 = path.join(dirname, 'fixtures/getConfigForFile/a/b/foo.css');
		const filepath2 = path.join(dirname, 'fixtures/getConfigForFile/a/b/bar.css');

		const first = await getConfigForFile({
			stylelint,
			searchPath: filepath1,
			filePath: filepath1,
		});
		const second = await getConfigForFile({
			stylelint,
			searchPath: filepath2,
			filePath: filepath2,
		});

		// Different target files should have separate cache entries.
		expect(second).not.toBe(first);
		expect(stylelint._augmentedConfigCache.size).toBe(2);
	});

	test('augmented config cache normalizes paths on Windows', async () => {
		const stylelint = createStylelint();
		const driveUpper = 'C:\\project\\foo.css';
		const driveLower = 'c:\\project\\foo.css';

		await withMockedPlatform('win32', async () => {
			const filepath = path.join(dirname, 'fixtures/getConfigForFile/a/b/foo.css');

			const first = await getConfigForFile({
				stylelint,
				searchPath: filepath,
				filePath: driveUpper,
			});

			const second = await getConfigForFile({
				stylelint,
				searchPath: filepath,
				filePath: driveLower,
			});

			expect(second).toBe(first);
			expect(stylelint._augmentedConfigCache.size).toBe(1);
		});
	});

	test('does not cache null results', async () => {
		const stylelint = createStylelint();

		const result = await getConfigForFile({
			stylelint,
			searchPath: '/nonexistent/path',
			failIfNoConfig: false,
		});

		expect(result).toBeNull();
		expect(stylelint._augmentedConfigCache.size).toBe(0);
	});

	test('cache key handles empty filePath', async () => {
		const stylelint = createStylelint();
		const searchPath = path.join(dirname, 'fixtures/getConfigForFile/a/b/foo.css');

		const first = await getConfigForFile({ stylelint, searchPath });
		const second = await getConfigForFile({ stylelint, searchPath });

		expect(second).toBe(first);
		expect(stylelint._augmentedConfigCache.size).toBe(1);
	});
});
