import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import isKeyframeRule from '../isKeyframeRule.mjs';

import postcss from 'postcss';

describe('isKeyframeRule', () => {
	it('detects a standard keyframe rule', () => {
		const nodes = nodesIn('@keyframes identifier { to {} }');

		assert.equal(nodes.length, 2);
		assert.ok(!isKeyframeRule(nodes[0]));
		assert.ok(isKeyframeRule(nodes[1]));
	});

	it('detects a mixed-case keyframe rule', () => {
		const nodes = nodesIn('@kEyFrAmEs identifier { to {} }');

		assert.equal(nodes.length, 2);
		assert.ok(!isKeyframeRule(nodes[0]));
		assert.ok(isKeyframeRule(nodes[1]));
	});

	it('detects an upper-case keyframe rule', () => {
		const nodes = nodesIn('@KEYFRAMES identifier { to {} }');

		assert.equal(nodes.length, 2);
		assert.ok(!isKeyframeRule(nodes[0]));
		assert.ok(isKeyframeRule(nodes[1]));
	});

	it('detects a keyframe rule with nested from decl', () => {
		const nodes = nodesIn('@keyframes identifier { from {} }');

		assert.equal(nodes.length, 2);
		assert.ok(!isKeyframeRule(nodes[0]));
		assert.ok(isKeyframeRule(nodes[1]));
	});

	it('detects a keyframe rule with nested percentage decl', () => {
		const nodes = nodesIn('@keyframes identifier { 50% {} }');

		assert.equal(nodes.length, 2);
		assert.ok(!isKeyframeRule(nodes[0]));
		assert.ok(isKeyframeRule(nodes[1]));
	});

	it('ignores a normal rule', () => {
		const nodes = nodesIn('a {}');

		assert.equal(nodes.length, 1);
		assert.ok(!isKeyframeRule(nodes[0]));
	});

	it('ignores a normal rule with nested decl', () => {
		const nodes = nodesIn('a { & b {} }');

		assert.equal(nodes.length, 2);
		assert.ok(!isKeyframeRule(nodes[0]));
		assert.ok(!isKeyframeRule(nodes[1]));
	});

	it('ignores a normal rule with nested at-rule decl', () => {
		const nodes = nodesIn('a { @nest b & {} }');

		assert.equal(nodes.length, 2);
		assert.ok(!isKeyframeRule(nodes[0]));
		assert.ok(!isKeyframeRule(nodes[1]));
	});

	it('ignores an @media', () => {
		const nodes = nodesIn('@media print { a {} }');

		assert.equal(nodes.length, 2);
		assert.ok(!isKeyframeRule(nodes[0]));
		assert.ok(!isKeyframeRule(nodes[1]));
	});

	it('ignores an @supports rule', () => {
		const nodes = nodesIn('@supports (animation-name: test) { a {} }');

		assert.equal(nodes.length, 2);
		assert.ok(!isKeyframeRule(nodes[0]));
		assert.ok(!isKeyframeRule(nodes[1]));
	});

	it('ignores a node without parent', () => {
		assert.ok(!isKeyframeRule(postcss.root()));
	});
});

function nodesIn(css) {
	const nodes = [];

	postcss.parse(css).walk((node) => nodes.push(node));

	return nodes;
}
