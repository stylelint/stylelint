import { fileURLToPath } from 'node:url';

import safeChdir from '../testUtils/safeChdir.mjs';
import standalone from '../standalone.mjs';

const fixturesPath = fileURLToPath(new URL('./fixtures', import.meta.url));

describe('postprocess transforms result', () => {
	let results;

	beforeAll(async () => {
		const data = await standalone({
			code: 'a {}\nb { color: pink }\n',
			config: {
				extends: './config-block-no-empty',
				processors: ['./postprocess-remap-location.mjs'],
			},
			configBasedir: fixturesPath,
		});

		results = data.results;
	});

	it('number of results', () => {
		expect(results).toHaveLength(1);
	});

	it('number of warnings', () => {
		expect(results[0].warnings).toHaveLength(1);
	});

	it('warning rule', () => {
		expect(results[0].warnings[0].rule).toBe('block-no-empty');
	});

	it('warning line', () => {
		expect(results[0].warnings[0].line).toBe(1);
	});

	it('successfully modified warning end line', () => {
		expect(results[0].warnings[0].endLine).toBe(6);
	});
});

describe('multiple processors', () => {
	let results;

	beforeAll(async () => {
		const data = await standalone({
			code: 'a {}\nb { color: pink }\n',
			config: {
				extends: './config-block-no-empty',
				processors: ['./postprocess-update-text.mjs', './postprocess-remap-location.mjs'],
			},
			configBasedir: fixturesPath,
		});

		results = data.results;
	});

	it('number of results', () => {
		expect(results).toHaveLength(1);
	});

	it('number of warnings', () => {
		expect(results[0].warnings).toHaveLength(1);
	});

	it('warning rule', () => {
		expect(results[0].warnings[0].rule).toBe('block-no-empty');
	});

	it('warning line', () => {
		expect(results[0].warnings[0].line).toBe(1);
	});

	it('successfully modified warning end line', () => {
		expect(results[0].warnings[0].endLine).toBe(6);
	});

	it('successfully modified warning text', () => {
		expect(results[0].warnings[0].text).toBe(
			'Unexpected empty block (block-no-empty) on rule `a {}`',
		);
	});
});

describe('loading processors (and extend) from process.cwd', () => {
	safeChdir(new URL('.', import.meta.url));

	it('works', async () => {
		const { results } = await standalone({
			code: 'a {}\nb { color: pink }\n',
			config: {
				extends: './fixtures/config-block-no-empty',
				processors: [
					'./fixtures/postprocess-update-text.mjs',
					'./fixtures/postprocess-remap-location.mjs',
				],
			},
		});

		expect(results[0].warnings[0].line).toBe(1);
		expect(results[0].warnings[0].endLine).toBe(6);
		expect(results[0].warnings[0].text).toBe(
			'Unexpected empty block (block-no-empty) on rule `a {}`',
		);
	});
});

describe('loading processors (and extend) from options.cwd', () => {
	it('works', async () => {
		const { results } = await standalone({
			code: 'a {}\nb { color: pink }\n',
			config: {
				extends: './fixtures/config-block-no-empty',
				processors: [
					'./fixtures/postprocess-update-text.mjs',
					'./fixtures/postprocess-remap-location.mjs',
				],
			},
			cwd: fileURLToPath(new URL('.', import.meta.url)),
		});

		expect(results[0].warnings[0].line).toBe(1);
		expect(results[0].warnings[0].endLine).toBe(6);
		expect(results[0].warnings[0].text).toBe(
			'Unexpected empty block (block-no-empty) on rule `a {}`',
		);
	});
});

describe('processor gets to modify result on CssSyntaxError', () => {
	let results;

	beforeAll(async () => {
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

	it('CssSyntaxError occurred', () => {
		expect(results[0].warnings).toHaveLength(1);
		expect(results[0].warnings[0].rule).toBe('CssSyntaxError');
	});

	it('successfully modified warning end line', () => {
		expect(results[0].warnings[0].endLine).toBe(2);
	});
});

describe('throw error when processor is not a function', () => {
	it('works', () => {
		return expect(
			standalone({
				code: 'a { color: pink }\n',
				config: {
					processors: ['./config-without-rules.json'],
				},
				configBasedir: fixturesPath,
			}),
		).rejects.toThrow(
			expect.objectContaining({
				message: expect.stringContaining('config-without-rules.json" must be a function'),
			}),
		);
	});
});

describe('throw error when processor does not have name', () => {
	it('works', () => {
		return expect(
			standalone({
				code: 'a { color: pink }\n',
				config: {
					processors: ['./postprocess-empty.mjs'],
				},
				configBasedir: fixturesPath,
			}),
		).rejects.toThrow(
			expect.objectContaining({
				message: expect.stringContaining(
					'postprocess-empty.mjs" must return an object with the "name" property',
				),
			}),
		);
	});
});

describe('throw error when processor does not contain postprocess', () => {
	it('works', () => {
		return expect(
			standalone({
				code: 'a { color: pink }\n',
				config: {
					processors: ['./postprocess-unknown-function.mjs'],
				},
				configBasedir: fixturesPath,
			}),
		).rejects.toThrow(
			expect.objectContaining({
				message: expect.stringContaining(
					'postprocess-unknown-function.mjs" must return an object with the "postprocess" property',
				),
			}),
		);
	});
});
