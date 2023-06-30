import postcss from 'postcss';

import transformSelector from '../transformSelector.js';

import { jest } from '@jest/globals';

test('success', () => {
	const warn = jest.fn();
	const result = { warn };
	const ruleNode = postcss.rule({ selector: 'a, b > c' });
	const callback = jest.fn();

	expect(transformSelector(result, ruleNode, callback)).toBe('a, b > c');
	expect(warn).not.toHaveBeenCalled();
	expect(callback).toHaveBeenCalled();
});

test('failure', () => {
	const warn = jest.fn();
	const result = { warn };
	const ruleNode = postcss.rule({ selector: 'a[}' });
	const callback = jest.fn();

	expect(transformSelector(result, ruleNode, callback)).toBeUndefined();
	expect(warn).toHaveBeenCalled();
	expect(callback).not.toHaveBeenCalled();
});
