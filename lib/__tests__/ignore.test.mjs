import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import process from 'node:process';
import { test } from 'node:test';

import { AllFilesIgnoredError, NoFilesFoundError } from '../utils/errors.mjs';
import replaceBackslashes from '../testUtils/replaceBackslashes.mjs';
import safeChdir from '../testUtils/safeChdir.mjs';
import standalone from '../standalone.mjs';
import withMockedPlatform from '../testUtils/withMockedPlatform.mjs';

const dirname = import.meta.dirname;

const fixtures = (...elem) => {
	const dir = fileURLToPath(new URL('./fixtures', import.meta.url));

	return replaceBackslashes(path.join(dir, ...elem));
};

const isWindowsHost = process.platform === 'win32';
const win32OnlyTest = isWindowsHost ? test : test.skip;

safeChdir(dirname);

test('extending config and ignoreFiles glob ignoring single glob', async () => {
	const { results } = await standalone({
		files: [fixtures('empty-block.css'), fixtures('invalid-hex.css')],
		config: {
			ignoreFiles: '**/invalid-hex.css',
			extends: ['./config-block-no-empty.json', './config-color-no-invalid-hex.json'],
		},
		configBasedir: fixtures(),
	});

	// two files found
	assert.equal(results.length, 2);

	// empty-block.css found
	assert.ok(results[0].source.includes('empty-block.css'));

	// empty-block.css linted
	assert.equal(results[0].warnings.length, 1);

	// invalid-hex.css found
	assert.ok(results[1].source.includes('invalid-hex.css'));

	// invalid-hex.css not linted
	assert.equal(results[1].warnings.length, 0);

	// invalid-hex.css marked as ignored
	assert.ok(results[1].ignored);
});

test('same as above with no configBasedir, ignore-files path relative to process.cwd', async () => {
	const { results } = await standalone({
		files: [fixtures('empty-block.css'), fixtures('invalid-hex.css')],
		config: {
			ignoreFiles: 'fixtures/invalid-hex.css',
			extends: [
				fixtures('config-block-no-empty.json'),
				fixtures('config-color-no-invalid-hex.json'),
			],
		},
	});

	// two files found
	assert.equal(results.length, 2);

	// empty-block.css found
	assert.ok(results[0].source.includes('empty-block.css'));

	// empty-block.css linted
	assert.equal(results[0].warnings.length, 1);

	// invalid-hex.css found
	assert.ok(results[1].source.includes('invalid-hex.css'));

	// invalid-hex.css not linted
	assert.equal(results[1].warnings.length, 0);

	// invalid-hex.css marked as ignored
	assert.ok(results[1].ignored);
});

test('same as above with no configBasedir, ignore-files path relative to options.cwd', async () => {
	const { results } = await standalone({
		files: [fixtures('empty-block.css'), fixtures('invalid-hex.css')],
		config: {
			ignoreFiles: 'fixtures/invalid-hex.css',
			extends: [
				fixtures('config-block-no-empty.json'),
				fixtures('config-color-no-invalid-hex.json'),
			],
		},
		cwd: dirname,
	});

	// two files found
	assert.equal(results.length, 2);

	// empty-block.css found
	assert.ok(results[0].source.includes('empty-block.css'));

	// empty-block.css linted
	assert.equal(results[0].warnings.length, 1);

	// invalid-hex.css found
	assert.ok(results[1].source.includes('invalid-hex.css'));

	// invalid-hex.css not linted
	assert.equal(results[1].warnings.length, 0);

	// invalid-hex.css marked as ignored
	assert.ok(results[1].ignored);
});

test('absolute ignoreFiles glob path', async () => {
	const { results } = await standalone({
		files: [fixtures('empty-block.css'), fixtures('invalid-hex.css')],
		config: {
			ignoreFiles: [fixtures('empty-b*.css')],
			rules: {
				'block-no-empty': true,
			},
		},
		configBasedir: fixtures(),
	});

	// two files found
	assert.equal(results.length, 2);

	// first not linted
	assert.equal(results[0].warnings.length, 0);

	// first marked as ignored
	assert.ok(results[0].ignored);

	// second has no warnings
	assert.equal(results[1].warnings.length, 0);

	// second not marked as ignored
	assert.ok(!results[1].ignored);
});

test('extending config with ignoreFiles glob ignoring one by negation', async () => {
	const { results } = await standalone({
		files: [fixtures('empty-block.css'), fixtures('invalid-hex.css')],
		config: {
			ignoreFiles: ['**/*.css', '!**/invalid-hex.css'],
			extends: [
				fixtures('config-block-no-empty.json'),
				fixtures('config-color-no-invalid-hex.json'),
			],
		},
		configBasedir: fixtures(),
	});

	// two files found
	assert.equal(results.length, 2);

	// empty-block.css found
	assert.ok(results[0].source.includes('empty-block.css'));

	// empty-block.css has no warnings
	assert.equal(results[0].warnings.length, 0);

	// empty-block.css was ignored
	assert.ok(results[0].ignored);

	// invalid-hex.css found
	assert.ok(results[1].source.includes('invalid-hex.css'));

	// invalid-hex.css has warnings
	assert.equal(results[1].warnings.length, 1);

	// invalid-hex.css was not ignored
	assert.ok(!results[1].ignored);
});

test('specified `ignorePath` file ignoring one file', async () => {
	const files = [fixtures('empty-block.css')];

	await assert.rejects(
		standalone({
			files,
			config: {
				rules: {
					'block-no-empty': true,
				},
			},
			ignorePath: [fixtures('ignore.txt')],
		}),
		AllFilesIgnoredError,
	);
});

test('specified multiple `ignorePath` to ignore files', async () => {
	const files = [fixtures('empty-block.css'), fixtures('empty-block-with-disables.css')];

	await assert.rejects(
		standalone({
			files,
			config: {
				rules: {
					'block-no-empty': true,
				},
			},
			ignorePath: [fixtures('ignore.txt'), fixtures('ignore-2.txt')],
		}),
		AllFilesIgnoredError,
	);
});

test('specified `ignorePath` file ignoring one file using options.cwd', async () => {
	const files = [fixtures('empty-block.css')];

	await assert.rejects(
		standalone({
			files,
			config: {
				rules: {
					'block-no-empty': true,
				},
			},
			ignorePath: [fixtures('ignore.txt')],
			cwd: dirname,
		}),
		AllFilesIgnoredError,
	);
});

test('specified `ignorePath` directory, not a file', async () => {
	await assert.rejects(
		standalone({
			files: [],
			config: {},
			ignorePath: ['fixtures'],
			cwd: dirname,
		}),
		{ message: /EISDIR/ },
	);
});

test('specified `ignorePattern` file ignoring one file', async () => {
	const files = [fixtures('empty-block.css')];

	await assert.rejects(
		standalone({
			files,
			config: {
				rules: {
					'block-no-empty': true,
				},
			},
			ignorePattern: 'fixtures/empty-block.css',
		}),
		AllFilesIgnoredError,
	);
});

test('specified `ignorePattern` file ignoring one file using options.cwd', async () => {
	const files = [fixtures('empty-block.css')];

	await assert.rejects(
		standalone({
			files,
			config: {
				rules: {
					'block-no-empty': true,
				},
			},
			ignorePattern: 'fixtures/empty-block.css',
			cwd: dirname,
		}),
		AllFilesIgnoredError,
	);
});

test('specified `ignorePattern` file ignoring two files', async () => {
	const files = [fixtures('empty-block.css'), fixtures('no-syntax-error.css')];

	await assert.rejects(
		standalone({
			files,
			config: {
				rules: {
					'block-no-empty': true,
				},
			},
			ignorePattern: ['fixtures/empty-block.css', 'fixtures/no-syntax-error.css'],
		}),
		AllFilesIgnoredError,
	);
});

test('specified `ignorePattern` file ignoring two files using options.cwd', async () => {
	const files = [fixtures('empty-block.css'), fixtures('no-syntax-error.css')];

	await assert.rejects(
		standalone({
			files,
			config: {
				rules: {
					'block-no-empty': true,
				},
			},
			ignorePattern: ['fixtures/empty-block.css', 'fixtures/no-syntax-error.css'],
			cwd: dirname,
		}),
		AllFilesIgnoredError,
	);
});

test('using ignoreFiles with input files that would cause a postcss syntax error', async () => {
	const { results } = await standalone({
		files: [fixtures('standaloneNoParsing', '*')],
		config: {
			ignoreFiles: ['**/*.scss'],
			rules: {
				'block-no-empty': true,
			},
		},
	});

	// two files found
	assert.equal(results.length, 2);

	const one = results.find((result) => result.source.includes('no-syntax-error.css'));
	const two = results.find((result) => result.source.includes('syntax-error-ignored.scss'));

	// no-syntax-error.css found
	assert.ok(one.source.includes('no-syntax-error.css'));

	// no-syntax-error.css linted
	assert.equal(one.warnings.length, 0);

	// syntax-error-ignored.scss found
	assert.ok(two.source.includes('syntax-error-ignored.scss'));

	// syntax-error-ignored.scss not linted
	assert.equal(two.warnings.length, 0);

	// syntax-error-ignored.scss marked as ignored
	assert.ok(two.ignored);
});

test('extending a config that ignores files', async () => {
	const { results } = await standalone({
		files: [fixtures('empty-block.css'), fixtures('invalid-hex.css')],
		config: {
			extends: [fixtures('config-extending-and-ignoring.json')],
		},
		configBasedir: fixtures(),
	});

	// found correct files
	assert.equal(results.length, 2);

	// empty-block.css found
	assert.ok(results[0].source.includes('empty-block.css'));

	// empty-block.css not linted
	assert.equal(results[0].warnings.length, 0);

	// invalid-hex.css found
	assert.ok(results[1].source.includes('invalid-hex.css'));

	// invalid-hex.css not linted
	assert.equal(results[1].warnings.length, 0);
});

test('using codeFilename and ignoreFiles together', async () => {
	const { results } = await standalone({
		code: 'a {}',
		codeFilename: replaceBackslashes(path.join(dirname, 'foo.css')),
		config: {
			ignoreFiles: ['**/foo.css'],
			rules: { 'block-no-empty': true },
		},
	});

	// no warnings
	assert.equal(results[0].warnings.length, 0);

	// ignored
	assert.ok(results[0].ignored);
});

// Only run this test on Windows platforms, since current architecture would
// require significant mocking throughout to simulate Windows path behavior on
// non-Windows platforms.
win32OnlyTest(
	'using codeFilename and ignoreFiles together on Windows regardless of drive letter case',
	async () => {
		const driveUpper = 'C:\\path\\to\\foo.css';
		const driveLower = 'c:\\path\\to\\foo.css';

		const { results } = await standalone({
			code: 'a {}',
			codeFilename: driveLower,
			config: {
				ignoreFiles: [driveUpper],
				rules: { 'block-no-empty': true },
			},
		});

		// Ignored when drive letter casing differs.
		assert.equal(results[0].warnings.length, 0);
		assert.ok(results[0].ignored);
	},
);

test('codeFilename and ignoreFiles remain case-sensitive on non-Windows platforms', async () => {
	// Drive letters do not exist on non-Windows platforms, but nonetheless
	// we want to ensure that the drive-letter casing logic is not applied.
	const driveUpper = 'C:\\path\\to\\foo.css';
	const driveLower = 'c:\\path\\to\\foo.css';

	const { results } = await withMockedPlatform('linux', () =>
		standalone({
			code: 'a {}',
			codeFilename: driveLower,
			config: {
				ignoreFiles: [driveUpper],
				rules: { 'block-no-empty': true },
			},
		}),
	);

	// Not ignored when drive letter casing differs.
	assert.equal(results[0].warnings.length, 1);
	assert.ok(!results[0].ignored);
});

test('using codeFilename and ignoreFiles with configBasedir', async () => {
	const { results } = await standalone({
		code: 'a {}',
		codeFilename: replaceBackslashes(path.join(dirname, 'foo.css')),
		config: {
			ignoreFiles: ['foo.css'],
			rules: { 'block-no-empty': true },
		},
		configBasedir: dirname,
	});

	// no warnings
	assert.equal(results[0].warnings.length, 0);

	// ignored
	assert.ok(results[0].ignored);
});

test('file in node_modules is ignored', async () => {
	const files = [fixtures('node_modules', 'test.css')];
	const noFilesErrorMessage = new NoFilesFoundError(files);

	await assert.rejects(
		standalone({
			files,
			config: {
				rules: {
					'block-no-empty': true,
				},
			},
		}),
		{ message: noFilesErrorMessage.message },
	);
});

test('disableDefaultIgnores allows paths in node_modules', async () => {
	const { results } = await standalone({
		files: [fixtures('node_modules', 'test.css')],
		disableDefaultIgnores: true,
		config: {
			rules: {
				'block-no-empty': true,
			},
		},
	});

	// They are not ignored
	assert.equal(results.length, 1);
	assert.equal(results[0].warnings.length, 1);
});

test('file in node_modules is ignored when using codeFilename', async () => {
	const { results } = await standalone({
		code: 'a {}',
		codeFilename: fixtures('node_modules', 'test.css'),
		config: {
			rules: {
				'block-no-empty': true,
			},
		},
	});

	assert.equal(results.length, 0);
});

test('disableDefaultIgnores allows codeFilename in node_modules', async () => {
	const { results } = await standalone({
		code: 'a {}',
		codeFilename: fixtures('node_modules', 'test.css'),
		disableDefaultIgnores: true,
		config: {
			rules: {
				'block-no-empty': true,
			},
		},
	});

	assert.equal(results.length, 1);
	assert.equal(results[0].warnings.length, 1);
});

test('ignores file in node_modules under a dot directory', async () => {
	const { results } = await standalone({
		code: 'a {}',
		codeFilename: fixtures('.hidden', 'node_modules', 'test.css'),
		config: {
			rules: {
				'block-no-empty': true,
			},
		},
	});

	assert.equal(results.length, 0);
});
