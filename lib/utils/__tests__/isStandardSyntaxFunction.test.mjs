import { describe, it } from 'node:test';

import isStandardSyntaxFunction from '../isStandardSyntaxFunction.mjs';
import valueParser from 'postcss-value-parser';

describe('isStandardSyntaxFunction', () => {
	it('calc', (t) => {
		t.assert.strictEqual(isStandardSyntaxFunction(getFunction('calc(a + b)')), true);
	});

	it('url', (t) => {
		t.assert.strictEqual(isStandardSyntaxFunction(getFunction("url('x.css')")), true);
	});

	it('scss list', (t) => {
		// as in $list: (list)
		t.assert.strictEqual(isStandardSyntaxFunction(getFunction('(list)')), false);
	});

	it('scss map', (t) => {
		// as in $map: (key: value)
		t.assert.strictEqual(isStandardSyntaxFunction(getFunction('(key: value)')), false);
	});

	it('scss function in scss interpolation', (t) => {
		t.assert.strictEqual(isStandardSyntaxFunction(getFunction('#{darken(#fff, 0.2)}')), false);
	});

	it('CSS-in-JS interpolation', (t) => {
		t.assert.strictEqual(
			isStandardSyntaxFunction(
				getFunction('${({ size }) => (size === "small") ? "0.8em" : "1em"}'),
			),
			false,
		);
	});

	it('CSS-in-JS syntax', (t) => {
		t.assert.strictEqual(
			isStandardSyntaxFunction(getFunction('`calc(${token.radiusBase} + 2px)`')),
			false,
		);
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
