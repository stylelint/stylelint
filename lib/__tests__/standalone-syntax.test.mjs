import { describe, it } from 'node:test';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import replaceBackslashes from '../testUtils/replaceBackslashes.mjs';
import standalone from '../standalone.mjs';
import stringFormatter from '../formatters/stringFormatter.mjs';

const fixturesPath = replaceBackslashes(new URL('./fixtures', import.meta.url));

const config = (additionalProps) => ({
	rules: {
		'block-no-empty': true,
	},
	...additionalProps,
});

it('standalone with postcss-safe-parser', async () => {
	const { results } = await standalone({
		files: `${fixturesPath}/syntax_error.*`,
		config: {
			rules: {},
		},
		fix: 'lax',
	});

	assert.equal(results.length, 5);

	for (const result of results) {
		assert.ok(!result.errored);
		assert.equal(result.warnings.length, 0);

		const { root } = result._postcssResult;
		const { input } = root.source;

		assert.notEqual(root.toString(), input.css);

		// restore file
		await writeFile(input.file, input.css);
	}
});

it('standalone with path to custom parser in CommonJS', async () => {
	const { results } = await standalone({
		config: config(),
		customSyntax: `${fixturesPath}/custom-parser.cjs`,
		code: '.foo { width: 200px }\n.bar {',
		formatter: stringFormatter,
	});

	assert.equal(results.length, 1);
	assert.equal(results[0].warnings.length, 1);
	assert.partialDeepStrictEqual(results[0].warnings[0], {
		line: 2,
		column: 6,
		rule: 'block-no-empty',
	});
});

it('standalone with path to custom parser in ESM', async () => {
	const { results } = await standalone({
		config: config(),
		customSyntax: `${fixturesPath}/custom-parser.mjs`,
		code: '.foo { width: 200px }\n.bar {',
		formatter: stringFormatter,
	});

	assert.equal(results.length, 1);
	assert.equal(results[0].warnings.length, 1);
	assert.partialDeepStrictEqual(results[0].warnings[0], {
		line: 2,
		column: 6,
		rule: 'block-no-empty',
	});
});

it('standalone with path to custom syntax in CommonJS', async () => {
	const { results } = await standalone({
		config: config(),
		customSyntax: `${fixturesPath}/custom-syntax.cjs`,
		code: '$foo: bar; // foo;\nb {}',
		formatter: stringFormatter,
	});

	assert.equal(results.length, 1);
	assert.equal(results[0].warnings.length, 1);
	assert.partialDeepStrictEqual(results[0].warnings[0], {
		line: 2,
		column: 3,
		rule: 'block-no-empty',
	});
});

it('standalone with path to custom syntax in ESM', async () => {
	const { results } = await standalone({
		config: config(),
		customSyntax: `${fixturesPath}/custom-syntax.mjs`,
		code: '$foo: bar; // foo;\nb {}',
		formatter: stringFormatter,
	});

	assert.equal(results.length, 1);
	assert.equal(results[0].warnings.length, 1);
	assert.partialDeepStrictEqual(results[0].warnings[0], {
		line: 2,
		column: 3,
		rule: 'block-no-empty',
	});
});

it('standalone with custom syntax as npm package name', async () => {
	const { results } = await standalone({
		config: config(),
		customSyntax: 'postcss-scss',
		code: '$foo: bar; // foo;\nb {}',
		formatter: stringFormatter,
	});

	assert.equal(results.length, 1);
	assert.equal(results[0].warnings.length, 1);
	assert.partialDeepStrictEqual(results[0].warnings[0], {
		line: 2,
		column: 3,
		rule: 'block-no-empty',
	});
});

it('standalone with custom syntax as npm package', async () => {
	const { results } = await standalone({
		config: config(),
		customSyntax: await import('postcss-scss'),
		code: '$foo: bar; // foo;\nb {}',
		formatter: stringFormatter,
	});

	assert.equal(results.length, 1);
	assert.equal(results[0].warnings.length, 1);
	assert.partialDeepStrictEqual(results[0].warnings[0], {
		line: 2,
		column: 3,
		rule: 'block-no-empty',
	});
});

it('standalone with custom syntax as npm package and function export', async () => {
	const { results } = await standalone({
		config: config(),
		customSyntax: (await import('postcss-html')).default,
		code: '<style>foo {}</style>',
		formatter: stringFormatter,
	});

	assert.equal(results.length, 1);
	assert.equal(results[0].warnings.length, 1);
	assert.partialDeepStrictEqual(results[0].warnings[0], {
		line: 1,
		column: 12,
		rule: 'block-no-empty',
	});
});

it('rejects on unknown custom syntax option', async () => {
	await assert.rejects(
		standalone({
			customSyntax: 'unknown-module',
			code: '',
			config: config(),
		}),
		{ message: /unknown-module/ },
	);
});

describe('customSyntax set in the config', () => {
	it('standalone with path to custom parser in CommonJS', async () => {
		const { results } = await standalone({
			config: config({ customSyntax: `${fixturesPath}/custom-parser.cjs` }),
			code: '.foo { width: 200px }\n.bar {',
			formatter: stringFormatter,
		});

		assert.equal(results.length, 1);
		assert.equal(results[0].warnings.length, 1);
		assert.partialDeepStrictEqual(results[0].warnings[0], {
			line: 2,
			column: 6,
			rule: 'block-no-empty',
		});
	});

	it('standalone with path to custom parser in ESM', async () => {
		const { results } = await standalone({
			config: config({ customSyntax: `${fixturesPath}/custom-parser.mjs` }),
			code: '.foo { width: 200px }\n.bar {',
			formatter: stringFormatter,
		});

		assert.equal(results.length, 1);
		assert.equal(results[0].warnings.length, 1);
		assert.partialDeepStrictEqual(results[0].warnings[0], {
			line: 2,
			column: 6,
			rule: 'block-no-empty',
		});
	});

	it('standalone with custom syntax as npm package name', async () => {
		const { results } = await standalone({
			config: config({ customSyntax: 'postcss-scss' }),
			code: '$foo: bar; // foo;\nb {}',
			formatter: stringFormatter,
		});

		assert.equal(results.length, 1);
		assert.equal(results[0].warnings.length, 1);
		assert.partialDeepStrictEqual(results[0].warnings[0], {
			line: 2,
			column: 3,
			rule: 'block-no-empty',
		});
	});

	it('standalone with bare-package custom syntax not reachable from configBasedir or cwd', async () => {
		const isolatedDir = await mkdtemp(join(tmpdir(), 'stylelint-isolated-'));

		try {
			const { results } = await standalone({
				config: config({ customSyntax: 'postcss-scss' }),
				configBasedir: isolatedDir,
				cwd: isolatedDir,
				code: '$foo: bar; // foo;\nb {}',
				formatter: stringFormatter,
			});

			assert.equal(results.length, 1);
			assert.equal(results[0].warnings.length, 1);
			assert.partialDeepStrictEqual(results[0].warnings[0], {
				line: 2,
				column: 3,
				rule: 'block-no-empty',
			});
		} finally {
			await rm(isolatedDir, { recursive: true, force: true });
		}
	});

	it('standalone with custom syntax as npm package', async () => {
		const { results } = await standalone({
			config: config({ customSyntax: await import('postcss-scss') }),
			code: '$foo: bar; // foo;\nb {}',
			formatter: stringFormatter,
		});

		assert.equal(results.length, 1);
		assert.equal(results[0].warnings.length, 1);
		assert.partialDeepStrictEqual(results[0].warnings[0], {
			line: 2,
			column: 3,
			rule: 'block-no-empty',
		});
	});

	it('standalone with path to custom syntax in CommonJS', async () => {
		const { results } = await standalone({
			config: config({ customSyntax: `${fixturesPath}/custom-syntax.cjs` }),
			code: '$foo: bar; // foo;\nb {}',
			formatter: stringFormatter,
		});

		assert.equal(results.length, 1);
		assert.equal(results[0].warnings.length, 1);
		assert.partialDeepStrictEqual(results[0].warnings[0], {
			line: 2,
			column: 3,
			rule: 'block-no-empty',
		});
	});

	it('standalone with path to custom syntax in ESM', async () => {
		const { results } = await standalone({
			config: config({ customSyntax: `${fixturesPath}/custom-syntax.mjs` }),
			code: '$foo: bar; // foo;\nb {}',
			formatter: stringFormatter,
		});

		assert.equal(results.length, 1);
		assert.equal(results[0].warnings.length, 1);
		assert.partialDeepStrictEqual(results[0].warnings[0], {
			line: 2,
			column: 3,
			rule: 'block-no-empty',
		});
	});

	it('standalone with path to custom syntax relative from "configBasedir"', async () => {
		const { results } = await standalone({
			config: config({ customSyntax: './custom-syntax.cjs' }),
			configBasedir: fixturesPath,
			code: '$foo: bar; // foo;\nb {}',
			formatter: stringFormatter,
		});

		assert.equal(results.length, 1);
		assert.equal(results[0].warnings.length, 1);
		assert.partialDeepStrictEqual(results[0].warnings[0], {
			line: 2,
			column: 3,
			rule: 'block-no-empty',
		});
	});

	it('rejects on unknown custom syntax option', async () => {
		await assert.rejects(
			standalone({
				code: '',
				config: config({ customSyntax: 'unknown-module' }),
			}),
			{ message: /unknown-module/ },
		);
	});

	it('rejects on invalid custom syntax object', async () => {
		await assert.rejects(
			standalone({
				code: '',
				config: config({ customSyntax: {} }),
			}),
			{
				message:
					'An object provided to the "customSyntax" option must have a "parse" property. Ensure the "parse" property exists and its value is a function.',
			},
		);
	});

	it('rejects on invalid custom syntax type', async () => {
		await assert.rejects(
			standalone({
				code: '',
				config: config({ customSyntax: true }),
			}),
			{ message: 'Custom syntax must be a string or a Syntax object' },
		);
	});
});
