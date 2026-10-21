import { it, mock } from 'node:test';

import functionArgumentsSearch from '../functionArgumentsSearch.mjs';

it('passes function arguments to callback', (t) => {
	const callback = mock.fn((expression, expressionIndex, funcNode) => {
		t.assert.strictEqual(expression, '1 + 3');
		t.assert.strictEqual(expressionIndex, 5);
		t.assert.partialDeepStrictEqual(funcNode, { type: 'function' });
	});

	const parsed = functionArgumentsSearch('calc(1 + 3)', 'calc', callback);

	t.assert.strictEqual(callback.mock.callCount(), 1);
	t.assert.strictEqual(parsed.nodes.length, 1);
});

it('passes function arguments to callback when a case with multiple expressions', (t) => {
	const callback = mock.fn((expression, expressionIndex) => {
		t.assert.strictEqual(expression, '1px + 3px');
		t.assert.strictEqual(expressionIndex, 13);
	});

	functionArgumentsSearch('4px 5px calc(1px + 3px)', 'calc', callback);

	t.assert.strictEqual(callback.mock.callCount(), 1);
});

it('works without closing parenthesis', (t) => {
	const callback = mock.fn((expression, expressionIndex) => {
		t.assert.strictEqual(expression, '1px + 3px');
		t.assert.strictEqual(expressionIndex, 5);
	});

	functionArgumentsSearch('calc(1px + 3px', 'calc', callback);

	t.assert.strictEqual(callback.mock.callCount(), 1);
});

it('works with nested functions', (t) => {
	const calcExpressions = [];
	const calcExpressionIndexes = [];

	functionArgumentsSearch(
		'4px 5px calc(calc(1px + 2px) + 3px)',
		'calc',
		(expression, expressionIndex) => {
			calcExpressions.push(expression);
			calcExpressionIndexes.push(expressionIndex);
		},
	);

	t.assert.deepStrictEqual(calcExpressions, ['calc(1px + 2px) + 3px', '1px + 2px']);
	t.assert.deepStrictEqual(calcExpressionIndexes, [13, 18]);
});

it('works with nested functions inside `color()`', (t) => {
	const callback = mock.fn((expression, expressionIndex) => {
		t.assert.strictEqual(expression, 'red s(- 10%) s( - 10%)');
		t.assert.strictEqual(expressionIndex, 6);
	});

	functionArgumentsSearch('color(red s(- 10%) s( - 10%))', 'color', callback);

	t.assert.strictEqual(callback.mock.callCount(), 1);
});

it('works with nested functions inside `s()`', (t) => {
	const sExpressions = [];
	const sExpressionIndexes = [];

	functionArgumentsSearch('color(red s(- 10%) s( - 10%))', 's', (expression, expressionIndex) => {
		sExpressions.push(expression);
		sExpressionIndexes.push(expressionIndex);
	});

	t.assert.deepStrictEqual(sExpressions, ['- 10%', ' - 10%']);
	t.assert.deepStrictEqual(sExpressionIndexes, [12, 21]);
});

it('works with interpolation', (t) => {
	const callback = mock.fn((expression, expressionIndex) => {
		t.assert.strictEqual(expression, 'http://$(host)/path');
		t.assert.strictEqual(expressionIndex, 4);
	});

	functionArgumentsSearch('url(http://$(host)/path)', 'url', callback);

	t.assert.strictEqual(callback.mock.callCount(), 1);
});

it('works with interpolation and missing closing parenthesis', (t) => {
	const callback = mock.fn((expression, expressionIndex) => {
		t.assert.strictEqual(expression, 'http://$(host)/path');
		t.assert.strictEqual(expressionIndex, 4);
	});

	functionArgumentsSearch('url(http://$(host)/path', 'url', callback);

	t.assert.strictEqual(callback.mock.callCount(), 1);
});

it('works with regex', (t) => {
	const unprefixed = mock.fn((expression, expressionIndex) => {
		t.assert.strictEqual(expression, '#fff, #000');
		t.assert.strictEqual(expressionIndex, 16);
	});

	functionArgumentsSearch('linear-gradient(#fff, #000)', /^(-moz-)?linear-gradient$/, unprefixed);

	t.assert.strictEqual(unprefixed.mock.callCount(), 1);

	const prefixed = mock.fn((expression, expressionIndex) => {
		t.assert.strictEqual(expression, '#fff, #000');
		t.assert.strictEqual(expressionIndex, 21);
	});

	functionArgumentsSearch(
		'-moz-linear-gradient(#fff, #000)',
		/^(-moz-)?linear-gradient$/,
		prefixed,
	);

	t.assert.strictEqual(prefixed.mock.callCount(), 1);
});

it('ignores strings', (t) => {
	const callback = mock.fn((expression, expressionIndex) => {
		t.assert.strictEqual(expression, '1px');
		t.assert.strictEqual(expressionIndex, 5);
	});

	functionArgumentsSearch('calc(1px)', 'calc', callback);

	t.assert.strictEqual(callback.mock.callCount(), 1);

	const ignored = mock.fn();

	functionArgumentsSearch('"calc(1px)"', 'calc', ignored);

	t.assert.strictEqual(ignored.mock.callCount(), 0);
});
