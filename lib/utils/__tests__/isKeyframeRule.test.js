'use strict';

const isKeyframeRule = require('../isKeyframeRule');
const postcss = require('postcss');

describe('isKeyframeRule', () => {
	it('detects a standard keyframe rule', () => {
		const nodes = nodesIn('@keyframes identifier { to {} }');

		expect(nodes).toHaveLength(2);
		expect(isKeyframeRule(nodes[0])).toBeFalsy();
		expect(isKeyframeRule(nodes[1])).toBeTruthy();
	});

	it('detects a mixed-case keyframe rule', () => {
		const nodes = nodesIn('@kEyFrAmEs identifier { to {} }');

		expect(nodes).toHaveLength(2);
		expect(isKeyframeRule(nodes[0])).toBeFalsy();
		expect(isKeyframeRule(nodes[1])).toBeTruthy();
	});

	it('detects an upper-case keyframe rule', () => {
		const nodes = nodesIn('@KEYFRAMES identifier { to {} }');

		expect(nodes).toHaveLength(2);
		expect(isKeyframeRule(nodes[0])).toBeFalsy();
		expect(isKeyframeRule(nodes[1])).toBeTruthy();
	});

	it('detects a keyframe rule with nested from decl', () => {
		const nodes = nodesIn('@keyframes identifier { from {} }');

		expect(nodes).toHaveLength(2);
		expect(isKeyframeRule(nodes[0])).toBeFalsy();
		expect(isKeyframeRule(nodes[1])).toBeTruthy();
	});

	it('detects a keyframe rule with nested percentage decl', () => {
		const nodes = nodesIn('@keyframes identifier { 50% {} }');

		expect(nodes).toHaveLength(2);
		expect(isKeyframeRule(nodes[0])).toBeFalsy();
		expect(isKeyframeRule(nodes[1])).toBeTruthy();
	});

	it('ignores a normal rule', () => {
		const nodes = nodesIn('a {}');

		expect(nodes).toHaveLength(1);
		expect(isKeyframeRule(nodes[0])).toBeFalsy();
	});

	it('ignores a normal rule with nested decl', () => {
		const nodes = nodesIn('a { & b {} }');

		expect(nodes).toHaveLength(2);
		expect(isKeyframeRule(nodes[0])).toBeFalsy();
		expect(isKeyframeRule(nodes[1])).toBeFalsy();
	});

	it('ignores a normal rule with nested at-rule decl', () => {
		const nodes = nodesIn('a { @nest b & {} }');

		expect(nodes).toHaveLength(2);
		expect(isKeyframeRule(nodes[0])).toBeFalsy();
		expect(isKeyframeRule(nodes[1])).toBeFalsy();
	});

	it('ignores an @media', () => {
		const nodes = nodesIn('@media print { a {} }');

		expect(nodes).toHaveLength(2);
		expect(isKeyframeRule(nodes[0])).toBeFalsy();
		expect(isKeyframeRule(nodes[1])).toBeFalsy();
	});

	it('ignores an @supports rule', () => {
		const nodes = nodesIn('@supports (animation-name: test) { a {} }');

		expect(nodes).toHaveLength(2);
		expect(isKeyframeRule(nodes[0])).toBeFalsy();
		expect(isKeyframeRule(nodes[1])).toBeFalsy();
	});
});

function nodesIn(css) {
	const nodes = [];

	postcss.parse(css).walk((node) => nodes.push(node));

	return nodes;
}
