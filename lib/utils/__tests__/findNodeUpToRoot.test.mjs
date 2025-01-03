import postcss from 'postcss';

import findNodeUpToRoot from '../findNodeUpToRoot.mjs';

describe('findNodeUpToRoot', () => {
	let root;
	let decl;

	beforeEach(() => {
		root = postcss.parse('a { @b { color: red; } }');
		root.walkDecls((node) => {
			decl = node;
		});
	});

	it('finds a node satisfying the predicate', () => {
		const result = findNodeUpToRoot(decl, (node) => {
			return node.type === 'rule' && node.selector === 'a';
		});

		expect(result).toMatchObject({ type: 'rule', selector: 'a' });
	});

	it('returns `undefined` when the predicate is not satisfied', () => {
		const result = findNodeUpToRoot(decl, (node) => {
			return node.type === 'decl';
		});

		expect(result).toBeUndefined();
	});
});
