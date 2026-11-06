import { describe, it } from 'node:test';

import postcss from 'postcss';

import getDeclarationValue from '../getDeclarationValue.mjs';
import setDeclarationValue from '../setDeclarationValue.mjs';

const node = (code) => postcss.parse(code).first.first;

describe('setDeclarationValue', () => {
	it('sets the value', (t) => {
		const decl = setDeclarationValue(node('a { color: red; }'), 'blue');

		t.assert.strictEqual(decl.toString(), 'color: blue');
		t.assert.strictEqual(getDeclarationValue(decl), 'blue');
		t.assert.strictEqual(decl.value, 'blue');
	});

	it('sets the raw value when the value has a comment', (t) => {
		const decl = setDeclarationValue(
			node('a { color: red /* foo */ blue; }'),
			'red /* foo */ green',
		);

		t.assert.strictEqual(decl.toString(), 'color: red /* foo */ green');
		t.assert.strictEqual(getDeclarationValue(decl), 'red /* foo */ green');
		t.assert.strictEqual(decl.value, 'red  green');
	});

	it('keeps trailing whitespace in custom property values', (t) => {
		const decl = setDeclarationValue(
			node('a { --x: red /* foo */ blue; }'),
			'red /* foo */ green   ',
		);

		t.assert.strictEqual(decl.toString(), '--x: red /* foo */ green   ');
		t.assert.strictEqual(getDeclarationValue(decl), 'red /* foo */ green   ');
		t.assert.strictEqual(decl.value, 'red  green   ');
	});
});
