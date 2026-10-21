import { beforeEach, describe, it } from 'node:test';

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

	it('finds a node satisfying the predicate', (t) => {
		const result = findNodeUpToRoot(decl, (node) => {
			return node.type === 'rule' && node.selector === 'a';
		});

		t.assert.partialDeepStrictEqual(result, { type: 'rule', selector: 'a' });
	});

	it('returns `undefined` when the predicate is not satisfied', (t) => {
		const result = findNodeUpToRoot(decl, (node) => {
			return node.type === 'decl';
		});

		t.assert.strictEqual(result, undefined);
	});
});
