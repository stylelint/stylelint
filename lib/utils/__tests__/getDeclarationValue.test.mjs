import { describe, it } from 'node:test';

import postcss from 'postcss';

import getDeclarationValue from '../getDeclarationValue.mjs';

const node = (code) => postcss.parse(code).first.first;

describe('getDeclarationValue', () => {
	it('returns the value', (t) => {
		t.assert.strictEqual(getDeclarationValue(node('a { color: red; }')), 'red');
	});

	it('returns the raw value with its comment', (t) => {
		t.assert.strictEqual(
			getDeclarationValue(node('a { color: red /* foo */ blue; }')),
			'red /* foo */ blue',
		);
	});

	it('returns a new value assigned over a raw one', (t) => {
		const decl = node('a { color: red /* foo */ blue; }');

		decl.value = 'green';

		t.assert.strictEqual(getDeclarationValue(decl), 'green');
	});
});
