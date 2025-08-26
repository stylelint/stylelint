#!/usr/bin/env node

import process from 'node:process';

import cli from '../lib/cli.mjs';

function checkForInvalidQuotesOnWindows(patterns) {
	// Only run on Windows
	if (process.platform !== 'win32') return;

	for (const pattern of patterns) {
		// Check for single quotes (which don't work well on Windows)
		if (pattern.startsWith("'") && pattern.endsWith("'")) {
			process.stderr.write(
				'Warning: On Windows, single quotes around file patterns may not work. Use double quotes instead.\n',
			);
			// Only warn once
			break;
		}
	}
}

const args = process.argv.slice(2);

checkForInvalidQuotesOnWindows(args);

cli(args);
