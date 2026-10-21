import { describe, it } from 'node:test';

import isKeyframeRule from '../isKeyframeRule.mjs';

import postcss from 'postcss';

describe('isKeyframeRule', () => {
	it('detects a standard keyframe rule', (t) => {
		const nodes = nodesIn('@keyframes identifier { to {} }');

		t.assert.strictEqual(nodes.length, 2);
		t.assert.ok(!isKeyframeRule(nodes[0]));
		t.assert.ok(isKeyframeRule(nodes[1]));
	});

	it('detects a mixed-case keyframe rule', (t) => {
		const nodes = nodesIn('@kEyFrAmEs identifier { to {} }');

		t.assert.strictEqual(nodes.length, 2);
		t.assert.ok(!isKeyframeRule(nodes[0]));
		t.assert.ok(isKeyframeRule(nodes[1]));
	});

	it('detects an upper-case keyframe rule', (t) => {
		const nodes = nodesIn('@KEYFRAMES identifier { to {} }');

		t.assert.strictEqual(nodes.length, 2);
		t.assert.ok(!isKeyframeRule(nodes[0]));
		t.assert.ok(isKeyframeRule(nodes[1]));
	});

	it('detects a keyframe rule with nested from decl', (t) => {
		const nodes = nodesIn('@keyframes identifier { from {} }');

		t.assert.strictEqual(nodes.length, 2);
		t.assert.ok(!isKeyframeRule(nodes[0]));
		t.assert.ok(isKeyframeRule(nodes[1]));
	});

	it('detects a keyframe rule with nested percentage decl', (t) => {
		const nodes = nodesIn('@keyframes identifier { 50% {} }');

		t.assert.strictEqual(nodes.length, 2);
		t.assert.ok(!isKeyframeRule(nodes[0]));
		t.assert.ok(isKeyframeRule(nodes[1]));
	});

	it('ignores a normal rule', (t) => {
		const nodes = nodesIn('a {}');

		t.assert.strictEqual(nodes.length, 1);
		t.assert.ok(!isKeyframeRule(nodes[0]));
	});

	it('ignores a normal rule with nested decl', (t) => {
		const nodes = nodesIn('a { & b {} }');

		t.assert.strictEqual(nodes.length, 2);
		t.assert.ok(!isKeyframeRule(nodes[0]));
		t.assert.ok(!isKeyframeRule(nodes[1]));
	});

	it('ignores a normal rule with nested at-rule decl', (t) => {
		const nodes = nodesIn('a { @nest b & {} }');

		t.assert.strictEqual(nodes.length, 2);
		t.assert.ok(!isKeyframeRule(nodes[0]));
		t.assert.ok(!isKeyframeRule(nodes[1]));
	});

	it('ignores an @media', (t) => {
		const nodes = nodesIn('@media print { a {} }');

		t.assert.strictEqual(nodes.length, 2);
		t.assert.ok(!isKeyframeRule(nodes[0]));
		t.assert.ok(!isKeyframeRule(nodes[1]));
	});

	it('ignores an @supports rule', (t) => {
		const nodes = nodesIn('@supports (animation-name: test) { a {} }');

		t.assert.strictEqual(nodes.length, 2);
		t.assert.ok(!isKeyframeRule(nodes[0]));
		t.assert.ok(!isKeyframeRule(nodes[1]));
	});

	it('ignores a node without parent', (t) => {
		t.assert.ok(!isKeyframeRule(postcss.root()));
	});
});

function nodesIn(css) {
	const nodes = [];

	postcss.parse(css).walk((node) => nodes.push(node));

	return nodes;
}
