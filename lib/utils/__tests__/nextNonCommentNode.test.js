'use strict';

const nextNonCommentNode = require('../nextNonCommentNode');
const postcss = require('postcss');

describe('nextNonCommentNode', () => {
	let caseA;
	let caseB;
	let aNode;
	let bNode;
	let colorNode;

	beforeEach(() => {
		aNode = undefined;
		bNode = undefined;
		colorNode = undefined;
		caseA = 'a {} /* x */ b {}';
		caseB = 'a { /* x */ color: pink; /* y */ }';
	});

	it('next node is a selector preceded by a comment', () => {
		postcss.parse(caseA).walkRules((rule) => {
			if (rule.selector === 'a') {
				aNode = rule;
			}

			if (rule.selector === 'b') {
				bNode = rule;
			}
		});

		expect(nextNonCommentNode(aNode.next())).toBe(bNode);
	});

	it('next node does not exist', () => {
		postcss.parse(caseA).walkRules((rule) => {
			if (rule.selector === 'a') {
				aNode = rule;
			}

			if (rule.selector === 'b') {
				bNode = rule;
			}
		});

		expect(nextNonCommentNode(bNode.next())).toBeNull();
	});

	it('next node is a declaration preceded by a comment', () => {
		const root = postcss.parse(caseB);

		root.walkRules((rule) => {
			aNode = rule;
		});
		root.walkDecls((rule) => {
			colorNode = rule;
		});

		expect(nextNonCommentNode(aNode.first)).toBe(colorNode);
	});

	it('next node is null preceded by a comment', () => {
		postcss.parse(caseB).walkDecls((rule) => {
			colorNode = rule;
		});

		expect(nextNonCommentNode(colorNode.next())).toBeNull();
	});
});
