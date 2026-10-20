import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import isDescriptorDeclaration from '../isDescriptorDeclaration.mjs';
import postcss from 'postcss';

describe('isDescriptorDeclaration', () => {
	it('detects a descriptor declaration', () => {
		const nodes = nodesIn('@font-face { font-weight: 400; }');

		assert.equal(nodes.length, 2);
		assert.ok(isDescriptorDeclaration(nodes[1]));
	});

	it('detects a descriptor declaration within nested at-rules', () => {
		const nodes = nodesIn(
			'@position-try --custom-bottom-right { @supports (position-area: bottom right) { position-area: bottom right; } }',
		);

		assert.equal(nodes.length, 3);
		assert.ok(isDescriptorDeclaration(nodes[2]));
	});

	it('detects a descriptor declaration within case different at-rule', () => {
		const nodes = nodesIn('@Counter-STYLE { system:	cyclic; }');

		assert.equal(nodes.length, 2);
		assert.ok(isDescriptorDeclaration(nodes[1]));
	});

	it('ignores a property declaration', () => {
		const nodes = nodesIn('a { color: red; }');

		assert.equal(nodes.length, 2);
		assert.ok(!isDescriptorDeclaration(nodes[1]));
	});

	it('ignores a property declaration within a nesting-supported at-rule', () => {
		const nodes = nodesIn('@media (min-width: 10px) { a { color: red; } }');

		assert.equal(nodes.length, 3);
		assert.ok(!isDescriptorDeclaration(nodes[2]));
	});

	it('ignores a property declaration within a nested nesting-supported at-rule', () => {
		const nodes = nodesIn('a { @media (min-width: 10px) { color: red; } }');

		assert.equal(nodes.length, 3);
		assert.ok(!isDescriptorDeclaration(nodes[2]));
	});
});

function nodesIn(css) {
	const nodes = [];

	postcss.parse(css).walk((node) => nodes.push(node));

	return nodes;
}
