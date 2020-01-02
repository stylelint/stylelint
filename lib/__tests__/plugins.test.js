'use strict';

const path = require('path');
const postcss = require('postcss');
const stylelint = require('..');

const cssWithFoo = '.foo {}';

const cssWithoutFoo = '.bar {}';

const cssWithFooAndBar = '.foo {}\n.bar {}';

const configRelative = {
	plugins: ['./fixtures/plugin-warn-about-foo'],
	rules: {
		'plugin/warn-about-foo': 'always',
		'block-no-empty': true,
	},
};

const configAbsolute = {
	plugins: [path.join(__dirname, './fixtures/plugin-warn-about-foo')],
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
	plugins: ['./fixtures/plugin-warn-about-bar'],
	rules: {
		'plugin/warn-about-bar': 'always',
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

it('one plugin runs', () => {
	return processorRelative.process(cssWithFoo, { from: undefined }).then((result) => {
		expect(result.warnings()).toHaveLength(2);
		expect(result.warnings()[0].text).toBe('found .foo (plugin/warn-about-foo)');
		expect(result.warnings()[0].node).toBeTruthy();
	});
});

it('another plugin runs', () => {
	return processorRelative.process(cssWithoutFoo, { from: undefined }).then((result) => {
		expect(result.warnings()).toHaveLength(1);
		expect(result.warnings()[0].text).toBe('Unexpected empty block (block-no-empty)');
	});
});

it('plugin with absolute path and no configBasedir', () => {
	return processorAbsolute.process(cssWithFoo, { from: undefined }).then((result) => {
		expect(result.warnings()).toHaveLength(2);
		expect(result.warnings()[0].text).toBe('found .foo (plugin/warn-about-foo)');
		expect(result.warnings()[0].node).toBeTruthy();
	});
});

it('config extending another config that invokes a plugin with a relative path', () => {
	return processorExtendRelative.process(cssWithFoo, { from: undefined }).then((result) => {
		expect(result.warnings()).toHaveLength(1);
		expect(result.warnings()[0].text).toBe('found .foo (plugin/warn-about-foo)');
		expect(result.warnings()[0].node).toBeTruthy();
	});
});

it('config with its own plugins extending another config that invokes a plugin with a relative path', () => {
	return processorRelativeAndExtendRelative
		.process(cssWithFooAndBar, { from: undefined })
		.then((result) => {
			expect(result.warnings()).toHaveLength(2);
			expect(result.warnings()[0].text).toBe('found .bar (plugin/warn-about-bar)');
			expect(result.warnings()[1].text).toBe('found .foo (plugin/warn-about-foo)');
			expect(result.warnings()[0].node).toBeTruthy();
		});
});

describe('plugin using exposed rules via stylelint.rules', () => {
	const cssWithDirectiveLower = '/** @@check-color-hex-case */ a { color: #eee; }';
	const cssWithDirectiveUpper = '/** @@check-color-hex-case */ a { color: #EEE; }';
	const cssWithoutDirectiveLower = 'a { color: #eee; }';
	const cssWithoutDirectiveUpper = 'a { color: #EEE; }';
	const config = (expectation) => ({
		config: {
			plugins: [path.join(__dirname, 'fixtures/plugin-conditionally-check-color-hex-case')],
			rules: {
				'plugin/conditionally-check-color-hex-case': expectation,
			},
		},
	});

	it('with uppercase expectation and lowercase color', () => {
		return postcss()
			.use(stylelint(config('upper')))
			.process(cssWithDirectiveLower, { from: undefined })
			.then((result) => {
				expect(result.warnings()).toHaveLength(1);
				expect(result.warnings()[0].text).toBe('Expected "#eee" to be "#EEE" (color-hex-case)');
			});
	});

	it('with uppercase expectation and uppercase color', () => {
		return postcss()
			.use(stylelint(config('upper')))
			.process(cssWithDirectiveUpper, { from: undefined })
			.then((result) => {
				expect(result.warnings()).toHaveLength(0);
			});
	});

	it('with lowercase expectation and uppercase color', () => {
		return postcss()
			.use(stylelint(config('lower')))
			.process(cssWithDirectiveUpper, { from: undefined })
			.then((result) => {
				expect(result.warnings()).toHaveLength(1);
				expect(result.warnings()[0].text).toBe('Expected "#EEE" to be "#eee" (color-hex-case)');
			});
	});

	it('with lowercase expectation and lowercase color', () => {
		return postcss()
			.use(stylelint(config('lower')))
			.process(cssWithDirectiveLower, { from: undefined })
			.then((result) => {
				expect(result.warnings()).toHaveLength(0);
			});
	});

	it('with uppercase expectation and lowercase color without directive', () => {
		return postcss()
			.use(stylelint(config('upper')))
			.process(cssWithoutDirectiveLower, { from: undefined })
			.then((result) => {
				expect(result.warnings()).toHaveLength(0);
			});
	});

	it('with uppercase expectation and uppercase color without directive', () => {
		return postcss()
			.use(stylelint(config('lower')))
			.process(cssWithoutDirectiveUpper, { from: undefined })
			.then((result) => {
				expect(result.warnings()).toHaveLength(0);
			});
	});
});

describe('module providing an array of plugins', () => {
	const config = {
		plugins: [path.join(__dirname, 'fixtures/plugin-array')],
		rules: {
			'plugin/conditionally-check-color-hex-case': 'upper',
			'plugin/warn-about-foo': 'always',
		},
	};

	it('first plugin works', () => {
		return postcss()
			.use(stylelint(config))
			.process('@@check-color-hex-case a { color: #eee; }', { from: undefined })
			.then((result) => {
				expect(result.warnings()).toHaveLength(1);
				expect(result.warnings()[0].text).toBe('Expected "#eee" to be "#EEE" (color-hex-case)');
			});
	});

	it('second plugin works', () => {
		return postcss()
			.use(stylelint(config))
			.process('.foo {}', { from: undefined })
			.then((result) => {
				expect(result.warnings()).toHaveLength(1);
				expect(result.warnings()[0].text).toBe('found .foo (plugin/warn-about-foo)');
			});
	});
});

it('slashless plugin causes configuration error', () => {
	const config = {
		plugins: [path.join(__dirname, 'fixtures/plugin-slashless-warn-about-foo')],
		rules: {
			'slashless-warn-about-foo': true,
		},
	};

	return postcss()
		.use(stylelint(config))
		.process('.foo {}', { from: undefined })
		.then(() => {
			throw new Error('should not have succeeded');
		})
		.catch((err) => {
			expect(err.message.startsWith('stylelint v7+ requires plugin rules to be namespaced')).toBe(
				true,
			);
		});
});

it('plugin with primary option array', () => {
	const config = {
		plugins: [path.join(__dirname, 'fixtures/plugin-primary-array')],
		rules: {
			'plugin/primary-array': ['foo', 'bar'],
		},
	};

	return postcss()
		.use(stylelint(config))
		.process('a {}', { from: undefined })
		.then((result) => {
			expect(result.warnings()).toHaveLength(0);
		});
});

it('plugin with primary option array within options array', () => {
	const config = {
		plugins: [path.join(__dirname, 'fixtures/plugin-primary-array')],
		rules: {
			'plugin/primary-array': [['foo', 'bar'], { something: true }],
		},
	};

	return postcss()
		.use(stylelint(config))
		.process('a {}', { from: undefined })
		.then((result) => {
			expect(result.warnings()).toHaveLength(0);
		});
});

it('plugin with async rule', () => {
	const config = {
		plugins: [path.join(__dirname, 'fixtures/plugin-async')],
		rules: {
			'plugin/async': true,
		},
	};

	return postcss()
		.use(stylelint(config))
		.process('a {}', { from: undefined })
		.then((result) => {
			expect(result.warnings()).toHaveLength(1);
		});
});

describe('loading a plugin from process.cwd', () => {
	let actualCwd;
	let result;

	const config = {
		plugins: ['./fixtures/plugin-warn-about-foo'],
		rules: {
			'plugin/warn-about-foo': 'always',
		},
	};

	beforeAll(() => {
		actualCwd = process.cwd();
		process.chdir(__dirname);
	});

	afterAll(() => {
		process.chdir(actualCwd);
	});

	beforeEach(() => {
		return postcss()
			.use(stylelint(config))
			.process('.foo {}', { from: undefined })
			.then((data) => (result = data));
	});

	it('error is caught', () => {
		expect(result.warnings()).toHaveLength(1);
	});

	it('error is correct', () => {
		expect(result.warnings()[0].rule).toBe('plugin/warn-about-foo');
	});
});
