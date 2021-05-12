'use strict';

const lessSyntax = require('postcss-less');
const path = require('path');
const postcss = require('postcss');
const sassSyntax = require('postcss-sass');
const scssSyntax = require('postcss-scss');

const stylelint = require('..');

const fixtures = (...elem) => path.join(__dirname, 'fixtures', ...elem);

const config = {
	rules: {
		'block-opening-brace-newline-after': 'always',
		'declaration-property-unit-disallowed-list': {
			width: ['px', 'em'],
		},
		'color-no-invalid-hex': [
			true,
			{
				severity: 'warning',
				message: 'You made a mistake',
			},
		],
		'function-allowed-list': null,
		'function-disallowed-list': ['calc'],
		'no-duplicate-selectors': true,
	},
};

const css = `
a { background: pink; }

b {
  height: 1rem;
  display: block;
  width: 10px;
  color: #zzz;
}

/* stylelint-disable color-no-invalid-hex */
.foo {
  color: #yyy;
}
/* stylelint-enable */

.bar:before {
  color: #mmm;
  height: calc(1rem - 100%)
}
`;

describe('integration test expecting warnings', () => {
	let result;

	beforeEach(async () => {
		result = await postcss().use(stylelint(config)).process(css, { from: undefined });
	});

	it('number and type', () => {
		expect(result.messages).toHaveLength(5);
		expect(result.messages.every((m) => m.type === 'warning')).toBeTruthy();
		expect(result.messages.every((m) => m.plugin === 'stylelint')).toBeTruthy();
	});

	it('block-opening-brace-newline-after - string primary option', () => {
		const error = result.messages.find((msg) => msg.rule === 'block-opening-brace-newline-after');

		expect(error).toBeTruthy();
		expect(error.text).toBe('Expected newline after "{" (block-opening-brace-newline-after)');
		expect(error.severity).toBe('error');
	});

	it('declaration-property-unit-disallowed-list - object primary option', () => {
		const error = result.messages.find(
			(msg) => msg.rule === 'declaration-property-unit-disallowed-list',
		);

		expect(error).toBeTruthy();
		expect(error.text).toBe(
			'Unexpected unit "px" for property "width" (declaration-property-unit-disallowed-list)',
		);
		expect(error.severity).toBe('error');
	});

	it('color-no-invalid-hex - true primary option', () => {
		const errors = result.messages.filter((msg) => msg.rule === 'color-no-invalid-hex');

		expect(errors).toHaveLength(2);
		errors.forEach((error) => {
			expect(error.text).toBe('You made a mistake');
			expect(error.severity).toBe('warning');
		});
	});

	it('function-disallowed-list - array primary option', () => {
		const error = result.messages.find((msg) => msg.rule === 'function-disallowed-list');

		expect(error).toBeTruthy();
		expect(error.text).toBe('Unexpected function "calc" (function-disallowed-list)');
		expect(error.severity).toBe('error');
	});
});

it('Less integration test', async () => {
	const less = `
.foo(@bar) {
  color: @bar;
}
`;

	const result = await postcss()
		.use(stylelint({ rules: {} }))
		.process(less, { syntax: lessSyntax, from: undefined });

	expect(result.messages).toHaveLength(0);
});

it('Sass integration test', async () => {
	const sass = `
.foo-#{variable}
  color: $color
`;

	const result = await postcss()
		.use(stylelint({ rules: {} }))
		.process(sass, { syntax: sassSyntax, from: undefined });

	expect(result.messages).toHaveLength(0);
});

it('Scss integration test', async () => {
	const scss = `
.foo-#{variable} {
  color: $color;
}
`;

	const result = await postcss()
		.use(stylelint({ rules: {} }))
		.process(scss, { syntax: scssSyntax, from: undefined });

	expect(result.messages).toHaveLength(0);
});

describe('integration test null option', () => {
	let results;

	beforeEach(async () => {
		results = (
			await stylelint.lint({
				config: {
					extends: [fixtures('config-no-pixels')],
					rules: {
						'unit-disallowed-list': null,
					},
				},
				code: 'a { top: 10px; }',
			})
		).results;
	});

	it('no invalid option warnings', () => {
		expect(results[0].invalidOptionWarnings).toHaveLength(0);
	});

	it('no warnings', () => {
		expect(results[0].warnings).toHaveLength(0);
	});
});

describe('integration test [null] option', () => {
	let results;

	beforeEach(async () => {
		results = (
			await stylelint.lint({
				config: {
					extends: [fixtures('config-no-pixels')],
					rules: {
						'unit-disallowed-list': [null],
					},
				},
				code: 'a { top: 10px; }',
			})
		).results;
	});

	it('no invalid option warnings', () => {
		expect(results[0].invalidOptionWarnings).toHaveLength(0);
	});

	it('no warnings', () => {
		expect(results[0].warnings).toHaveLength(0);
	});
});
