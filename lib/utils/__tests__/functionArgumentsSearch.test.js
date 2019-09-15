'use strict';

const functionArgumentsSearch = require('../functionArgumentsSearch');

it('passes function arguments to callback', () => {
	functionArgumentsSearch('calc(1 + 3)', 'calc', (expression, expressionIndex) => {
		expect(expression).toBe('1 + 3');
		expect(expressionIndex).toBe(5);
	});
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

	const colorFuncValue = 'color(red s(- 10%) s( - 10%))';

	functionArgumentsSearch(colorFuncValue, 'color', (expression, expressionIndex) => {
		expect(expression).toBe('red s(- 10%) s( - 10%)');
		expect(expressionIndex).toBe(6);
	});
	const sExpressions = [];
	const sExpressionIndexes = [];

	functionArgumentsSearch(colorFuncValue, 's', (expression, expressionIndex) => {
		sExpressions.push(expression);
		sExpressionIndexes.push(expressionIndex);
	});
	expect(sExpressions).toEqual(['- 10%', ' - 10%']);
	expect(sExpressionIndexes).toEqual([12, 21]);
});

it('ignores strings', () => {
	functionArgumentsSearch('calc(1px)', 'calc', (expression, expressionIndex) => {
		expect(expression).toBe('1px');
		expect(expressionIndex).toBe(5);
	});
	functionArgumentsSearch('"calc(1px)"', 'calc', (expression, expressionIndex) => {
		expect(expression).toBeNull();
		expect(expressionIndex).toBeNull();
	});
});
