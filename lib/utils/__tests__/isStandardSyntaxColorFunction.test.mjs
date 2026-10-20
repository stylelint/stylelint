import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import isStandardSyntaxColorFunction from '../isStandardSyntaxColorFunction.mjs';
import postcss from 'postcss';
import valueParser from 'postcss-value-parser';

describe('isStandardSyntaxColorFunction', () => {
	it('legacy syntax', () => {
		assert.equal(isStandardSyntaxColorFunction(func('a { color: rgb(0, 0, 0) }')), true);
	});

	it('legacy syntax alpha', () => {
		assert.equal(isStandardSyntaxColorFunction(func('a { color: rgba(0, 0, 0, 0) }')), true);
	});

	it('modern syntax', () => {
		assert.equal(isStandardSyntaxColorFunction(func('a { color: rgba(0 0 0) }')), true);
	});

	it('modern syntax alpha', () => {
		assert.equal(isStandardSyntaxColorFunction(func('a { color: rgba(0 0 0 / 50%) }')), true);
	});

	it('space', () => {
		assert.equal(isStandardSyntaxColorFunction(func('a { color: rgba( 0 0 0 / 50% ) }')), true);
	});

	it('comment', () => {
		assert.equal(
			isStandardSyntaxColorFunction(func('a { color: rgba(/* #aaa */ 0 0 0 / 50%) }')),
			true,
		);
	});

	it('custom property', () => {
		assert.equal(
			isStandardSyntaxColorFunction(func('a { color: rgba(var(--red) 0 0 / 50%) }')),
			true,
		);
	});

	it('function', () => {
		assert.equal(
			isStandardSyntaxColorFunction(func('a { color: rgba(calc(var(--red) + 50) 0 0 / 50%) }')),
			true,
		);
	});

	it('scss color function conversion', () => {
		assert.equal(isStandardSyntaxColorFunction(func('a { color: rgba(#aaa, 0.5) }')), false);
	});

	it('scss color function conversion with comment', () => {
		assert.equal(
			isStandardSyntaxColorFunction(func('a { color: rgba(/* comment */ #aaa, 0.5) }')),
			false,
		);
	});

	it('scss variable', () => {
		assert.equal(isStandardSyntaxColorFunction(func('a { color: rgba($var, 0.5) }')), false);
	});

	it('scss variable in last param', () => {
		assert.equal(isStandardSyntaxColorFunction(func('a { color: rgb(0 0 0 / $var) }')), false);
	});

	it('scss nested function', () => {
		assert.equal(
			isStandardSyntaxColorFunction(func('a { color: rgba(color.mix(#000, #fff, 35%), 0.6); }')),
			false,
		);
	});

	it('namespaced scss variable', () => {
		assert.equal(isStandardSyntaxColorFunction(func('a { color: rgba(color.$var, 0.5) }')), false);
	});
});

function func(css) {
	const functions = [];

	postcss.parse(css).walkDecls((decl) => {
		valueParser(decl.value).walk((valueNode) => {
			if (valueNode.type === 'function') {
				functions.push(valueNode);
			}
		});
	});

	return functions[0];
}
