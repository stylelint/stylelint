import { beforeEach, describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import lessSyntax from 'postcss-less';
import postcss from 'postcss';
import sassSyntax from 'postcss-sass';
import scssSyntax from 'postcss-scss';

import stripIndent from '../testUtils/stripIndent.mjs';
import stylelint from '../index.mjs';

const fixtures = (...elem) =>
	path.join(fileURLToPath(new URL('./fixtures', import.meta.url)), ...elem);

const config = {
	rules: {
		'color-named': 'always-where-possible',
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

const css = stripIndent`
	a {
		color: #000;
	}

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

	it('number and type', (t) => {
		t.assert.strictEqual(result.messages.length, 5);
		t.assert.ok(result.messages.every((m) => m.type === 'warning'));
		t.assert.ok(result.messages.every((m) => m.plugin === 'stylelint'));
	});

	it('color-named - string primary option', (t) => {
		const error = result.messages.find((msg) => msg.rule === 'color-named');

		t.assert.ok(error);
		t.assert.strictEqual(error.text, 'Expected "#000" to be "black" (color-named)');
		t.assert.strictEqual(error.severity, 'error');
	});

	it('declaration-property-unit-disallowed-list - object primary option', (t) => {
		const error = result.messages.find(
			(msg) => msg.rule === 'declaration-property-unit-disallowed-list',
		);

		t.assert.ok(error);
		t.assert.strictEqual(
			error.text,
			'Disallowed unit "px" for property "width" (declaration-property-unit-disallowed-list)',
		);
		t.assert.strictEqual(error.severity, 'error');
	});

	it('color-no-invalid-hex - true primary option', (t) => {
		const errors = result.messages.filter((msg) => msg.rule === 'color-no-invalid-hex');

		t.assert.strictEqual(errors.length, 2);

		for (const error of errors) {
			t.assert.strictEqual(error.text, 'You made a mistake (color-no-invalid-hex)');
			t.assert.strictEqual(error.severity, 'warning');
		}
	});

	it('function-disallowed-list - array primary option', (t) => {
		const error = result.messages.find((msg) => msg.rule === 'function-disallowed-list');

		t.assert.ok(error);
		t.assert.strictEqual(error.text, 'Disallowed function "calc" (function-disallowed-list)');
		t.assert.strictEqual(error.severity, 'error');
	});
});

it('Less integration test', async (t) => {
	const less = stripIndent`
		.foo(@bar) {
			color: @bar;
		}
		`;

	const result = await postcss()
		.use(stylelint({ rules: {} }))
		.process(less, { syntax: lessSyntax, from: undefined });

	t.assert.strictEqual(result.messages.length, 0);
});

it('Sass integration test', async (t) => {
	const sass = stripIndent`
		.foo-#{variable}
			color: $color
		`;

	const result = await postcss()
		.use(stylelint({ rules: {} }))
		.process(sass, { syntax: sassSyntax, from: undefined });

	t.assert.strictEqual(result.messages.length, 0);
});

it('Scss integration test', async (t) => {
	const scss = stripIndent`
		.foo-#{variable} {
			color: $color;
		}
		`;

	const result = await postcss()
		.use(stylelint({ rules: {} }))
		.process(scss, { syntax: scssSyntax, from: undefined });

	t.assert.strictEqual(result.messages.length, 0);
});

describe('integration test null option', () => {
	let results;

	beforeEach(async () => {
		results = (
			await stylelint.lint({
				config: {
					extends: [fixtures('config-no-pixels.json')],
					rules: {
						'unit-disallowed-list': null,
					},
				},
				code: 'a { top: 10px; }',
			})
		).results;
	});

	it('no invalid option warnings', (t) => {
		t.assert.strictEqual(results[0].invalidOptionWarnings.length, 0);
	});

	it('no warnings', (t) => {
		t.assert.strictEqual(results[0].warnings.length, 0);
	});
});

describe('integration test [null] option', () => {
	let results;

	beforeEach(async () => {
		results = (
			await stylelint.lint({
				config: {
					extends: [fixtures('config-no-pixels.json')],
					rules: {
						'unit-disallowed-list': [null],
					},
				},
				code: 'a { top: 10px; }',
			})
		).results;
	});

	it('no invalid option warnings', (t) => {
		t.assert.strictEqual(results[0].invalidOptionWarnings.length, 0);
	});

	it('no warnings', (t) => {
		t.assert.strictEqual(results[0].warnings.length, 0);
	});
});
