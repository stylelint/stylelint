import isFirstNodeOfRoot from '../isFirstNodeOfRoot.mjs';

import postcss from 'postcss';

test('return false when the passed node is a root', () => {
	expect(isFirstNodeOfRoot(postcss.root())).toBe(false);
});

test('return false when the passed node has no parent', () => {
	expect(isFirstNodeOfRoot(postcss.rule({ selector: 'a' }))).toBe(false);
});
