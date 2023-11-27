import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

import postcss from 'postcss';

import safeChdir from '../testUtils/safeChdir.mjs';
import stylelint from '../index.mjs';

const require = createRequire(import.meta.url);
const __dirname = fileURLToPath(new URL('.', import.meta.url));

const absolutePath = (relativePath) => fileURLToPath(new URL(relativePath, import.meta.url));

const cssWithFoo = '.foo {}';

const cssWithoutFoo = '.bar {}';

const cssWithFooAndBar = '.foo {}\n.bar {}';

const configRelative = {
	plugins: ['./fixtures/plugin-warn-about-foo.cjs'],
	rules: {
		'plugin/warn-about-foo': 'always',
		'block-no-empty': true,
	},
};

const configAbsolute = {
	plugins: [absolutePath('./fixtures/plugin-warn-about-foo.cjs')],
	rules: {
		'plugin/warn-about-foo': 'always',
		'block-no-empty': true,
	},
};

const configExtendRelative = {
	extends: ['./fixtures/config-relative-plugin'],
};

const configRelativeAndExtendRelative = {
	extends: ['./fixtures/config-relative-plugin'],
	plugins: ['./fixtures/plugin-warn-about-bar.cjs'],
	rules: {
		'plugin/warn-about-bar': 'always',
	},
};

const configPluginRequire = {
	plugins: [require('./fixtures/plugin-warn-about-foo.cjs')],
	rules: {
		'plugin/warn-about-foo': 'always',
		'block-no-empty': true,
	},
};

const processorRelative = postcss().use(
	stylelint({ config: configRelative, configBasedir: __dirname }),
);
const processorAbsolute = postcss().use(stylelint({ config: configAbsolute }));
const processorExtendRelative = postcss().use(
	stylelint({ config: configExtendRelative, configBasedir: __dirname }),
);
const processorRelativeAndExtendRelative = postcss().use(
	stylelint({
		config: configRelativeAndExtendRelative,
		configBasedir: __dirname,
	}),
);
const processorPluginRequire = postcss().use(stylelint({ config: configPluginRequire }));

let consoleWarn;

beforeEach(() => {
	consoleWarn = import.meta.jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
	consoleWarn.mockRestore();
});

it('one plugin runs', async () => {
	const result = await processorRelative.process(cssWithFoo, { from: undefined });

	expect(result.warnings()).toHaveLength(2);
	expect(result.warnings()[0].text).toBe('found .foo (plugin/warn-about-foo)');
	expect(result.warnings()[0].node).toBeTruthy();
});

it('another plugin runs', async () => {
	const result = await processorRelative.process(cssWithoutFoo, { from: undefined });

	expect(result.warnings()).toHaveLength(1);
	expect(result.warnings()[0].text).toBe('Unexpected empty block (block-no-empty)');
});

it('plugin with rule metadata', async () => {
	const result = await processorRelative.process(cssWithFoo, { from: undefined });

	expect(result.stylelint).toHaveProperty('ruleMetadata', {
		'plugin/warn-about-foo': {
			url: 'https://github.com/stylelint/stylelint-foo-plugin/warn-about-foo',
		},
		'block-no-empty': {
			url: expect.stringMatching(/block-no-empty/),
		},
	});
});

it('plugin with absolute path and no configBasedir', async () => {
	const result = await processorAbsolute.process(cssWithFoo, { from: undefined });

	expect(result.warnings()).toHaveLength(2);
	expect(result.warnings()[0].text).toBe('found .foo (plugin/warn-about-foo)');
	expect(result.warnings()[0].node).toBeTruthy();
});

it('config extending another config that invokes a plugin with a relative path', async () => {
	const result = await processorExtendRelative.process(cssWithFoo, { from: undefined });

	expect(result.warnings()).toHaveLength(1);
	expect(result.warnings()[0].text).toBe('found .foo (plugin/warn-about-foo)');
	expect(result.warnings()[0].node).toBeTruthy();
});

it('config with its own plugins extending another config that invokes a plugin with a relative path', async () => {
	const result = await processorRelativeAndExtendRelative.process(cssWithFooAndBar, {
		from: undefined,
	});

	expect(result.warnings()).toHaveLength(2);
	expect(result.warnings()[0].text).toBe('found .bar (plugin/warn-about-bar)');
	expect(result.warnings()[1].text).toBe('found .foo (plugin/warn-about-foo)');
	expect(result.warnings()[0].node).toBeTruthy();
});

it('plugin with CommonJS require()', async () => {
	const result = await processorPluginRequire.process(cssWithFoo, { from: undefined });

	expect(result.warnings()).toHaveLength(2);
	expect(result.warnings()[0].text).toBe('found .foo (plugin/warn-about-foo)');
	expect(result.warnings()[1].text).toBe('Unexpected empty block (block-no-empty)');
	expect(result.warnings()[0].node).toBeTruthy();
});

it('plugin with ESM import()', async () => {
	const result = await postcss()
		.use(
			stylelint({
				config: {
					// Following object mocks `await import()` style imports, since
					// jest without node --experimental-vm-modules enabled fails to
					// support dynamic ESM imports.
					plugins: [{ default: require('./fixtures/plugin-warn-about-foo.cjs') }], // Similar to `await import()`
					rules: {
						'plugin/warn-about-foo': 'always',
						'block-no-empty': true,
					},
				},
			}),
		)
		.process(cssWithFoo, { from: undefined });

	expect(result.warnings()).toHaveLength(2);
	expect(result.warnings()[0].text).toBe('found .foo (plugin/warn-about-foo)');
	expect(result.warnings()[1].text).toBe('Unexpected empty block (block-no-empty)');
	expect(result.warnings()[0].node).toBeTruthy();
});

it('ESM plugin', async () => {
	const config = {
		plugins: [absolutePath('./fixtures/plugin-selector-no-foo.mjs')],
		rules: { 'plugin/selector-no-foo': true },
	};
	const css = '.foo {}';

	const result = await postcss().use(stylelint({ config })).process(css, { from: undefined });

	expect(result.warnings()).toHaveLength(1);
});

describe('plugin using exposed rules via stylelint.rules', () => {
	const cssWithDirectiveNever = '/** @@check-color-named */ a { color: #000; }';
	const cssWithDirectiveAlways = '/** @@check-color-named */ a { color: black; }';
	const cssWithoutDirectiveNever = 'a { color: #000; }';
	const cssWithoutDirectiveAlways = 'a { color: black; }';
	const config = (expectation) => ({
		config: {
			plugins: [absolutePath('./fixtures/plugin-conditionally-check-color-named.cjs')],
			rules: {
				'plugin/conditionally-check-color-named': expectation,
			},
		},
	});

	it('with always expectation and never color', async () => {
		const result = await postcss()
			.use(stylelint(config('always-where-possible')))
			.process(cssWithDirectiveNever, { from: undefined });

		expect(result.warnings()).toHaveLength(1);
		expect(result.warnings()[0].text).toBe('Expected "#000" to be "black" (color-named)');
	});

	it('with always expectation and always color', async () => {
		const result = await postcss()
			.use(stylelint(config('always-where-possible')))
			.process(cssWithDirectiveAlways, { from: undefined });

		expect(result.warnings()).toHaveLength(0);
	});

	it('with never expectation and always color', async () => {
		const result = await postcss()
			.use(stylelint(config('never')))
			.process(cssWithDirectiveAlways, { from: undefined });

		expect(result.warnings()).toHaveLength(1);
		expect(result.warnings()[0].text).toBe('Unexpected named color "black" (color-named)');
	});

	it('with never expectation and never color', async () => {
		const result = await postcss()
			.use(stylelint(config('never')))
			.process(cssWithDirectiveNever, { from: undefined });

		expect(result.warnings()).toHaveLength(0);
	});

	it('with always expectation and never color without directive', async () => {
		const result = await postcss()
			.use(stylelint(config('always-where-possible')))
			.process(cssWithoutDirectiveNever, { from: undefined });

		expect(result.warnings()).toHaveLength(0);
	});

	it('with always expectation and always color without directive', async () => {
		const result = await postcss()
			.use(stylelint(config('never')))
			.process(cssWithoutDirectiveAlways, { from: undefined });

		expect(result.warnings()).toHaveLength(0);
	});
});

describe('module providing an array of plugins', () => {
	const config = {
		plugins: [absolutePath('./fixtures/plugin-array.cjs')],
		rules: {
			'plugin/conditionally-check-color-named': 'always-where-possible',
			'plugin/warn-about-foo': 'always',
		},
	};

	it('first plugin works', async () => {
		const result = await postcss()
			.use(stylelint(config))
			.process('@@check-color-named a { color: #000; }', { from: undefined });

		expect(result.warnings()).toHaveLength(1);
		expect(result.warnings()[0].text).toBe('Expected "#000" to be "black" (color-named)');
	});

	it('second plugin works', async () => {
		const result = await postcss().use(stylelint(config)).process('.foo {}', { from: undefined });

		expect(result.warnings()).toHaveLength(1);
		expect(result.warnings()[0].text).toBe('found .foo (plugin/warn-about-foo)');
	});
});

it('slashless plugin causes configuration error', async () => {
	const config = {
		plugins: [absolutePath('./fixtures/plugin-slashless-warn-about-foo.cjs')],
		rules: {
			'slashless-warn-about-foo': true,
		},
	};

	await expect(
		postcss().use(stylelint(config)).process('.foo {}', { from: undefined }),
	).rejects.toThrow(/^stylelint requires plugin rules to be namespaced/);
});

it('plugin with primary option array', async () => {
	const config = {
		plugins: [absolutePath('./fixtures/plugin-primary-array.cjs')],
		rules: {
			'plugin/primary-array': ['foo', 'bar'],
		},
	};

	const result = await postcss().use(stylelint(config)).process('a {}', { from: undefined });

	expect(result.warnings()).toHaveLength(0);
});

it('plugin with primary option array within options array', async () => {
	const config = {
		plugins: [absolutePath('./fixtures/plugin-primary-array.cjs')],
		rules: {
			'plugin/primary-array': [['foo', 'bar'], { something: true }],
		},
	};

	const result = await postcss().use(stylelint(config)).process('a {}', { from: undefined });

	expect(result.warnings()).toHaveLength(0);
});

it('plugin with async rule', async () => {
	const config = {
		plugins: [absolutePath('./fixtures/plugin-async.cjs')],
		rules: {
			'plugin/async': true,
		},
	};

	const result = await postcss().use(stylelint(config)).process('a {}', { from: undefined });

	expect(result.warnings()).toHaveLength(1);
});

describe('loading a plugin from process.cwd', () => {
	safeChdir(__dirname);

	let result;

	const config = {
		plugins: ['./fixtures/plugin-warn-about-foo.cjs'],
		rules: {
			'plugin/warn-about-foo': 'always',
		},
	};

	beforeEach(async () => {
		result = await postcss().use(stylelint(config)).process('.foo {}', { from: undefined });
	});

	it('error is caught', () => {
		expect(result.warnings()).toHaveLength(1);
	});

	it('error is correct', () => {
		expect(result.warnings()[0].rule).toBe('plugin/warn-about-foo');
	});
});

describe('loading a plugin from options.cwd', () => {
	let result;

	const config = {
		plugins: ['./fixtures/plugin-warn-about-foo.cjs'],
		rules: {
			'plugin/warn-about-foo': 'always',
		},
	};

	beforeEach(async () => {
		result = await postcss()
			.use(stylelint({ cwd: __dirname, config }))
			.process('.foo {}', { from: undefined });
	});

	it('error is caught', () => {
		expect(result.warnings()).toHaveLength(1);
	});

	it('error is correct', () => {
		expect(result.warnings()[0].rule).toBe('plugin/warn-about-foo');
	});
});

describe('deprecated CommonJS plugins', () => {
	function runLint(options = {}) {
		const config = {
			plugins: [absolutePath('./fixtures/plugin-warn-about-foo.cjs')],
			rules: {},
		};

		return postcss()
			.use(stylelint({ config, ...options }))
			.process('a {}', { from: undefined });
	}

	it('shows the warning', async () => {
		await runLint();

		expect(consoleWarn).toHaveBeenCalledWith(
			expect.stringMatching(/CommonJS plugins are deprecated \(".+plugin-warn-about-foo\.cjs"\)/),
		);
	});

	it('does not show the warning when `quietDeprecationWarnings` is enabled', async () => {
		await runLint({ quietDeprecationWarnings: true });

		expect(consoleWarn).not.toHaveBeenCalled();
	});
});
