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

		expect(nodes).toHaveLength(2);
		expect(nodes[0]).toMatchObject({ type: 'atrule', name: 'b' });
		expect(nodes[1]).toMatchObject({ type: 'rule', selector: 'a' });
	});

	it('stops iteration when the callback returns the special value', () => {
		const nodes = [];

		eachNodeUpToRoot(decl, (node) => {
			if (node.type === 'rule') return STOP;

			nodes.push(node);
		});

		expect(nodes).toHaveLength(1);
		expect(nodes[0]).toMatchObject({ type: 'atrule', name: 'b' });
	});
});
