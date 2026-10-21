import { describe, it } from 'node:test';

import isDescriptorDeclaration from '../isDescriptorDeclaration.mjs';
import postcss from 'postcss';

describe('isDescriptorDeclaration', () => {
	it('detects a descriptor declaration', (t) => {
		const nodes = nodesIn('@font-face { font-weight: 400; }');

		t.assert.strictEqual(nodes.length, 2);
		t.assert.ok(isDescriptorDeclaration(nodes[1]));
	});

	it('detects a descriptor declaration within nested at-rules', (t) => {
		const nodes = nodesIn(
			'@position-try --custom-bottom-right { @supports (position-area: bottom right) { position-area: bottom right; } }',
		);

		t.assert.strictEqual(nodes.length, 3);
		t.assert.ok(isDescriptorDeclaration(nodes[2]));
	});

	it('detects a descriptor declaration within case different at-rule', (t) => {
		const nodes = nodesIn('@Counter-STYLE { system:	cyclic; }');

		t.assert.strictEqual(nodes.length, 2);
		t.assert.ok(isDescriptorDeclaration(nodes[1]));
	});

	it('ignores a property declaration', (t) => {
		const nodes = nodesIn('a { color: red; }');

		t.assert.strictEqual(nodes.length, 2);
		t.assert.ok(!isDescriptorDeclaration(nodes[1]));
	});

	it('ignores a property declaration within a nesting-supported at-rule', (t) => {
		const nodes = nodesIn('@media (min-width: 10px) { a { color: red; } }');

		t.assert.strictEqual(nodes.length, 3);
		t.assert.ok(!isDescriptorDeclaration(nodes[2]));
	});

	it('ignores a property declaration within a nested nesting-supported at-rule', (t) => {
		const nodes = nodesIn('a { @media (min-width: 10px) { color: red; } }');

		t.assert.strictEqual(nodes.length, 3);
		t.assert.ok(!isDescriptorDeclaration(nodes[2]));
	});
});

function nodesIn(css) {
	const nodes = [];

	postcss.parse(css).walk((node) => nodes.push(node));

	return nodes;
}
