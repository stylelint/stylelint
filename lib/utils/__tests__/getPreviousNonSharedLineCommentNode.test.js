'use strict';

const getPreviousNonSharedLineCommentNode = require('../getPreviousNonSharedLineCommentNode');
const postcss = require('postcss');

describe('getPreviousNonSharedLineCommentNode', () => {
	it('returns undefined if there is no node before', () => {
		const root = postcss.parse(`
      a {}
    `);

		expect(getPreviousNonSharedLineCommentNode(root.nodes[0])).toBeUndefined();
	});

	it('returns undefined if there is no node before the prior shared-line comment', () => {
		const root = postcss.parse(`
      /* comment */ a {}
    `);

		expect(getPreviousNonSharedLineCommentNode(root.nodes[0])).toBeUndefined();
	});

	it('returns the previous node if it is not a shared-line comment', () => {
		const root = postcss.parse(`
      a {}
      b {}
    `);

		expect(getPreviousNonSharedLineCommentNode(root.nodes[1])).toBe(root.nodes[0]);
	});

	it('returns the node before a prior shared-line comment at the end of its line', () => {
		const root = postcss.parse(`
      a {} /* comment */
      b {}
    `);

		expect(getPreviousNonSharedLineCommentNode(root.nodes[2])).toBe(root.nodes[0]);
	});

	it('returns the node before a prior shared-line comment at the beginning of its line', () => {
		const root = postcss.parse(`
      a {}
      /* comment */ b {}
    `);

		expect(getPreviousNonSharedLineCommentNode(root.nodes[2])).toBe(root.nodes[0]);
	});

	it('returns the node before two shared-line comments', () => {
		const root = postcss.parse(`
      a {} /* comment */
      /* comment */ b {}
    `);

		expect(getPreviousNonSharedLineCommentNode(root.nodes[3])).toBe(root.nodes[0]);
	});
});
