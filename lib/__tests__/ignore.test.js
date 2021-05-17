'use strict';

const path = require('path');

const NoFilesFoundError = require('../utils/noFilesFoundError');
const replaceBackslashes = require('../testUtils/replaceBackslashes');
const standalone = require('../standalone');

const fixtures = (...elem) => replaceBackslashes(path.join(__dirname, 'fixtures', ...elem));

test('extending config and ignoreFiles glob ignoring single glob', async () => {
	const { results } = await standalone({
		files: [fixtures('empty-block.css'), fixtures('invalid-hex.css')],
		config: {
			ignoreFiles: '**/invalid-hex.css',
			extends: ['./config-block-no-empty', './config-color-no-invalid-hex'],
		},
		configBasedir: fixtures(),
	});

	// two files found
	expect(results).toHaveLength(2);

	// empty-block.css found
	expect(results[0].source).toContain('empty-block.css');

	// empty-block.css linted
	expect(results[0].warnings).toHaveLength(1);

	// invalid-hex.css found
	expect(results[1].source).toContain('invalid-hex.css');

	// invalid-hex.css not linted
	expect(results[1].warnings).toHaveLength(0);

	// invalid-hex.css marked as ignored
	expect(results[1].ignored).toBeTruthy();
});

test('same as above with no configBasedir, ignore-files path relative to process.cwd', async () => {
	const actualCwd = process.cwd();

	process.chdir(__dirname);

	const { results } = await standalone({
		files: [fixtures('empty-block.css'), fixtures('invalid-hex.css')],
		config: {
			ignoreFiles: 'fixtures/invalid-hex.css',
			extends: [fixtures('config-block-no-empty.json'), fixtures('config-color-no-invalid-hex')],
		},
	});

	// two files found
	expect(results).toHaveLength(2);

	// empty-block.css found
	expect(results[0].source).toContain('empty-block.css');

	// empty-block.css linted
	expect(results[0].warnings).toHaveLength(1);

	// invalid-hex.css found
	expect(results[1].source).toContain('invalid-hex.css');

	// invalid-hex.css not linted
	expect(results[1].warnings).toHaveLength(0);

	// invalid-hex.css marked as ignored
	expect(results[1].ignored).toBeTruthy();

	process.chdir(actualCwd);
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
	expect(results).toHaveLength(2);

	// first not linted
	expect(results[0].warnings).toHaveLength(0);

	// first marked as ignored
	expect(results[0].ignored).toBeTruthy();

	// second has no warnings
	expect(results[1].warnings).toHaveLength(0);

	// second not marked as ignored
	expect(results[1].ignored).toBeFalsy();
});

test('extending config with ignoreFiles glob ignoring one by negation', async () => {
	const { results } = await standalone({
		files: [fixtures('empty-block.css'), fixtures('invalid-hex.css')],
		config: {
			ignoreFiles: ['**/*.css', '!**/invalid-hex.css'],
			extends: [fixtures('config-block-no-empty'), fixtures('config-color-no-invalid-hex')],
		},
		configBasedir: fixtures(),
	});

	// two files found
	expect(results).toHaveLength(2);

	// empty-block.css found
	expect(results[0].source).toContain('empty-block.css');

	// empty-block.css has no warnings
	expect(results[0].warnings).toHaveLength(0);

	// empty-block.css was ignored
	expect(results[0].ignored).toBeTruthy();

	// invalid-hex.css found
	expect(results[1].source).toContain('invalid-hex.css');

	// invalid-hex.css has warnings
	expect(results[1].warnings).toHaveLength(1);

	// invalid-hex.css was not ignored
	expect(results[1].ignored).toBeFalsy();
});

test('specified `ignorePath` file ignoring one file', async () => {
	const files = [fixtures('empty-block.css')];
	const noFilesErrorMessage = new NoFilesFoundError(files);
	const actualCwd = process.cwd();

	process.chdir(__dirname);

	await expect(
		standalone({
			files,
			config: {
				rules: {
					'block-no-empty': true,
				},
			},
			ignorePath: fixtures('ignore.txt'),
		}),
	).rejects.toThrow(noFilesErrorMessage); // no files read

	process.chdir(actualCwd);
});

test('specified `ignorePattern` file ignoring one file', async () => {
	const files = [fixtures('empty-block.css')];
	const noFilesErrorMessage = new NoFilesFoundError(files);
	const actualCwd = process.cwd();

	process.chdir(__dirname);

	await expect(
		standalone({
			files,
			config: {
				rules: {
					'block-no-empty': true,
				},
			},
			ignorePattern: 'fixtures/empty-block.css',
		}),
	).rejects.toThrow(noFilesErrorMessage); // no files read

	process.chdir(actualCwd);
});

test('specified `ignorePattern` file ignoring two files', async () => {
	const files = [fixtures('empty-block.css'), fixtures('no-syntax-error.css')];
	const noFilesErrorMessage = new NoFilesFoundError(files);
	const actualCwd = process.cwd();

	process.chdir(__dirname);

	await expect(
		standalone({
			files,
			config: {
				rules: {
					'block-no-empty': true,
				},
			},
			ignorePattern: ['fixtures/empty-block.css', 'fixtures/no-syntax-error.css'],
		}),
	).rejects.toThrow(noFilesErrorMessage); // no files read

	process.chdir(actualCwd);
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
	expect(results).toHaveLength(2);

	const one = results.find((result) => result.source.includes('no-syntax-error.css'));
	const two = results.find((result) => result.source.includes('syntax-error-ignored.scss'));

	// no-syntax-error.css found
	expect(one.source).toContain('no-syntax-error.css');

	// no-syntax-error.css linted
	expect(one.warnings).toHaveLength(0);

	// syntax-error-ignored.scss found
	expect(two.source).toContain('syntax-error-ignored.scss');

	// syntax-error-ignored.scss not linted
	expect(two.warnings).toHaveLength(0);

	// syntax-error-ignored.scss marked as ignored
	expect(two.ignored).toBeTruthy();
});

test('extending a config that ignores files', async () => {
	const { results } = await standalone({
		files: [fixtures('empty-block.css'), fixtures('invalid-hex.css')],
		config: {
			extends: [fixtures('config-extending-and-ignoring')],
		},
		configBasedir: fixtures(),
	});

	// found correct files
	expect(results).toHaveLength(2);

	// empty-block.css found
	expect(results[0].source).toContain('empty-block.css');

	// empty-block.css linted
	expect(results[0].warnings).toHaveLength(1);

	// invalid-hex.css found
	expect(results[1].source).toContain('invalid-hex.css');

	// invalid-hex.css not linted
	expect(results[1].warnings).toHaveLength(0);
});

test('using codeFilename and ignoreFiles together', async () => {
	const { results } = await standalone({
		code: 'a {}',
		codeFilename: replaceBackslashes(path.join(__dirname, 'foo.css')),
		config: {
			ignoreFiles: ['**/foo.css'],
			rules: { 'block-no-empty': true },
		},
	});

	// no warnings
	expect(results[0].warnings).toHaveLength(0);

	// ignored
	expect(results[0].ignored).toBeTruthy();
});

test('using codeFilename and ignoreFiles with configBasedir', async () => {
	const { results } = await standalone({
		code: 'a {}',
		codeFilename: replaceBackslashes(path.join(__dirname, 'foo.css')),
		config: {
			ignoreFiles: ['foo.css'],
			rules: { 'block-no-empty': true },
		},
		configBasedir: __dirname,
	});

	// no warnings
	expect(results[0].warnings).toHaveLength(0);

	// ignored
	expect(results[0].ignored).toBeTruthy();
});

test('file in node_modules is ignored', async () => {
	const files = [fixtures('node_modules', 'test.css')];
	const noFilesErrorMessage = new NoFilesFoundError(files);

	await expect(
		standalone({
			files,
			config: {
				rules: {
					'block-no-empty': true,
				},
			},
		}),
	).rejects.toThrow(noFilesErrorMessage);
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
	expect(results).toHaveLength(1);
	expect(results[0].warnings).toHaveLength(1);
});
