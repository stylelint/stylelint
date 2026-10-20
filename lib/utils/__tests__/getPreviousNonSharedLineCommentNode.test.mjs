import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import getPreviousNonSharedLineCommentNode from '../getPreviousNonSharedLineCommentNode.mjs';
import postcss from 'postcss';

describe('getPreviousNonSharedLineCommentNode', () => {
	it('returns undefined if there is no node before', () => {
		const root = postcss.parse(`
      a {}
    `);

		assert.equal(getPreviousNonSharedLineCommentNode(root.nodes[0]), undefined);
	});

	it('returns undefined if there is no node before the prior shared-line comment', () => {
		const root = postcss.parse(`
      /* comment */ a {}
    `);

		assert.equal(getPreviousNonSharedLineCommentNode(root.nodes[0]), undefined);
	});

	it('returns the previous node if it is not a shared-line comment', () => {
		const root = postcss.parse(`
      a {}
      b {}
    `);

		assert.equal(getPreviousNonSharedLineCommentNode(root.nodes[1]), root.nodes[0]);
	});

	it('returns the node before a prior shared-line comment at the end of its line', () => {
		const root = postcss.parse(`
      a {} /* comment */
      b {}
    `);

		assert.equal(getPreviousNonSharedLineCommentNode(root.nodes[2]), root.nodes[0]);
	});

	it('returns the node before a prior shared-line comment at the beginning of its line', () => {
		const root = postcss.parse(`
      a {}
      /* comment */ b {}
    `);

		assert.equal(getPreviousNonSharedLineCommentNode(root.nodes[2]), root.nodes[0]);
	});

	it('returns the node before two shared-line comments', () => {
		const root = postcss.parse(`
      a {} /* comment */
      /* comment */ b {}
    `);

		assert.equal(getPreviousNonSharedLineCommentNode(root.nodes[3]), root.nodes[0]);
	});
});
