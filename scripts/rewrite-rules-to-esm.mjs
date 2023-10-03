// TODO: This script is temporary for the ESM migration. Please remove this when it's no longer needed.

/* eslint-disable no-console */
import { readFileSync, renameSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

import glob from 'fast-glob';

for (const oldFile of glob.sync('lib/rules/*/index.js')) {
	const newFile = `${oldFile.replace('.js', '')}.mjs`;

	renameSync(oldFile, newFile);

	const content = readFileSync(newFile, 'utf8');
	const newContent = content
		.replace("'use strict';", '')
		.replace(
			"const properties = require('known-css-properties').all;",
			"import { all as properties } from 'known-css-properties';",
		)
		.replace(
			"const { units: refUnits } = require('../../reference/units.cjs');",
			"import { units as refUnits } from '../../reference/units.cjs';",
		)
		.replace(/^const ([^=]+) = require\(([^)]+)\);/gm, 'import $1 from $2;')
		.replaceAll(".cjs'", ".mjs'")
		.replace('module.exports =', 'export default');

	writeFileSync(newFile, newContent);
	console.log(`Rewrote ${newFile}`);

	const testFile = join(oldFile, '../__tests__/index.mjs');
	const testContent = readFileSync(testFile, 'utf8');
	const newTestContent = testContent.replace("/index.js'", "/index.mjs'");

	writeFileSync(testFile, newTestContent);
	console.log(`Rewrote ${testFile}`);
}

const rulesFile = 'lib/rules/index.mjs';
const rulesContent = readFileSync(rulesFile, 'utf8').replaceAll('/index.js', '/index.cjs');

writeFileSync(rulesFile, rulesContent);
console.log(`Rewrote ${rulesFile}`);

const execOptions = { stdio: 'inherit' };

execFileSync('npm', ['run', 'format'], execOptions);

try {
	execFileSync('npm', ['run', 'lint:js', '--', '--fix'], execOptions);
} catch {
	// autofix is insufficient here
}

execFileSync('npm', ['run', 'build'], execOptions);
execFileSync('npm', ['run', 'lint:types'], execOptions);
execFileSync('npm', ['run', 'test', '--ignore-scripts'], execOptions);
