// NOTE: This test uses the `node:test` module to verify Yarn PnP integration.
import { before, describe, test } from 'node:test'; // eslint-disable-line n/no-unsupported-features/node-builtins
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const CASE_DIR = import.meta.dirname; // eslint-disable-line n/no-unsupported-features/node-builtins
const skip = process.env.STYLELINT_TEST_YARN_PNP !== 'true';

describe('Yarn PnP integration', { skip }, () => {
	before(async () => {
		await fs.writeFile(path.join(CASE_DIR, 'yarn.lock'), '', 'utf8'); // need an empty yarn.lock for PnP
		await execFileAsync('yarn', ['install'], { cwd: CASE_DIR });
	});

	test('successful linting', async () => {
		let output;

		try {
			await execFileAsync(
				'yarn',
				['stylelint', 'stylesheet.css', '--config', 'config.js', '--formatter', 'json'],
				{
					cwd: CASE_DIR,
					env: { ...process.env, NODE_OPTIONS: '--experimental-import-meta-resolve' },
				},
			);
		} catch (e) {
			if (e.code !== 2) {
				assert.fail(`Unexpected exit code: ${e.code}\nstdout: ${e.stdout}\nstderr: ${e.stderr}`);
			}

			output = e.stderr;
		}

		const results = JSON.parse(output);

		assert.equal(results.length, 1);
		assert.equal(results[0].source, path.join(CASE_DIR, 'stylesheet.css'));
		assert.equal(results[0].errored, true);
		assert.equal(results[0].warnings.length, 1);
		assert.equal(results[0].warnings[0].rule, 'block-no-empty');
	});
});
