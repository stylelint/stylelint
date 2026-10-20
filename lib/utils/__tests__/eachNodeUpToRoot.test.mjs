import { beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';

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

	it('iterates over each node up to the root', () => {
		const nodes = [];

		eachNodeUpToRoot(decl, (node) => {
			nodes.push(node);
		});

		assert.equal(nodes.length, 2);
		assert.partialDeepStrictEqual(nodes[0], { type: 'atrule', name: 'b' });
		assert.partialDeepStrictEqual(nodes[1], { type: 'rule', selector: 'a' });
	});

	it('stops iteration when the callback returns the special value', () => {
		const nodes = [];

		eachNodeUpToRoot(decl, (node) => {
			if (node.type === 'rule') return STOP;

			nodes.push(node);
		});

		assert.equal(nodes.length, 1);
		assert.partialDeepStrictEqual(nodes[0], { type: 'atrule', name: 'b' });
	});
});
