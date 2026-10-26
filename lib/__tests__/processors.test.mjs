import { before, describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

import safeChdir from '../testUtils/safeChdir.mjs';
import standalone from '../standalone.mjs';

const fixturesPath = fileURLToPath(new URL('./fixtures', import.meta.url));

describe('postprocess transforms result', () => {
	let results;

	before(async () => {
		const data = await standalone({
			code: 'a {}\nb { color: pink }\n',
			config: {
				extends: './config-block-no-empty.json',
				processors: ['./postprocess-remap-location.mjs'],
			},
			configBasedir: fixturesPath,
		});

		results = data.results;
	});

	it('number of results', (t) => {
		t.assert.strictEqual(results.length, 1);
	});

	it('number of warnings', (t) => {
		t.assert.strictEqual(results[0].warnings.length, 1);
	});

	it('warning rule', (t) => {
		t.assert.strictEqual(results[0].warnings[0].rule, 'block-no-empty');
	});

	it('warning line', (t) => {
		t.assert.strictEqual(results[0].warnings[0].line, 1);
	});

	it('successfully modified warning end line', (t) => {
		t.assert.strictEqual(results[0].warnings[0].endLine, 6);
	});
});

describe('multiple processors', () => {
	let results;

	before(async () => {
		const data = await standalone({
			code: 'a {}\nb { color: pink }\n',
			config: {
				extends: './config-block-no-empty.json',
				processors: ['./postprocess-update-text.mjs', './postprocess-remap-location.mjs'],
			},
			configBasedir: fixturesPath,
		});

		results = data.results;
	});

	it('number of results', (t) => {
		t.assert.strictEqual(results.length, 1);
	});

	it('number of warnings', (t) => {
		t.assert.strictEqual(results[0].warnings.length, 1);
	});

	it('warning rule', (t) => {
		t.assert.strictEqual(results[0].warnings[0].rule, 'block-no-empty');
	});

	it('warning line', (t) => {
		t.assert.strictEqual(results[0].warnings[0].line, 1);
	});

	it('successfully modified warning end line', (t) => {
		t.assert.strictEqual(results[0].warnings[0].endLine, 6);
	});

	it('successfully modified warning text', (t) => {
		t.assert.strictEqual(
			results[0].warnings[0].text,
			'Empty block (block-no-empty) on rule `a {}`',
		);
	});
});

describe('loading processors (and extend) from process.cwd', () => {
	safeChdir(new URL('.', import.meta.url));

	it('works', async (t) => {
		const { results } = await standalone({
			code: 'a {}\nb { color: pink }\n',
			config: {
				extends: './fixtures/config-block-no-empty.json',
				processors: [
					'./fixtures/postprocess-update-text.mjs',
					'./fixtures/postprocess-remap-location.mjs',
				],
			},
		});

		t.assert.strictEqual(results[0].warnings[0].line, 1);
		t.assert.strictEqual(results[0].warnings[0].endLine, 6);
		t.assert.strictEqual(
			results[0].warnings[0].text,
			'Empty block (block-no-empty) on rule `a {}`',
		);
	});
});

describe('loading processors (and extend) from options.cwd', () => {
	it('works', async (t) => {
		const { results } = await standalone({
			code: 'a {}\nb { color: pink }\n',
			config: {
				extends: './fixtures/config-block-no-empty.json',
				processors: [
					'./fixtures/postprocess-update-text.mjs',
					'./fixtures/postprocess-remap-location.mjs',
				],
			},
			cwd: fileURLToPath(new URL('.', import.meta.url)),
		});

		t.assert.strictEqual(results[0].warnings[0].line, 1);
		t.assert.strictEqual(results[0].warnings[0].endLine, 6);
		t.assert.strictEqual(
			results[0].warnings[0].text,
			'Empty block (block-no-empty) on rule `a {}`',
		);
	});
});

describe('processor gets to modify result on CssSyntaxError', () => {
	let results;

	before(async () => {
		const data = await standalone({
			code: "a {}\nb { color: 'pink }\n",
			config: {
				rules: { 'block-no-empty': true },
				processors: ['./postprocess-remap-location.mjs'],
			},
			configBasedir: fixturesPath,
		});

		results = data.results;
	});

	it('CssSyntaxError occurred', (t) => {
		t.assert.strictEqual(results[0].warnings.length, 1);
		t.assert.strictEqual(results[0].warnings[0].rule, 'CssSyntaxError');
	});

	it('successfully modified warning end line', (t) => {
		t.assert.strictEqual(results[0].warnings[0].endLine, 2);
	});
});

describe('throw error when processor is not a function', () => {
	it('works', (t) => {
		return t.assert.rejects(
			standalone({
				code: 'a { color: pink }\n',
				config: {
					processors: ['./processor-not-a-function.mjs'],
				},
				configBasedir: fixturesPath,
			}),
			{
				message: /processor-not-a-function\.mjs" must be a function/,
			},
		);
	});
});

describe('throw error when processor does not have name', () => {
	it('works', (t) => {
		return t.assert.rejects(
			standalone({
				code: 'a { color: pink }\n',
				config: {
					processors: ['./postprocess-empty.mjs'],
				},
				configBasedir: fixturesPath,
			}),
			{
				message: /postprocess-empty\.mjs" must return an object with the "name" property/,
			},
		);
	});
});

describe('throw error when processor does not contain postprocess', () => {
	it('works', (t) => {
		return t.assert.rejects(
			standalone({
				code: 'a { color: pink }\n',
				config: {
					processors: ['./postprocess-unknown-function.mjs'],
				},
				configBasedir: fixturesPath,
			}),
			{
				message:
					/postprocess-unknown-function\.mjs" must return an object with the "postprocess" property/,
			},
		);
	});
});
