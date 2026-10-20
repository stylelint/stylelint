import { it, mock } from 'node:test';
import assert from 'node:assert/strict';

import functionArgumentsSearch from '../functionArgumentsSearch.mjs';

it('passes function arguments to callback', () => {
	const callback = mock.fn((expression, expressionIndex, funcNode) => {
		assert.equal(expression, '1 + 3');
		assert.equal(expressionIndex, 5);
		assert.partialDeepStrictEqual(funcNode, { type: 'function' });
	});

	const parsed = functionArgumentsSearch('calc(1 + 3)', 'calc', callback);

	assert.equal(callback.mock.callCount(), 1);
	assert.equal(parsed.nodes.length, 1);
});

it('passes function arguments to callback when a case with multiple expressions', () => {
	const callback = mock.fn((expression, expressionIndex) => {
		assert.equal(expression, '1px + 3px');
		assert.equal(expressionIndex, 13);
	});

	functionArgumentsSearch('4px 5px calc(1px + 3px)', 'calc', callback);

	assert.equal(callback.mock.callCount(), 1);
});

it('works without closing parenthesis', () => {
	const callback = mock.fn((expression, expressionIndex) => {
		assert.equal(expression, '1px + 3px');
		assert.equal(expressionIndex, 5);
	});

	functionArgumentsSearch('calc(1px + 3px', 'calc', callback);

	assert.equal(callback.mock.callCount(), 1);
});

it('works with nested functions', () => {
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

	assert.deepEqual(calcExpressions, ['calc(1px + 2px) + 3px', '1px + 2px']);
	assert.deepEqual(calcExpressionIndexes, [13, 18]);
});

it('works with nested functions inside `color()`', () => {
	const callback = mock.fn((expression, expressionIndex) => {
		assert.equal(expression, 'red s(- 10%) s( - 10%)');
		assert.equal(expressionIndex, 6);
	});

	functionArgumentsSearch('color(red s(- 10%) s( - 10%))', 'color', callback);

	assert.equal(callback.mock.callCount(), 1);
});

it('works with nested functions inside `s()`', () => {
	const sExpressions = [];
	const sExpressionIndexes = [];

	functionArgumentsSearch('color(red s(- 10%) s( - 10%))', 's', (expression, expressionIndex) => {
		sExpressions.push(expression);
		sExpressionIndexes.push(expressionIndex);
	});

	assert.deepEqual(sExpressions, ['- 10%', ' - 10%']);
	assert.deepEqual(sExpressionIndexes, [12, 21]);
});

it('works with interpolation', () => {
	const callback = mock.fn((expression, expressionIndex) => {
		assert.equal(expression, 'http://$(host)/path');
		assert.equal(expressionIndex, 4);
	});

	functionArgumentsSearch('url(http://$(host)/path)', 'url', callback);

	assert.equal(callback.mock.callCount(), 1);
});

it('works with interpolation and missing closing parenthesis', () => {
	const callback = mock.fn((expression, expressionIndex) => {
		assert.equal(expression, 'http://$(host)/path');
		assert.equal(expressionIndex, 4);
	});

	functionArgumentsSearch('url(http://$(host)/path', 'url', callback);

	assert.equal(callback.mock.callCount(), 1);
});

it('works with regex', () => {
	const unprefixed = mock.fn((expression, expressionIndex) => {
		assert.equal(expression, '#fff, #000');
		assert.equal(expressionIndex, 16);
	});

	functionArgumentsSearch('linear-gradient(#fff, #000)', /^(-moz-)?linear-gradient$/, unprefixed);

	assert.equal(unprefixed.mock.callCount(), 1);

	const prefixed = mock.fn((expression, expressionIndex) => {
		assert.equal(expression, '#fff, #000');
		assert.equal(expressionIndex, 21);
	});

	functionArgumentsSearch(
		'-moz-linear-gradient(#fff, #000)',
		/^(-moz-)?linear-gradient$/,
		prefixed,
	);

	assert.equal(prefixed.mock.callCount(), 1);
});

it('ignores strings', () => {
	const callback = mock.fn((expression, expressionIndex) => {
		assert.equal(expression, '1px');
		assert.equal(expressionIndex, 5);
	});

	functionArgumentsSearch('calc(1px)', 'calc', callback);

	assert.equal(callback.mock.callCount(), 1);

	const ignored = mock.fn();

	functionArgumentsSearch('"calc(1px)"', 'calc', ignored);

	assert.equal(ignored.mock.callCount(), 0);
});
