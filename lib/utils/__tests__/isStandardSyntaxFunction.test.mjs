import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import isStandardSyntaxFunction from '../isStandardSyntaxFunction.mjs';
import valueParser from 'postcss-value-parser';

describe('isStandardSyntaxFunction', () => {
	it('calc', () => {
		assert.equal(isStandardSyntaxFunction(getFunction('calc(a + b)')), true);
	});

	it('url', () => {
		assert.equal(isStandardSyntaxFunction(getFunction("url('x.css')")), true);
	});

	it('scss list', () => {
		// as in $list: (list)
		assert.equal(isStandardSyntaxFunction(getFunction('(list)')), false);
	});

	it('scss map', () => {
		// as in $map: (key: value)
		assert.equal(isStandardSyntaxFunction(getFunction('(key: value)')), false);
	});

	it('scss function in scss interpolation', () => {
		assert.equal(isStandardSyntaxFunction(getFunction('#{darken(#fff, 0.2)}')), false);
	});

	it('CSS-in-JS interpolation', () => {
		assert.equal(
			isStandardSyntaxFunction(
				getFunction('${({ size }) => (size === "small") ? "0.8em" : "1em"}'),
			),
			false,
		);
	});

	it('CSS-in-JS syntax', () => {
		assert.equal(isStandardSyntaxFunction(getFunction('`calc(${token.radiusBase} + 2px)`')), false);
	});
});

function getFunction(declValue) {
	const functions = [];

	valueParser(declValue).walk((valueNode) => {
		if (valueNode.type === 'function') {
			functions.push(valueNode);
		}
	});

	return functions[0];
}
