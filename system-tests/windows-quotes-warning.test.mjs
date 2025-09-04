/* eslint-disable @stylistic/padding-line-between-statements */
/* eslint-disable sort-imports */
import { execSync } from 'child_process';
import { unlinkSync, writeFileSync } from 'fs';
import process from 'process';

describe('Windows single quotes warning', () => {
	// Create a temporary config file
	beforeAll(() => {
		writeFileSync(
			'system-tests/.test-config.json',
			JSON.stringify({
				rules: {},
			}),
		);
	});

	// Clean up config file
	afterAll(() => {
		try {
			unlinkSync('system-tests/.test-config.json');
		} catch {
			// Ignore if file doesn't exist
		}
	});

	it('prints a warning when using single quotes', () => {
		if (process.platform !== 'win32') {
			return;
		}

		let stdout = '';
		let stderr = '';

		try {
			stdout = execSync(
				"node bin/stylelint.mjs 'system-tests/fixtures/test-file.css' --config=system-tests/.test-config.json",
				{ encoding: 'utf8', stdio: 'pipe' },
			);
		} catch (error) {
			stderr = error.stderr || '';
		}

		const combinedOutput = stdout + stderr;
		expect(combinedOutput).toContain(
			'Warning: On Windows, single quotes around file patterns may not work',
		);
	});

	it('does not warn when using double quotes', () => {
		if (process.platform !== 'win32') {
			return;
		}

		let stdout = '';
		let stderr = '';

		try {
			stdout = execSync(
				'node bin/stylelint.mjs "system-tests/fixtures/test-file.css" --config=system-tests/.test-config.json',
				{ encoding: 'utf8', stdio: 'pipe' },
			);
		} catch (error) {
			stderr = error.stderr || '';
		}

		const combinedOutput = stdout + stderr;
		expect(combinedOutput).not.toContain(
			'Warning: On Windows, single quotes around file patterns may not work',
		);
	});

	it('does not warn when not on Windows', () => {
		if (process.platform === 'win32') {
			return;
		}

		let stdout = '';
		let stderr = '';

		try {
			stdout = execSync(
				"node bin/stylelint.mjs 'system-tests/fixtures/test-file.css' --config=system-tests/.test-config.json",
				{ encoding: 'utf8', stdio: 'pipe' },
			);
		} catch (error) {
			stderr = error.stderr || '';
		}

		const combinedOutput = stdout + stderr;
		expect(combinedOutput).not.toContain(
			'Warning: On Windows, single quotes around file patterns may not work',
		);
	});
});
