import child_process from 'node:child_process';
import { promisify } from 'node:util';
import { test } from 'node:test';

import dynamicImport from '../dynamicImport.mjs';

const execFile = promisify(child_process.execFile);

test('imports module successfully', async (t) => {
	const module = await dynamicImport('postcss');

	t.assert.notStrictEqual(module, undefined);
	t.assert.strictEqual(typeof module, 'object');
	t.assert.strictEqual(typeof module.default, 'function');
});

test('throws error when module is not found', async (t) => {
	const { stderr } = await execFile(
		'node',
		['-e', 'import("../dynamicImport.mjs").then(m => m.default("nonexistent-module"))'],
		{ cwd: import.meta.dirname },
	).catch((e) => e);

	t.assert.ok(
		stderr.includes(
			'Cannot resolve module "nonexistent-module". Check that module "nonexistent-module" is available and spelled correctly',
		),
	);
});

test('throws customized error when module is not found', async (t) => {
	const { stderr } = await execFile(
		'node',
		[
			'-e',
			'import("../dynamicImport.mjs").then(m => m.default("nonexistent-module", { moduleLabel: "test" }))',
		],
		{ cwd: import.meta.dirname },
	).catch((e) => e);

	t.assert.ok(
		stderr.includes(
			'Cannot resolve test module "nonexistent-module". Check that module "nonexistent-module" is available and spelled correctly',
		),
	);
});
