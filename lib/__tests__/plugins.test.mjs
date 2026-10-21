import { beforeEach, describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import process from 'node:process';

import postcss from 'postcss';

import safeChdir from '../testUtils/safeChdir.mjs';
import stylelint from '../index.mjs';

const dirname = import.meta.dirname;

const absolutePath = (relativePath) => fileURLToPath(new URL(relativePath, import.meta.url));

const cssWithFoo = '.foo {}';

const cssWithoutFoo = '.bar {}';

const cssWithFooAndBar = '.foo {}\n.bar {}';

const configRelative = {
	plugins: ['./fixtures/plugin-warn-about-foo.mjs'],
	rules: {
		'plugin/warn-about-foo': 'always',
		'block-no-empty': true,
	},
};

const configAbsolute = {
	plugins: [absolutePath('./fixtures/plugin-warn-about-foo.mjs')],
	rules: {
		'plugin/warn-about-foo': 'always',
		'block-no-empty': true,
	},
};

const configExtendRelative = {
	extends: ['./fixtures/config-relative-plugin.json'],
};

const configRelativeAndExtendRelative = {
	extends: ['./fixtures/config-relative-plugin.json'],
	plugins: ['./fixtures/plugin-warn-about-bar.mjs'],
	rules: {
		'plugin/warn-about-bar': 'always',
	},
};

const processorRelative = postcss().use(
	stylelint({ config: configRelative, configBasedir: dirname }),
);
const processorAbsolute = postcss().use(stylelint({ config: configAbsolute }));
const processorExtendRelative = postcss().use(
	stylelint({ config: configExtendRelative, configBasedir: dirname }),
);
const processorRelativeAndExtendRelative = postcss().use(
	stylelint({
		config: configRelativeAndExtendRelative,
		configBasedir: dirname,
	}),
);

beforeEach((t) => {
	t.mock.method(process, 'emitWarning', () => {});
});

it('one plugin runs', async (t) => {
	const result = await processorRelative.process(cssWithFoo, { from: undefined });

	t.assert.strictEqual(result.warnings().length, 2);
	t.assert.strictEqual(result.warnings()[0].text, 'found .foo (plugin/warn-about-foo)');
	t.assert.ok(result.warnings()[0].node);
});

it('another plugin runs', async (t) => {
	const result = await processorRelative.process(cssWithoutFoo, { from: undefined });

	t.assert.strictEqual(result.warnings().length, 1);
	t.assert.strictEqual(result.warnings()[0].text, 'Empty block (block-no-empty)');
});

it('plugin with rule metadata', async (t) => {
	const result = await processorRelative.process(cssWithFoo, { from: undefined });

	t.assert.deepStrictEqual(result.stylelint.ruleMetadata, {
		'plugin/warn-about-foo': {
			url: 'https://github.com/stylelint/stylelint-foo-plugin/warn-about-foo',
		},
		'block-no-empty': {
			url: 'https://stylelint.io/user-guide/rules/block-no-empty',
		},
	});
});

it('plugin with absolute path and no configBasedir', async (t) => {
	const result = await processorAbsolute.process(cssWithFoo, { from: undefined });

	t.assert.strictEqual(result.warnings().length, 2);
	t.assert.strictEqual(result.warnings()[0].text, 'found .foo (plugin/warn-about-foo)');
	t.assert.ok(result.warnings()[0].node);
});

it('config extending another config that invokes a plugin with a relative path', async (t) => {
	const result = await processorExtendRelative.process(cssWithFoo, { from: undefined });

	t.assert.strictEqual(result.warnings().length, 1);
	t.assert.strictEqual(result.warnings()[0].text, 'found .foo (plugin/warn-about-foo)');
	t.assert.ok(result.warnings()[0].node);
});

it('config with its own plugins extending another config that invokes a plugin with a relative path', async (t) => {
	const result = await processorRelativeAndExtendRelative.process(cssWithFooAndBar, {
		from: undefined,
	});

	t.assert.strictEqual(result.warnings().length, 2);
	t.assert.strictEqual(result.warnings()[0].text, 'found .bar (plugin/warn-about-bar)');
	t.assert.strictEqual(result.warnings()[1].text, 'found .foo (plugin/warn-about-foo)');
	t.assert.ok(result.warnings()[0].node);
});

it('plugin with ESM import()', async (t) => {
	const result = await postcss()
		.use(
			stylelint({
				config: {
					plugins: [(await import('./fixtures/plugin-warn-about-foo.mjs')).default],
					rules: {
						'plugin/warn-about-foo': 'always',
						'block-no-empty': true,
					},
				},
			}),
		)
		.process(cssWithFoo, { from: undefined });

	t.assert.strictEqual(result.warnings().length, 2);
	t.assert.strictEqual(result.warnings()[0].text, 'found .foo (plugin/warn-about-foo)');
	t.assert.strictEqual(result.warnings()[1].text, 'Empty block (block-no-empty)');
	t.assert.ok(result.warnings()[0].node);
});

it('ESM plugin', async (t) => {
	const config = {
		plugins: [absolutePath('./fixtures/plugin-fixer.mjs')],
		rules: { 'plugin/selector-no-foo': true },
	};
	const css = '.foo {}';

	const result = await postcss().use(stylelint({ config })).process(css, { from: undefined });

	t.assert.strictEqual(result.warnings().length, 1);
});

describe('plugin using exposed rules via stylelint.rules', () => {
	const cssWithDirectiveNever = '/** @@check-color-named */ a { color: #000; }';
	const cssWithDirectiveAlways = '/** @@check-color-named */ a { color: black; }';
	const cssWithoutDirectiveNever = 'a { color: #000; }';
	const cssWithoutDirectiveAlways = 'a { color: black; }';
	const config = (expectation) => ({
		config: {
			plugins: [absolutePath('./fixtures/plugin-conditionally-check-color-named.mjs')],
			rules: {
				'plugin/conditionally-check-color-named': expectation,
			},
		},
	});

	it('with always expectation and never color', async (t) => {
		const result = await postcss()
			.use(stylelint(config('always-where-possible')))
			.process(cssWithDirectiveNever, { from: undefined });

		t.assert.strictEqual(result.warnings().length, 1);
		t.assert.strictEqual(result.warnings()[0].text, 'Expected "#000" to be "black" (color-named)');
	});

	it('with always expectation and always color', async (t) => {
		const result = await postcss()
			.use(stylelint(config('always-where-possible')))
			.process(cssWithDirectiveAlways, { from: undefined });

		t.assert.strictEqual(result.warnings().length, 0);
	});

	it('with never expectation and always color', async (t) => {
		const result = await postcss()
			.use(stylelint(config('never')))
			.process(cssWithDirectiveAlways, { from: undefined });

		t.assert.strictEqual(result.warnings().length, 1);
		t.assert.strictEqual(result.warnings()[0].text, 'Disallowed named color "black" (color-named)');
	});

	it('with never expectation and never color', async (t) => {
		const result = await postcss()
			.use(stylelint(config('never')))
			.process(cssWithDirectiveNever, { from: undefined });

		t.assert.strictEqual(result.warnings().length, 0);
	});

	it('with always expectation and never color without directive', async (t) => {
		const result = await postcss()
			.use(stylelint(config('always-where-possible')))
			.process(cssWithoutDirectiveNever, { from: undefined });

		t.assert.strictEqual(result.warnings().length, 0);
	});

	it('with always expectation and always color without directive', async (t) => {
		const result = await postcss()
			.use(stylelint(config('never')))
			.process(cssWithoutDirectiveAlways, { from: undefined });

		t.assert.strictEqual(result.warnings().length, 0);
	});
});

describe('module providing an array of plugins', () => {
	const config = {
		plugins: [absolutePath('./fixtures/plugin-array.mjs')],
		rules: {
			'plugin/conditionally-check-color-named': 'always-where-possible',
			'plugin/warn-about-foo': 'always',
		},
	};

	it('first plugin works', async (t) => {
		const result = await postcss()
			.use(stylelint(config))
			.process('@@check-color-named a { color: #000; }', { from: undefined });

		t.assert.strictEqual(result.warnings().length, 1);
		t.assert.strictEqual(result.warnings()[0].text, 'Expected "#000" to be "black" (color-named)');
	});

	it('second plugin works', async (t) => {
		const result = await postcss().use(stylelint(config)).process('.foo {}', { from: undefined });

		t.assert.strictEqual(result.warnings().length, 1);
		t.assert.strictEqual(result.warnings()[0].text, 'found .foo (plugin/warn-about-foo)');
	});
});

it('slashless plugin causes configuration error', async (t) => {
	const config = {
		plugins: [absolutePath('./fixtures/plugin-slashless-warn-about-foo.mjs')],
		rules: {
			'slashless-warn-about-foo': true,
		},
	};

	await t.assert.rejects(postcss().use(stylelint(config)).process('.foo {}', { from: undefined }), {
		message: /^stylelint requires plugin rules to be namespaced/,
	});
});

it('plugin with primary option array', async (t) => {
	const config = {
		plugins: [absolutePath('./fixtures/plugin-primary-array.mjs')],
		rules: {
			'plugin/primary-array': ['foo', 'bar'],
		},
	};

	const result = await postcss().use(stylelint(config)).process('a {}', { from: undefined });

	t.assert.strictEqual(result.warnings().length, 0);
});

it('plugin with primary option array within options array', async (t) => {
	const config = {
		plugins: [absolutePath('./fixtures/plugin-primary-array.mjs')],
		rules: {
			'plugin/primary-array': [['foo', 'bar'], { something: true }],
		},
	};

	const result = await postcss().use(stylelint(config)).process('a {}', { from: undefined });

	t.assert.strictEqual(result.warnings().length, 0);
});

it('plugin with async rule', async (t) => {
	const config = {
		plugins: [absolutePath('./fixtures/plugin-array.mjs')],
		rules: {
			'plugin/async': true,
		},
	};

	const result = await postcss().use(stylelint(config)).process('a {}', { from: undefined });

	t.assert.strictEqual(result.warnings().length, 1);
});

it('exposes the postcss module Stylelint uses on result.stylelint.postcss', async (t) => {
	const ruleName = 'plugin/capture-postcss';
	let receivedPostcss;

	await stylelint.lint({
		code: 'a {}',
		config: {
			plugins: [
				stylelint.createPlugin(ruleName, () => (root, result) => {
					receivedPostcss = result.stylelint.postcss;
				}),
			],
			rules: { [ruleName]: true },
		},
	});

	t.assert.strictEqual(receivedPostcss, postcss);
});

describe('loading a plugin from process.cwd', () => {
	safeChdir(dirname);

	let result;

	const config = {
		plugins: ['./fixtures/plugin-warn-about-foo.mjs'],
		rules: {
			'plugin/warn-about-foo': 'always',
		},
	};

	beforeEach(async () => {
		result = await postcss().use(stylelint(config)).process('.foo {}', { from: undefined });
	});

	it('error is caught', (t) => {
		t.assert.strictEqual(result.warnings().length, 1);
	});

	it('error is correct', (t) => {
		t.assert.strictEqual(result.warnings()[0].rule, 'plugin/warn-about-foo');
	});
});

describe('loading a plugin from options.cwd', () => {
	let result;

	const config = {
		plugins: ['./fixtures/plugin-warn-about-foo.mjs'],
		rules: {
			'plugin/warn-about-foo': 'always',
		},
	};

	beforeEach(async () => {
		result = await postcss()
			.use(stylelint({ cwd: dirname, config }))
			.process('.foo {}', { from: undefined });
	});

	it('error is caught', (t) => {
		t.assert.strictEqual(result.warnings().length, 1);
	});

	it('error is correct', (t) => {
		t.assert.strictEqual(result.warnings()[0].rule, 'plugin/warn-about-foo');
	});
});
