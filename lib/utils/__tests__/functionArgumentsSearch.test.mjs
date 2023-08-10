import functionArgumentsSearch from '../functionArgumentsSearch.mjs';

import { jest } from '@jest/globals';

it('passes function arguments to callback', () => {
	expect.assertions(4);

	const parsed = functionArgumentsSearch(
		'calc(1 + 3)',
		'calc',
		(expression, expressionIndex, funcNode) => {
			expect(expression).toBe('1 + 3');
			expect(expressionIndex).toBe(5);
			expect(funcNode).toMatchObject({ type: 'function' });
		},
	);

	expect(parsed.nodes).toHaveLength(1);
});

it('passes function arguments to callback when a case with multiple expressions', () => {
	expect.assertions(2);

	functionArgumentsSearch('4px 5px calc(1px + 3px)', 'calc', (expression, expressionIndex) => {
		expect(expression).toBe('1px + 3px');
		expect(expressionIndex).toBe(13);
	});
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

	expect(calcExpressions).toEqual(['calc(1px + 2px) + 3px', '1px + 2px']);
	expect(calcExpressionIndexes).toEqual([13, 18]);
});

it('works with nested functions inside `color()`', () => {
	expect.assertions(2);

	functionArgumentsSearch(
		'color(red s(- 10%) s( - 10%))',
		'color',
		(expression, expressionIndex) => {
			expect(expression).toBe('red s(- 10%) s( - 10%)');
			expect(expressionIndex).toBe(6);
		},
	);
});

it('works with nested functions inside `s()`', () => {
	const sExpressions = [];
	const sExpressionIndexes = [];

	functionArgumentsSearch('color(red s(- 10%) s( - 10%))', 's', (expression, expressionIndex) => {
		sExpressions.push(expression);
		sExpressionIndexes.push(expressionIndex);
	});

	expect(sExpressions).toEqual(['- 10%', ' - 10%']);
	expect(sExpressionIndexes).toEqual([12, 21]);
});

it('works with interpolation', () => {
	expect.assertions(2);

	functionArgumentsSearch('url(http://$(host)/path)', 'url', (expression, expressionIndex) => {
		expect(expression).toBe('http://$(host)/path');
		expect(expressionIndex).toBe(4);
	});
});

it('works with regex', () => {
	expect.assertions(4);

	functionArgumentsSearch(
		'linear-gradient(#fff, #000)',
		/^(-moz-)?linear-gradient$/,
		(expression, expressionIndex) => {
			expect(expression).toBe('#fff, #000');
			expect(expressionIndex).toBe(16);
		},
	);

	functionArgumentsSearch(
		'-moz-linear-gradient(#fff, #000)',
		/^(-moz-)?linear-gradient$/,
		(expression, expressionIndex) => {
			expect(expression).toBe('#fff, #000');
			expect(expressionIndex).toBe(21);
		},
	);
});

it('ignores strings', () => {
	expect.assertions(3);

	functionArgumentsSearch('calc(1px)', 'calc', (expression, expressionIndex) => {
		expect(expression).toBe('1px');
		expect(expressionIndex).toBe(5);
	});

	const callback = jest.fn();

	functionArgumentsSearch('"calc(1px)"', 'calc', callback);

	expect(callback).not.toHaveBeenCalled();
});
