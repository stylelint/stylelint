import { jest } from '@jest/globals';
import postcss from 'postcss';

import memoizeForReferenceRoots from '../memoizeForReferenceRoots.mjs';

describe('memoizeForReferenceRoots', () => {
	const root = postcss.parse('a {}');
	const referenceRoot = postcss.parse('b {}');

	it('returns the results in source order', () => {
		const getSelector = memoizeForReferenceRoots((node) => node.first.selector);

		expect(getSelector(root, [referenceRoot])).toEqual(['b', 'a']);
	});

	it('computes the reference roots once and the root each time', () => {
		const fn = jest.fn((node) => node.first.selector);
		const getSelector = memoizeForReferenceRoots(fn);

		getSelector(root, [referenceRoot]);
		getSelector(root, [referenceRoot]);

		expect(fn).toHaveBeenCalledTimes(3);
	});
});
