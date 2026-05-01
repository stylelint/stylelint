import child_process from 'node:child_process';
import { promisify } from 'node:util';

import dynamicImport from '../dynamicImport.mjs';

const execFile = promisify(child_process.execFile);

test('imports module successfully', async () => {
	const module = await dynamicImport('postcss');

	expect(module).toBeDefined();
	expect(typeof module).toBe('object');
	expect(typeof module.default).toBe('function');
});

// Use `node -e` to bypass Jest's module resolution
test('throws error when module is not found', async () => {
	const { stderr } = await execFile(
		'node',
		['-e', 'import("../dynamicImport.mjs").then(m => m.default("nonexistent-module"))'],
		{ cwd: import.meta.dirname },
	).catch((e) => e);

	expect(stderr).toContain(
		'Cannot resolve module "nonexistent-module". Check that module "nonexistent-module" is available and spelled correctly',
	);
});

test('throws customized error when module is not found', async () => {
	const { stderr } = await execFile(
		'node',
		[
			'-e',
			'import("../dynamicImport.mjs").then(m => m.default("nonexistent-module", { moduleLabel: "test" }))',
		],
		{ cwd: import.meta.dirname },
	).catch((e) => e);

	expect(stderr).toContain(
		'Cannot resolve test module "nonexistent-module". Check that module "nonexistent-module" is available and spelled correctly',
	);
});
