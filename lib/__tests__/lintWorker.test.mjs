import * as fs from 'node:fs/promises';
import { EventEmitter } from 'node:events';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { jest } from '@jest/globals';

import replaceBackslashes from '../testUtils/replaceBackslashes.mjs';

const fixturesPath = (...elems) =>
	replaceBackslashes(path.join(fileURLToPath(new URL('./fixtures', import.meta.url)), ...elems));

const cssTmpDir = fixturesPath('tmp', 'lint-worker');

// The worker module reads `parentPort` and `workerData` from
// `node:worker_threads` at import time. Mocking them runs the worker's
// message handling in the main thread, where Jest can instrument it, and the
// `EventEmitter` stands in for the real `MessagePort`.
class FakeParentPort extends EventEmitter {
	postMessage(message) {
		this.emit('posted', message);
	}
}

const port = new FakeParentPort();

// An inline plugin may only be used here because no real thread boundary is
// involved. Throwing outside a PostCSS `walk*` callback keeps the thrown
// value as is; a non-`Error` value exercises the worker's serialization
// fallback, and the `Error` with a `code` exercises custom-property carrying.
const throwOnMatchRule = Object.assign(
	() => (root) => {
		const file = root.source?.input.file ?? '';

		if (file.endsWith('throw-string.css')) {
			throw 'a non-error value';
		}

		if (file.endsWith('throw-error-code.css')) {
			throw Object.assign(new Error('task failed'), { code: 78 });
		}
	},
	{ ruleName: 'plugin/throw-on-match' },
);

jest.unstable_mockModule('node:worker_threads', () => ({
	parentPort: port,
	workerData: {
		options: {
			config: {
				plugins: [{ ruleName: 'plugin/throw-on-match', rule: throwOnMatchRule }],
				rules: {
					'block-no-empty': true,
					'plugin/throw-on-match': true,
					'selector-attribute-quotes': 'always',
				},
			},
		},
	},
}));

await import('../lintWorker.mjs');

const lintInWorker = (files) => {
	const response = new Promise((resolve) => port.once('posted', resolve));

	port.emit('message', { files });

	return response;
};

beforeAll(async () => {
	await fs.mkdir(cssTmpDir, { recursive: true });
	await fs.writeFile(path.join(cssTmpDir, 'clean.css'), 'a { color: #fff; }\n');
	await fs.writeFile(path.join(cssTmpDir, 'empty-block.css'), 'a {}\n');
	await fs.writeFile(path.join(cssTmpDir, 'broken.css'), 'a { color: #fff;\n');
	await fs.writeFile(path.join(cssTmpDir, 'parse-error.css'), 'a[=] { color: #fff; }\n');
	await fs.writeFile(path.join(cssTmpDir, 'throw-string.css'), 'a { top: 0; }\n');
	await fs.writeFile(path.join(cssTmpDir, 'throw-error-code.css'), 'a { top: 0; }\n');
});

afterAll(async () => {
	await fs.rm(cssTmpDir, { recursive: true });
});

it('lints a task and posts one transferable result per file', async () => {
	const cleanFile = path.join(cssTmpDir, 'clean.css');
	const emptyBlockFile = path.join(cssTmpDir, 'empty-block.css');

	const response = await lintInWorker([cleanFile, emptyBlockFile]);

	expect(response.error).toBeUndefined();
	expect(response.results).toHaveLength(2);

	const [clean, emptyBlock] = response.results;

	expect(clean).toMatchObject({ source: cleanFile, errored: false, warnings: [] });
	expect(emptyBlock).toMatchObject({
		source: emptyBlockFile,
		errored: true,
		warnings: [expect.objectContaining({ rule: 'block-no-empty' })],
	});

	// The stub keeps only the fields the main thread reads after linting.
	expect(Object.keys(emptyBlock._postcssResult)).toEqual(['stylelint']);
	expect(Object.keys(emptyBlock._postcssResult.stylelint).sort()).toEqual([
		'fixersData',
		'ruleMetadata',
		'stylelintError',
		'stylelintWarning',
	]);
	expect(emptyBlock._postcssResult.stylelint.stylelintError).toBe(true);

	// The whole response must survive a real `postMessage()`.
	expect(() => structuredClone(response)).not.toThrow();
});

it('maps parse errors to plain transferable objects', async () => {
	const parseErrorFile = path.join(cssTmpDir, 'parse-error.css');

	const response = await lintInWorker([parseErrorFile]);

	expect(response.results).toHaveLength(1);
	expect(response.results[0].parseErrors).toEqual([
		{
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 22,
			text: expect.stringContaining('Cannot parse selector'),
			stylelintType: 'parseError',
		},
	]);
	expect(() => structuredClone(response)).not.toThrow();
});

it('posts a CSS syntax error result without a PostCSS result', async () => {
	const brokenFile = path.join(cssTmpDir, 'broken.css');

	const response = await lintInWorker([brokenFile]);

	expect(response.results).toHaveLength(1);
	expect(response.results[0]).toMatchObject({
		source: brokenFile,
		errored: true,
		warnings: [expect.objectContaining({ rule: 'CssSyntaxError' })],
	});
	expect(response.results[0]._postcssResult).toBeUndefined();
	expect(() => structuredClone(response)).not.toThrow();
});

it('posts a serialized error when a task fails', async () => {
	const response = await lintInWorker([path.join(cssTmpDir, 'does-not-exist.css')]);

	expect(response.results).toBeUndefined();
	expect(response.error).toMatchObject({
		name: 'Error',
		message: expect.stringContaining('does-not-exist.css'),
		stack: expect.stringContaining('Error'),
		properties: expect.objectContaining({ code: 'ENOENT' }),
	});
	expect(() => structuredClone(response)).not.toThrow();
});

it('carries custom error properties across the serialization', async () => {
	const response = await lintInWorker([path.join(cssTmpDir, 'throw-error-code.css')]);

	expect(response.error).toMatchObject({
		name: 'Error',
		message: 'task failed',
		properties: { code: 78 },
	});
	expect(() => structuredClone(response)).not.toThrow();
});

it('serializes a thrown non-error value', async () => {
	const response = await lintInWorker([path.join(cssTmpDir, 'throw-string.css')]);

	expect(response.error).toMatchObject({
		name: 'Error',
		message: 'a non-error value',
		stack: undefined,
		properties: {},
	});
	expect(() => structuredClone(response)).not.toThrow();
});
