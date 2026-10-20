import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import getNextNonSharedLineCommentNode from '../getNextNonSharedLineCommentNode.mjs';
import postcss from 'postcss';

describe('getNextNonSharedLineCommentNode', () => {
	it('returns undefined if there is no next node', () => {
		const root = postcss.parse(`
      a {}
    `);

		assert.equal(getNextNonSharedLineCommentNode(root.nodes[0]), undefined);
	});

	it("returns undefined if there is no next node that's not a shared-line comment", () => {
		const root = postcss.parse(`
      a {} /* comment */
    `);

		assert.equal(getNextNonSharedLineCommentNode(root.nodes[0]), undefined);
	});

	it('returns the next node if it is not a shared-line comment', () => {
		const root = postcss.parse(`
      a {}
      b {}
    `);

		assert.equal(getNextNonSharedLineCommentNode(root.nodes[0]), root.nodes[1]);
	});

	it('returns the next node after a shared-line comment at the end of its line', () => {
		const root = postcss.parse(`
      a {} /* comment */
      b {}
    `);

		assert.equal(getNextNonSharedLineCommentNode(root.nodes[0]), root.nodes[2]);
	});

	it('returns the next node after a shared-line comment at the beginning of its line', () => {
		const root = postcss.parse(`
      a {}
      /* comment */ b {}
    `);

		assert.equal(getNextNonSharedLineCommentNode(root.nodes[0]), root.nodes[2]);
	});

	it('returns the next node after two shared-line comments', () => {
		const root = postcss.parse(`
      a {} /* comment */
      /* comment */ b {}
    `);

		assert.equal(getNextNonSharedLineCommentNode(root.nodes[0]), root.nodes[3]);
	});
});
