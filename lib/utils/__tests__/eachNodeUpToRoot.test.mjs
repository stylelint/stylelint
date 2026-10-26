import { beforeEach, describe, it } from 'node:test';

import postcss from 'postcss';

import eachNodeUpToRoot, { STOP } from '../eachNodeUpToRoot.mjs';

describe('eachNodeUpToRoot', () => {
	let root;
	let decl;

	beforeEach(() => {
		root = postcss.parse('a { @b { color: red; } }');
		root.walkDecls((node) => {
			decl = node;
		});
	});

	it('iterates over each node up to the root', (t) => {
		const nodes = [];

		eachNodeUpToRoot(decl, (node) => {
			nodes.push(node);
		});

		t.assert.strictEqual(nodes.length, 2);
		t.assert.partialDeepStrictEqual(nodes[0], { type: 'atrule', name: 'b' });
		t.assert.partialDeepStrictEqual(nodes[1], { type: 'rule', selector: 'a' });
	});

	it('stops iteration when the callback returns the special value', (t) => {
		const nodes = [];

		eachNodeUpToRoot(decl, (node) => {
			if (node.type === 'rule') return STOP;

			nodes.push(node);
		});

		t.assert.strictEqual(nodes.length, 1);
		t.assert.partialDeepStrictEqual(nodes[0], { type: 'atrule', name: 'b' });
	});
});
