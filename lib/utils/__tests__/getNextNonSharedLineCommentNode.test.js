'use strict';

const getNextNonSharedLineCommentNode = require('../getNextNonSharedLineCommentNode');
const postcss = require('postcss');

describe('getNextNonSharedLineCommentNode', () => {
	it('returns undefined if there is no next node', () => {
		const root = postcss.parse(`
      a {}
    `);

		expect(getNextNonSharedLineCommentNode(root.nodes[0])).toBeUndefined();
	});

	it("returns undefined if there is no next node that's not a shared-line comment", () => {
		const root = postcss.parse(`
      a {} /* comment */
    `);

		expect(getNextNonSharedLineCommentNode(root.nodes[0])).toBeUndefined();
	});

	it('returns the next node if it is not a shared-line comment', () => {
		const root = postcss.parse(`
      a {}
      b {}
    `);

		expect(getNextNonSharedLineCommentNode(root.nodes[0])).toBe(root.nodes[1]);
	});

	it('returns the next node after a shared-line comment at the end of its line', () => {
		const root = postcss.parse(`
      a {} /* comment */
      b {}
    `);

		expect(getNextNonSharedLineCommentNode(root.nodes[0])).toBe(root.nodes[2]);
	});

	it('returns the next node after a shared-line comment at the beginning of its line', () => {
		const root = postcss.parse(`
      a {}
      /* comment */ b {}
    `);

		expect(getNextNonSharedLineCommentNode(root.nodes[0])).toBe(root.nodes[2]);
	});

	it('returns the next node after two shared-line comments', () => {
		const root = postcss.parse(`
      a {} /* comment */
      /* comment */ b {}
    `);

		expect(getNextNonSharedLineCommentNode(root.nodes[0])).toBe(root.nodes[3]);
	});
});
