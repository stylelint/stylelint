import { writeFile } from 'node:fs/promises';

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
		fix: true,
	});

	expect(results).toHaveLength(5);

	for (const result of results) {
		expect(result.errored).toBeFalsy();
		expect(result.warnings).toHaveLength(0);

		const { root } = result._postcssResult;
		const { input } = root.source;

		expect(root.toString()).not.toBe(input.css);

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

	expect(results).toHaveLength(1);
	expect(results[0].warnings).toHaveLength(1);
	expect(results[0].warnings[0]).toMatchObject({ line: 2, column: 6, rule: 'block-no-empty' });
});

it('standalone with path to custom parser in ESM', async () => {
	const { results } = await standalone({
		config: config(),
		customSyntax: `${fixturesPath}/custom-parser.mjs`,
		code: '.foo { width: 200px }\n.bar {',
		formatter: stringFormatter,
	});

	expect(results).toHaveLength(1);
	expect(results[0].warnings).toHaveLength(1);
	expect(results[0].warnings[0]).toMatchObject({ line: 2, column: 6, rule: 'block-no-empty' });
});

it('standalone with path to custom syntax in CommonJS', async () => {
	const { results } = await standalone({
		config: config(),
		customSyntax: `${fixturesPath}/custom-syntax.cjs`,
		code: '$foo: bar; // foo;\nb {}',
		formatter: stringFormatter,
	});

	expect(results).toHaveLength(1);
	expect(results[0].warnings).toHaveLength(1);
	expect(results[0].warnings[0]).toMatchObject({ line: 2, column: 3, rule: 'block-no-empty' });
});

it('standalone with path to custom syntax in ESM', async () => {
	const { results } = await standalone({
		config: config(),
		customSyntax: `${fixturesPath}/custom-syntax.mjs`,
		code: '$foo: bar; // foo;\nb {}',
		formatter: stringFormatter,
	});

	expect(results).toHaveLength(1);
	expect(results[0].warnings).toHaveLength(1);
	expect(results[0].warnings[0]).toMatchObject({ line: 2, column: 3, rule: 'block-no-empty' });
});

it('standalone with custom syntax as npm package name', async () => {
	const { results } = await standalone({
		config: config(),
		customSyntax: 'postcss-scss',
		code: '$foo: bar; // foo;\nb {}',
		formatter: stringFormatter,
	});

	expect(results).toHaveLength(1);
	expect(results[0].warnings).toHaveLength(1);
	expect(results[0].warnings[0]).toMatchObject({ line: 2, column: 3, rule: 'block-no-empty' });
});

it('standalone with custom syntax as npm package', async () => {
	const { results } = await standalone({
		config: config(),
		customSyntax: await import('postcss-scss'),
		code: '$foo: bar; // foo;\nb {}',
		formatter: stringFormatter,
	});

	expect(results).toHaveLength(1);
	expect(results[0].warnings).toHaveLength(1);
	expect(results[0].warnings[0]).toMatchObject({ line: 2, column: 3, rule: 'block-no-empty' });
});

it('rejects on unknown custom syntax option', async () => {
	await expect(
		standalone({
			customSyntax: 'unknown-module',
			code: '',
			config: config(),
		}),
	).rejects.toThrow(
		'Cannot resolve custom syntax module "unknown-module". Check that module "unknown-module" is available and spelled correctly.',
	);
});

describe('customSyntax set in the config', () => {
	it('standalone with path to custom parser in CommonJS', async () => {
		const { results } = await standalone({
			config: config({ customSyntax: `${fixturesPath}/custom-parser.cjs` }),
			code: '.foo { width: 200px }\n.bar {',
			formatter: stringFormatter,
		});

		expect(results).toHaveLength(1);
		expect(results[0].warnings).toHaveLength(1);
		expect(results[0].warnings[0]).toMatchObject({ line: 2, column: 6, rule: 'block-no-empty' });
	});

	it('standalone with path to custom parser in ESM', async () => {
		const { results } = await standalone({
			config: config({ customSyntax: `${fixturesPath}/custom-parser.mjs` }),
			code: '.foo { width: 200px }\n.bar {',
			formatter: stringFormatter,
		});

		expect(results).toHaveLength(1);
		expect(results[0].warnings).toHaveLength(1);
		expect(results[0].warnings[0]).toMatchObject({ line: 2, column: 6, rule: 'block-no-empty' });
	});

	it('standalone with custom syntax as npm package name', async () => {
		const { results } = await standalone({
			config: config({ customSyntax: 'postcss-scss' }),
			code: '$foo: bar; // foo;\nb {}',
			formatter: stringFormatter,
		});

		expect(results).toHaveLength(1);
		expect(results[0].warnings).toHaveLength(1);
		expect(results[0].warnings[0]).toMatchObject({ line: 2, column: 3, rule: 'block-no-empty' });
	});

	it('standalone with custom syntax as npm package', async () => {
		const { results } = await standalone({
			config: config({ customSyntax: await import('postcss-scss') }),
			code: '$foo: bar; // foo;\nb {}',
			formatter: stringFormatter,
		});

		expect(results).toHaveLength(1);
		expect(results[0].warnings).toHaveLength(1);
		expect(results[0].warnings[0]).toMatchObject({ line: 2, column: 3, rule: 'block-no-empty' });
	});

	it('standalone with path to custom syntax in CommonJS', async () => {
		const { results } = await standalone({
			config: config({ customSyntax: `${fixturesPath}/custom-syntax.cjs` }),
			code: '$foo: bar; // foo;\nb {}',
			formatter: stringFormatter,
		});

		expect(results).toHaveLength(1);
		expect(results[0].warnings).toHaveLength(1);
		expect(results[0].warnings[0]).toMatchObject({ line: 2, column: 3, rule: 'block-no-empty' });
	});

	it('standalone with path to custom syntax in ESM', async () => {
		const { results } = await standalone({
			config: config({ customSyntax: `${fixturesPath}/custom-syntax.mjs` }),
			code: '$foo: bar; // foo;\nb {}',
			formatter: stringFormatter,
		});

		expect(results).toHaveLength(1);
		expect(results[0].warnings).toHaveLength(1);
		expect(results[0].warnings[0]).toMatchObject({ line: 2, column: 3, rule: 'block-no-empty' });
	});

	it('standalone with path to custom syntax relative from "configBasedir"', async () => {
		const { results } = await standalone({
			config: config({ customSyntax: './custom-syntax.cjs' }),
			configBasedir: fixturesPath,
			code: '$foo: bar; // foo;\nb {}',
			formatter: stringFormatter,
		});

		expect(results).toHaveLength(1);
		expect(results[0].warnings).toHaveLength(1);
		expect(results[0].warnings[0]).toMatchObject({ line: 2, column: 3, rule: 'block-no-empty' });
	});

	it('rejects on unknown custom syntax option', async () => {
		await expect(
			standalone({
				code: '',
				config: config({ customSyntax: 'unknown-module' }),
			}),
		).rejects.toThrow(
			'Cannot resolve custom syntax module "unknown-module". Check that module "unknown-module" is available and spelled correctly.',
		);
	});

	it('rejects on invalid custom syntax object', async () => {
		await expect(
			standalone({
				code: '',
				config: config({ customSyntax: {} }),
			}),
		).rejects.toThrow(
			'An object provided to the "customSyntax" option must have a "parse" property. Ensure the "parse" property exists and its value is a function.',
		);
	});

	it('rejects on invalid custom syntax type', async () => {
		await expect(
			standalone({
				code: '',
				config: config({ customSyntax: true }),
			}),
		).rejects.toThrow('Custom syntax must be a string or a Syntax object');
	});
});
