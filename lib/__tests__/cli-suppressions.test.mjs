import * as fs from 'node:fs/promises';
import { afterEach, beforeEach, describe, it, mock } from 'node:test';
import { Readable } from 'node:stream';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import process from 'node:process';

import {
	EXIT_CODE_FATAL_ERROR,
	EXIT_CODE_INVALID_USAGE,
	EXIT_CODE_LINT_PROBLEM,
} from '../constants.mjs';
import assertWritten from '../testUtils/assertWritten.mjs';
import getRelativePath from '../utils/getRelativePath.mjs';
import mockStandardStreams from '../testUtils/mockStandardStreams.mjs';
import replaceBackslashes from '../testUtils/replaceBackslashes.mjs';

import cli from '../cli.mjs';

const fixturesPath = (...elems) =>
	replaceBackslashes(path.join(fileURLToPath(new URL('./fixtures', import.meta.url)), ...elems));

describe('Suppressions', () => {
	beforeEach(() => {
		mockStandardStreams();
	});

	afterEach(() => {
		mock.restoreAll();
		process.exitCode = undefined;
	});

	const cssTmpDir = fixturesPath('tmp', 'cli-suppressions');

	beforeEach(async () => {
		await fs.mkdir(cssTmpDir, { recursive: true });
	});

	afterEach(async () => {
		await fs.rm(cssTmpDir, { recursive: true });
	});

	const SUPPRESSIONS_PATH = path.join(cssTmpDir, 'stylelint-suppressions.json');
	const EXISTING_SUPPRESSIONS_PATH = fixturesPath('suppressions/existing-suppressions.json');

	const CONFIG_BLOCK_ONLY = fixturesPath('config-block-no-empty.json');
	const CONFIG_LENGTH_ONLY = fixturesPath('suppressions/config-length-zero-no-unit.json');
	const CONFIG_BLOCK_AND_COLOR = fixturesPath(
		'suppressions/config-block-no-empty_and_color-invalid.json',
	);
	const CONFIG_BLOCK_COLOR_LENGTH = fixturesPath('suppressions/config-block-color-length.json');

	const EMPTY_BLOCK_CSS = fixturesPath('suppressions/empty-block.css');
	const INVALID_HEX_CSS = fixturesPath('invalid-hex.css');
	const LENGTH_ZERO_NO_UNIT_CSS = fixturesPath('suppressions/length-zero-no-unit.css');
	const BLOCK_COLOR_LENGTH_CSS = fixturesPath('suppressions/block-color-length.css');

	describe('arguments combinations', () => {
		it('displays an error when the --suppress and --suppress=<rule> flags are used together', async (t) => {
			await cli(['--suppress', '--suppress=block-no-empty']);

			t.assert.strictEqual(process.exitCode, EXIT_CODE_INVALID_USAGE);

			t.assert.strictEqual(process.stdout.write.mock.callCount(), 0);
			assertWritten(
				process.stderr.write,
				/The --suppress and --suppress=<rule> options cannot be used together./s,
			);
		});
	});

	describe('stdin', () => {
		it('displays an error when the --suppress flag is used', async (t) => {
			mock.getter(process, 'stdin', () => Readable.from([Buffer.from('a {}')]));

			await cli(['--stdin', '--suppress']);

			t.assert.strictEqual(process.exitCode, EXIT_CODE_INVALID_USAGE);

			t.assert.strictEqual(process.stdout.write.mock.callCount(), 0);
			t.assert.strictEqual(process.stderr.write.mock.callCount(), 1);
			assertWritten(
				process.stderr.write,
				/The --suppress and --suppress=<rule> options cannot be used with piped-in code./s,
			);
		});

		it('displays an error when the --suppress=<rule> flag is used', async (t) => {
			mock.getter(process, 'stdin', () => Readable.from([Buffer.from('a {}')]));

			await cli(['--stdin', '--suppress=block-no-empty']);

			t.assert.strictEqual(process.exitCode, EXIT_CODE_INVALID_USAGE);

			t.assert.strictEqual(process.stdout.write.mock.callCount(), 0);
			t.assert.strictEqual(process.stderr.write.mock.callCount(), 1);
			assertWritten(
				process.stderr.write,
				/The --suppress and --suppress=<rule> options cannot be used with piped-in code./s,
			);
		});
	});

	describe('when no suppression file exists', () => {
		beforeEach(async () => {
			await fs.rm(SUPPRESSIONS_PATH, { force: true });
		});

		it('creates the suppressions file when the --suppress flag is used, and reports no problems', async (t) => {
			await cli([
				'--suppress',
				'--suppress-location',
				SUPPRESSIONS_PATH,
				'--config',
				CONFIG_BLOCK_ONLY,
				EMPTY_BLOCK_CSS,
			]);

			t.assert.strictEqual(process.exitCode, undefined);

			t.assert.match(await fs.readFile(SUPPRESSIONS_PATH, 'utf8'), /"block-no-empty"/);

			assertWritten(process.stderr.write, /The suppressions feature is experimental/);
		});

		it('creates the suppressions file when --suppress-location specifies a directory', async (t) => {
			const supDir = path.join(cssTmpDir, 'suppressions-dir');
			const expectedSupPath = path.join(supDir, 'stylelint-suppressions.json');

			await fs.mkdir(supDir, { recursive: true });

			await cli([
				'--suppress',
				'--suppress-location',
				supDir,
				'--config',
				CONFIG_BLOCK_ONLY,
				EMPTY_BLOCK_CSS,
			]);

			t.assert.strictEqual(process.exitCode, undefined);

			t.assert.match(await fs.readFile(expectedSupPath, 'utf8'), /"block-no-empty"/);

			assertWritten(process.stderr.write, /The suppressions feature is experimental/);
		});

		it('creates the suppressions file when the --suppress=<rule> flag is used, and reports some problems', async (t) => {
			await cli([
				'--suppress=color-no-invalid-hex',
				'--suppress-location',
				SUPPRESSIONS_PATH,
				'--config',
				CONFIG_BLOCK_AND_COLOR,
				EMPTY_BLOCK_CSS,
				INVALID_HEX_CSS,
			]);

			t.assert.strictEqual(process.exitCode, EXIT_CODE_LINT_PROBLEM);

			const sup = JSON.parse(await fs.readFile(SUPPRESSIONS_PATH, 'utf8'));

			const relativeInvalidHex = getRelativePath(process.cwd(), INVALID_HEX_CSS);

			t.assert.ok(Object.hasOwn(sup[relativeInvalidHex], 'color-no-invalid-hex'));

			const relativeEmptyBlock = getRelativePath(process.cwd(), EMPTY_BLOCK_CSS);

			t.assert.strictEqual(sup[relativeEmptyBlock], undefined);

			t.assert.strictEqual(process.stderr.write.mock.callCount(), 2);
			t.assert.match(
				process.stderr.write.mock.calls[0].arguments[0],
				/The suppressions feature is experimental/,
			);
			t.assert.match(process.stderr.write.mock.calls[1].arguments[0], /block-no-empty/);
			t.assert.doesNotMatch(
				process.stderr.write.mock.calls[1].arguments[0],
				/color-no-invalid-hex/,
			);
		});

		it('creates the suppressions file when multiple --suppress=<rule> flags are used, and reports some problems', async (t) => {
			await cli([
				'--suppress=color-no-invalid-hex',
				'--suppress=block-no-empty',
				'--suppress-location',
				SUPPRESSIONS_PATH,
				'--config',
				CONFIG_BLOCK_COLOR_LENGTH,
				EMPTY_BLOCK_CSS,
				INVALID_HEX_CSS,
				LENGTH_ZERO_NO_UNIT_CSS,
			]);

			t.assert.strictEqual(process.exitCode, EXIT_CODE_LINT_PROBLEM);

			const sup = JSON.parse(await fs.readFile(SUPPRESSIONS_PATH, 'utf8'));

			t.assert.strictEqual(Object.keys(sup).length, 2);

			t.assert.strictEqual(process.stderr.write.mock.callCount(), 2);
			t.assert.match(
				process.stderr.write.mock.calls[0].arguments[0],
				/The suppressions feature is experimental/,
			);
			t.assert.match(process.stderr.write.mock.calls[1].arguments[0], /length-zero-no-unit/);
			t.assert.doesNotMatch(process.stderr.write.mock.calls[1].arguments[0], /block-no-empty/);
			t.assert.doesNotMatch(
				process.stderr.write.mock.calls[1].arguments[0],
				/color-no-invalid-hex/,
			);
		});

		it("displays an error when the suppressions file doesn't exist", async (t) => {
			await cli([
				'--suppress-location',
				SUPPRESSIONS_PATH,
				'--config',
				CONFIG_LENGTH_ONLY,
				EMPTY_BLOCK_CSS,
			]);

			t.assert.strictEqual(process.exitCode, EXIT_CODE_INVALID_USAGE);
			assertWritten(process.stderr.write, /The suppressions file does not exist/);
		});

		it('displays an error when --suppress-location specifies a non-existent directory', async (t) => {
			const nonExistentDir = path.join(cssTmpDir, 'non-existent');

			await cli([
				'--suppress-location',
				nonExistentDir,
				'--config',
				CONFIG_LENGTH_ONLY,
				EMPTY_BLOCK_CSS,
			]);

			t.assert.strictEqual(process.exitCode, EXIT_CODE_INVALID_USAGE);
			assertWritten(process.stderr.write, /The suppressions file does not exist/);
		});

		it('creates the suppressions file when the --suppress flag and --fix is used, and reports no problems', async (t) => {
			const fixFile = path.join(cssTmpDir, 'fix.css');

			await fs.writeFile(fixFile, 'a { top: 0px }'); // length-zero-no-unit: error but fixable

			await cli([
				'--suppress',
				'--fix',
				'--suppress-location',
				SUPPRESSIONS_PATH,
				'--config',
				CONFIG_LENGTH_ONLY,
				fixFile,
			]);

			t.assert.strictEqual(process.exitCode, undefined);

			const sup = JSON.parse(await fs.readFile(SUPPRESSIONS_PATH, 'utf8'));
			const relativeFixFile = getRelativePath(process.cwd(), fixFile);

			t.assert.strictEqual(sup[relativeFixFile], undefined);
		});
	});

	describe('when an invalid suppressions file already exists', () => {
		beforeEach(async () => {
			await fs.writeFile(SUPPRESSIONS_PATH, 'This is not valid JSON.');
		});

		afterEach(async () => {
			await fs.rm(SUPPRESSIONS_PATH, { force: true });
		});

		it('gives an error when the --suppress argument is used', async (t) => {
			await cli([
				'--suppress',
				'--suppress-location',
				SUPPRESSIONS_PATH,
				'--config',
				CONFIG_BLOCK_ONLY,
				EMPTY_BLOCK_CSS,
			]);

			t.assert.strictEqual(process.exitCode, EXIT_CODE_FATAL_ERROR);
			assertWritten(process.stderr.write, /Failed to parse suppressions file at/);
		});

		it('gives an error when the suppressions options are not used', async (t) => {
			await cli([
				'--suppress-location',
				SUPPRESSIONS_PATH,
				'--config',
				CONFIG_BLOCK_ONLY,
				EMPTY_BLOCK_CSS,
			]);

			t.assert.strictEqual(process.exitCode, EXIT_CODE_FATAL_ERROR);
			assertWritten(process.stderr.write, /Failed to parse suppressions file at/);
		});

		it('gives an error when the --suppress=<rule> argument is used', async (t) => {
			await cli([
				'--suppress=block-no-empty',
				'--suppress-location',
				SUPPRESSIONS_PATH,
				'--config',
				CONFIG_BLOCK_ONLY,
				EMPTY_BLOCK_CSS,
			]);

			t.assert.strictEqual(process.exitCode, EXIT_CODE_FATAL_ERROR);
			assertWritten(process.stderr.write, /Failed to parse suppressions file at/);
		});
	});

	describe('when a valid suppressions file already exists', () => {
		const relativeCSSPath = getRelativePath(process.cwd(), BLOCK_COLOR_LENGTH_CSS);
		const expectedSuppressions = {
			[relativeCSSPath]: {
				'block-no-empty': { count: 1 },
				'color-no-invalid-hex': { count: 1 },
				'length-zero-no-unit': { count: 1 },
			},
		};

		afterEach(async () => {
			await fs.rm(SUPPRESSIONS_PATH, { force: true });
		});

		it("doesn't remove suppressions from the suppressions file when the --suppress flag is used", async (t) => {
			await fs.copyFile(EXISTING_SUPPRESSIONS_PATH, SUPPRESSIONS_PATH);

			await cli([
				'--suppress',
				'--suppress-location',
				SUPPRESSIONS_PATH,
				'--config',
				CONFIG_BLOCK_COLOR_LENGTH,
				BLOCK_COLOR_LENGTH_CSS,
			]);

			t.assert.strictEqual(process.exitCode, undefined);

			const relativeBlockColorLengthCss = getRelativePath(process.cwd(), BLOCK_COLOR_LENGTH_CSS);
			const sup = JSON.parse(await fs.readFile(SUPPRESSIONS_PATH, 'utf8'));

			t.assert.ok(Object.hasOwn(sup, relativeBlockColorLengthCss));

			assertWritten(process.stderr.write, /The suppressions feature is experimental/);
		});

		it('suppresses the problems from the suppressions file, without passing --suppress', async (t) => {
			await fs.writeFile(SUPPRESSIONS_PATH, JSON.stringify(expectedSuppressions));

			await cli([
				'--suppress-location',
				SUPPRESSIONS_PATH,
				'--config',
				CONFIG_BLOCK_COLOR_LENGTH,
				BLOCK_COLOR_LENGTH_CSS,
			]);

			t.assert.strictEqual(process.exitCode, undefined);
			assertWritten(process.stderr.write, /The suppressions feature is experimental/);
		});

		it('does not exit with an error when all problems are suppressed and the formatter prints a report', async (t) => {
			await fs.writeFile(SUPPRESSIONS_PATH, JSON.stringify(expectedSuppressions));

			await cli([
				'--suppress-location',
				SUPPRESSIONS_PATH,
				'--config',
				CONFIG_BLOCK_COLOR_LENGTH,
				'--formatter',
				'json',
				BLOCK_COLOR_LENGTH_CSS,
			]);

			t.assert.strictEqual(process.exitCode, undefined);
		});

		it('displays all the problems, when there is at least one left unmatched', async (t) => {
			const sup = structuredClone(expectedSuppressions);

			// Create an unmatched suppression
			const relative = Object.keys(sup)[0];

			sup[relative]['length-zero-no-unit'].count = 0;

			await fs.writeFile(SUPPRESSIONS_PATH, JSON.stringify(sup));

			await cli([
				'--suppress-location',
				SUPPRESSIONS_PATH,
				'--config',
				CONFIG_BLOCK_COLOR_LENGTH,
				BLOCK_COLOR_LENGTH_CSS,
			]);

			t.assert.strictEqual(process.exitCode, EXIT_CODE_LINT_PROBLEM);

			t.assert.strictEqual(process.stderr.write.mock.callCount(), 2);
			t.assert.match(
				process.stderr.write.mock.calls[0].arguments[0],
				/The suppressions feature is experimental/,
			);
			t.assert.match(process.stderr.write.mock.calls[1].arguments[0], /length-zero-no-unit/);

			t.assert.doesNotMatch(process.stderr.write.mock.calls[1].arguments[0], /block-no-empty/);
			t.assert.doesNotMatch(
				process.stderr.write.mock.calls[1].arguments[0],
				/color-no-invalid-hex/,
			);
		});

		it('automatically prunes the suppressions file when the --suppress flag is used', async (t) => {
			const sup = structuredClone(expectedSuppressions);
			const relative = Object.keys(sup)[0];

			sup[relative]['block-no-empty'].count = 10; // unused
			sup[relative].nonExistentRule = { count: 1 };
			await fs.writeFile(SUPPRESSIONS_PATH, JSON.stringify(sup));

			await cli([
				'--suppress',
				'--suppress-location',
				SUPPRESSIONS_PATH,
				'--config',
				CONFIG_BLOCK_COLOR_LENGTH,
				BLOCK_COLOR_LENGTH_CSS,
			]);

			t.assert.strictEqual(process.exitCode, undefined);

			// Check that the unused suppressions were removed automatically
			const after = JSON.parse(await fs.readFile(SUPPRESSIONS_PATH, 'utf8'));

			t.assert.deepStrictEqual(after, expectedSuppressions);
		});

		it('automatically prunes the suppressions file when --suppress and --suppress-location specifies a directory', async (t) => {
			const supDir = path.join(cssTmpDir, 'prune-dir');
			const expectedSupPath = path.join(supDir, 'stylelint-suppressions.json');

			await fs.mkdir(supDir, { recursive: true });

			const sup = structuredClone(expectedSuppressions);
			const relative = Object.keys(sup)[0];

			sup[relative]['block-no-empty'].count = 10; // unused
			sup[relative].nonExistentRule = { count: 1 };
			await fs.writeFile(expectedSupPath, JSON.stringify(sup));

			await cli([
				'--suppress',
				'--suppress-location',
				supDir,
				'--config',
				CONFIG_BLOCK_COLOR_LENGTH,
				BLOCK_COLOR_LENGTH_CSS,
			]);

			t.assert.strictEqual(process.exitCode, undefined);

			// Check that the unused suppressions were removed
			const after = JSON.parse(await fs.readFile(expectedSupPath, 'utf8'));

			t.assert.deepStrictEqual(after, expectedSuppressions);
		});

		it('creates an empty suppressions file when all problems are removed', async (t) => {
			const testFile = path.join(cssTmpDir, 'test-file.css');

			// No problems
			await fs.writeFile(testFile, 'a { color: red; }');

			// Create a suppressions file with existing suppressions for this file
			const relativeTestFile = getRelativePath(process.cwd(), testFile);
			const existingSuppressions = {
				[relativeTestFile]: {
					'block-no-empty': { count: 1 },
				},
			};

			await fs.writeFile(SUPPRESSIONS_PATH, JSON.stringify(existingSuppressions));

			await cli([
				'--suppress',
				'--suppress-location',
				SUPPRESSIONS_PATH,
				'--config',
				CONFIG_BLOCK_ONLY,
				testFile,
			]);

			t.assert.strictEqual(process.exitCode, undefined);

			const after = JSON.parse(await fs.readFile(SUPPRESSIONS_PATH, 'utf8'));

			t.assert.deepStrictEqual(after, {});
		});

		it('removes only the processed file from suppressions when multiple paths exist', async (t) => {
			const testFile1 = path.join(cssTmpDir, 'test-file-1.css');
			const testFile2 = path.join(cssTmpDir, 'test-file-2.css');

			// no problems
			await fs.writeFile(testFile1, 'a { color: red; }');
			// has problems
			await fs.writeFile(testFile2, 'b { }');

			const relativeTestFile1 = getRelativePath(process.cwd(), testFile1);
			const relativeTestFile2 = getRelativePath(process.cwd(), testFile2);
			const existingSuppressions = {
				[relativeTestFile1]: {
					'block-no-empty': { count: 1 },
				},
				[relativeTestFile2]: {
					'block-no-empty': { count: 1 },
				},
			};

			await fs.writeFile(SUPPRESSIONS_PATH, JSON.stringify(existingSuppressions));

			// Run suppress only on testFile1 (which has no problems)
			await cli([
				'--suppress',
				'--suppress-location',
				SUPPRESSIONS_PATH,
				'--config',
				CONFIG_BLOCK_ONLY,
				testFile1,
			]);

			t.assert.strictEqual(process.exitCode, undefined);

			const after = JSON.parse(await fs.readFile(SUPPRESSIONS_PATH, 'utf8'));

			// testFile1 should be removed, but testFile2 should remain
			t.assert.deepStrictEqual(after, {
				[relativeTestFile2]: {
					'block-no-empty': { count: 1 },
				},
			});
		});
	});
});
