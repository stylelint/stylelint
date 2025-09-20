import * as fs from 'node:fs/promises';
import { Readable } from 'node:stream';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import process from 'node:process';

import { jest } from '@jest/globals';

import {
	EXIT_CODE_FATAL_ERROR,
	EXIT_CODE_INVALID_USAGE,
	EXIT_CODE_LINT_PROBLEM,
} from '../constants.mjs';
import getRelativePath from '../utils/getRelativePath.mjs';
import replaceBackslashes from '../testUtils/replaceBackslashes.mjs';

import cli from '../cli.mjs';

const fixturesPath = (...elems) =>
	replaceBackslashes(path.join(fileURLToPath(new URL('./fixtures', import.meta.url)), ...elems));

describe('Suppressions', () => {
	beforeEach(() => {
		jest.spyOn(process, 'exit').mockImplementation(() => {});
		jest.spyOn(process.stdout, 'write').mockImplementation(() => {});
		jest.spyOn(process.stderr, 'write').mockImplementation(() => {});
		jest.spyOn(console, 'log').mockImplementation(() => {});
		jest.spyOn(console, 'error').mockImplementation(() => {});
	});

	afterEach(() => {
		jest.restoreAllMocks();
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
		it('displays an error when the --suppress and --suppress=<rule> flags are used together', async () => {
			await cli(['--suppress', '--suppress=block-no-empty']);

			expect(process.exitCode).toBe(EXIT_CODE_INVALID_USAGE);

			expect(process.stdout.write).not.toHaveBeenCalled();
			expect(process.stderr.write).toHaveBeenCalledWith(
				expect.stringMatching(
					/The --suppress and --suppress=<rule> options cannot be used together./s,
				),
			);
		});
	});

	describe('stdin', () => {
		it('displays an error when the --suppress flag is used', async () => {
			jest
				.spyOn(process, 'stdin', 'get')
				.mockImplementationOnce(() => Readable.from([Buffer.from('a {}')]));

			await cli(['--stdin', '--suppress']);

			expect(process.exitCode).toBe(EXIT_CODE_INVALID_USAGE);

			expect(process.stdout.write).not.toHaveBeenCalled();
			expect(process.stderr.write).toHaveBeenCalledTimes(1);
			expect(process.stderr.write).toHaveBeenCalledWith(
				expect.stringMatching(
					/The --suppress and --suppress=<rule> options cannot be used with piped-in code./s,
				),
			);
		});

		it('displays an error when the --suppress=<rule> flag is used', async () => {
			jest
				.spyOn(process, 'stdin', 'get')
				.mockImplementationOnce(() => Readable.from([Buffer.from('a {}')]));

			await cli(['--stdin', '--suppress=block-no-empty']);

			expect(process.exitCode).toBe(EXIT_CODE_INVALID_USAGE);

			expect(process.stdout.write).not.toHaveBeenCalled();
			expect(process.stderr.write).toHaveBeenCalledTimes(1);
			expect(process.stderr.write).toHaveBeenCalledWith(
				expect.stringMatching(
					/The --suppress and --suppress=<rule> options cannot be used with piped-in code./s,
				),
			);
		});
	});

	describe('when no suppression file exists', () => {
		beforeEach(async () => {
			await fs.rm(SUPPRESSIONS_PATH, { force: true });
		});

		it('creates the suppressions file when the --suppress flag is used, and reports no problems', async () => {
			await cli([
				'--suppress',
				'--suppress-location',
				SUPPRESSIONS_PATH,
				'--config',
				CONFIG_BLOCK_ONLY,
				EMPTY_BLOCK_CSS,
			]);

			expect(process.exitCode).toBeUndefined();

			expect(await fs.readFile(SUPPRESSIONS_PATH, 'utf8')).toMatch(/"block-no-empty"/);

			expect(process.stderr.write).toHaveBeenCalledWith(
				expect.stringMatching(/The suppressions feature is experimental/),
				expect.any(Function),
			);
		});

		it('creates the suppressions file when --suppress-location specifies a directory', async () => {
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

			expect(process.exitCode).toBeUndefined();

			expect(await fs.readFile(expectedSupPath, 'utf8')).toMatch(/"block-no-empty"/);

			expect(process.stderr.write).toHaveBeenCalledWith(
				expect.stringMatching(/The suppressions feature is experimental/),
				expect.any(Function),
			);
		});

		it('creates the suppressions file when the --suppress=<rule> flag is used, and reports some problems', async () => {
			await cli([
				'--suppress=color-no-invalid-hex',
				'--suppress-location',
				SUPPRESSIONS_PATH,
				'--config',
				CONFIG_BLOCK_AND_COLOR,
				EMPTY_BLOCK_CSS,
				INVALID_HEX_CSS,
			]);

			expect(process.exitCode).toBe(EXIT_CODE_LINT_PROBLEM);

			const sup = JSON.parse(await fs.readFile(SUPPRESSIONS_PATH, 'utf8'));

			const relativeInvalidHex = getRelativePath(process.cwd(), INVALID_HEX_CSS);

			expect(sup[relativeInvalidHex]).toHaveProperty('color-no-invalid-hex');

			const relativeEmptyBlock = getRelativePath(process.cwd(), EMPTY_BLOCK_CSS);

			expect(sup[relativeEmptyBlock]).toBeUndefined();

			expect(process.stderr.write).toHaveBeenCalledTimes(2);
			expect(process.stderr.write.mock.calls[0][0]).toMatch(
				/The suppressions feature is experimental/,
			);
			expect(process.stderr.write.mock.calls[1][0]).toMatch(/block-no-empty/);
			expect(process.stderr.write.mock.calls[1][0]).not.toMatch(/color-no-invalid-hex/);
		});

		it('creates the suppressions file when multiple --suppress=<rule> flags are used, and reports some problems', async () => {
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

			expect(process.exitCode).toBe(EXIT_CODE_LINT_PROBLEM);

			const sup = JSON.parse(await fs.readFile(SUPPRESSIONS_PATH, 'utf8'));

			expect(Object.keys(sup)).toHaveLength(2);

			expect(process.stderr.write).toHaveBeenCalledTimes(2);
			expect(process.stderr.write.mock.calls[0][0]).toMatch(
				/The suppressions feature is experimental/,
			);
			expect(process.stderr.write.mock.calls[1][0]).toMatch(/length-zero-no-unit/);
			expect(process.stderr.write.mock.calls[1][0]).not.toMatch(/block-no-empty/);
			expect(process.stderr.write.mock.calls[1][0]).not.toMatch(/color-no-invalid-hex/);
		});

		it("displays an error when the suppressions file doesn't exist", async () => {
			await cli([
				'--suppress-location',
				SUPPRESSIONS_PATH,
				'--config',
				CONFIG_LENGTH_ONLY,
				EMPTY_BLOCK_CSS,
			]);

			expect(process.exitCode).toBe(EXIT_CODE_INVALID_USAGE);
			expect(process.stderr.write).toHaveBeenCalledWith(
				expect.stringMatching(/The suppressions file does not exist/),
			);
		});

		it('displays an error when --suppress-location specifies a non-existent directory', async () => {
			const nonExistentDir = path.join(cssTmpDir, 'non-existent');

			await cli([
				'--suppress-location',
				nonExistentDir,
				'--config',
				CONFIG_LENGTH_ONLY,
				EMPTY_BLOCK_CSS,
			]);

			expect(process.exitCode).toBe(EXIT_CODE_INVALID_USAGE);
			expect(process.stderr.write).toHaveBeenCalledWith(
				expect.stringMatching(/The suppressions file does not exist/),
			);
		});

		it('creates the suppressions file when the --suppress flag and --fix is used, and reports no problems', async () => {
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

			expect(process.exitCode).toBeUndefined();

			const sup = JSON.parse(await fs.readFile(SUPPRESSIONS_PATH, 'utf8'));
			const relativeFixFile = getRelativePath(process.cwd(), fixFile);

			expect(sup[relativeFixFile]).toBeUndefined();
		});
	});

	describe('when an invalid suppressions file already exists', () => {
		beforeEach(async () => {
			await fs.writeFile(SUPPRESSIONS_PATH, 'This is not valid JSON.');
		});

		afterEach(async () => {
			await fs.rm(SUPPRESSIONS_PATH, { force: true });
		});

		it('gives an error when the --suppress argument is used', async () => {
			await cli([
				'--suppress',
				'--suppress-location',
				SUPPRESSIONS_PATH,
				'--config',
				CONFIG_BLOCK_ONLY,
				EMPTY_BLOCK_CSS,
			]);

			expect(process.exitCode).toBe(EXIT_CODE_FATAL_ERROR);
			expect(process.stderr.write).toHaveBeenCalledWith(
				expect.stringMatching(/Failed to parse suppressions file at/),
			);
		});

		it('gives an error when the suppressions options are not used', async () => {
			await cli([
				'--suppress-location',
				SUPPRESSIONS_PATH,
				'--config',
				CONFIG_BLOCK_ONLY,
				EMPTY_BLOCK_CSS,
			]);

			expect(process.exitCode).toBe(EXIT_CODE_FATAL_ERROR);
			expect(process.stderr.write).toHaveBeenCalledWith(
				expect.stringMatching(/Failed to parse suppressions file at/),
			);
		});

		it('gives an error when the --suppress=<rule> argument is used', async () => {
			await cli([
				'--suppress=block-no-empty',
				'--suppress-location',
				SUPPRESSIONS_PATH,
				'--config',
				CONFIG_BLOCK_ONLY,
				EMPTY_BLOCK_CSS,
			]);

			expect(process.exitCode).toBe(EXIT_CODE_FATAL_ERROR);
			expect(process.stderr.write).toHaveBeenCalledWith(
				expect.stringMatching(/Failed to parse suppressions file at/),
			);
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

		it("doesn't remove suppressions from the suppressions file when the --suppress flag is used", async () => {
			await fs.copyFile(EXISTING_SUPPRESSIONS_PATH, SUPPRESSIONS_PATH);

			await cli([
				'--suppress',
				'--suppress-location',
				SUPPRESSIONS_PATH,
				'--config',
				CONFIG_BLOCK_COLOR_LENGTH,
				BLOCK_COLOR_LENGTH_CSS,
			]);

			expect(process.exitCode).toBeUndefined();

			const relativeBlockColorLengthCss = getRelativePath(process.cwd(), BLOCK_COLOR_LENGTH_CSS);
			const sup = JSON.parse(await fs.readFile(SUPPRESSIONS_PATH, 'utf8'));

			expect(sup).toHaveProperty([relativeBlockColorLengthCss]);

			expect(process.stderr.write).toHaveBeenCalledWith(
				expect.stringMatching(/The suppressions feature is experimental/),
				expect.any(Function),
			);
		});

		it('suppresses the problems from the suppressions file, without passing --suppress', async () => {
			await fs.writeFile(SUPPRESSIONS_PATH, JSON.stringify(expectedSuppressions));

			await cli([
				'--suppress-location',
				SUPPRESSIONS_PATH,
				'--config',
				CONFIG_BLOCK_COLOR_LENGTH,
				BLOCK_COLOR_LENGTH_CSS,
			]);

			expect(process.exitCode).toBeUndefined();
			expect(process.stderr.write).toHaveBeenCalledWith(
				expect.stringMatching(/The suppressions feature is experimental/),
				expect.any(Function),
			);
		});

		it('displays all the problems, when there is at least one left unmatched', async () => {
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

			expect(process.exitCode).toBe(EXIT_CODE_LINT_PROBLEM);

			expect(process.stderr.write).toHaveBeenCalledTimes(2);
			expect(process.stderr.write.mock.calls[0][0]).toMatch(
				/The suppressions feature is experimental/,
			);
			expect(process.stderr.write.mock.calls[1][0]).toMatch(/length-zero-no-unit/);

			expect(process.stderr.write.mock.calls[1][0]).not.toMatch(/block-no-empty/);
			expect(process.stderr.write.mock.calls[1][0]).not.toMatch(/color-no-invalid-hex/);
		});

		it('automatically prunes the suppressions file when the --suppress flag is used', async () => {
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

			expect(process.exitCode).toBeUndefined();

			// Check that the unused suppressions were removed automatically
			const after = JSON.parse(await fs.readFile(SUPPRESSIONS_PATH, 'utf8'));

			expect(after).toEqual(expectedSuppressions);
		});

		it('automatically prunes the suppressions file when --suppress and --suppress-location specifies a directory', async () => {
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

			expect(process.exitCode).toBeUndefined();

			// Check that the unused suppressions were removed
			const after = JSON.parse(await fs.readFile(expectedSupPath, 'utf8'));

			expect(after).toEqual(expectedSuppressions);
		});

		it('creates an empty suppressions file when all problems are removed', async () => {
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

			expect(process.exitCode).toBeUndefined();

			const after = JSON.parse(await fs.readFile(SUPPRESSIONS_PATH, 'utf8'));

			expect(after).toEqual({});
		});

		it('removes only the processed file from suppressions when multiple paths exist', async () => {
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

			expect(process.exitCode).toBeUndefined();

			const after = JSON.parse(await fs.readFile(SUPPRESSIONS_PATH, 'utf8'));

			// testFile1 should be removed, but testFile2 should remain
			expect(after).toEqual({
				[relativeTestFile2]: {
					'block-no-empty': { count: 1 },
				},
			});
		});
	});
});
