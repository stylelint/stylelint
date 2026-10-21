import { describe, it } from 'node:test';

import getPreviousNonSharedLineCommentNode from '../getPreviousNonSharedLineCommentNode.mjs';
import postcss from 'postcss';

describe('getPreviousNonSharedLineCommentNode', () => {
	it('returns undefined if there is no node before', (t) => {
		const root = postcss.parse(`
      a {}
    `);

		t.assert.strictEqual(getPreviousNonSharedLineCommentNode(root.nodes[0]), undefined);
	});

	it('returns undefined if there is no node before the prior shared-line comment', (t) => {
		const root = postcss.parse(`
      /* comment */ a {}
    `);

		t.assert.strictEqual(getPreviousNonSharedLineCommentNode(root.nodes[0]), undefined);
	});

	it('returns the previous node if it is not a shared-line comment', (t) => {
		const root = postcss.parse(`
      a {}
      b {}
    `);

		t.assert.strictEqual(getPreviousNonSharedLineCommentNode(root.nodes[1]), root.nodes[0]);
	});

	it('returns the node before a prior shared-line comment at the end of its line', (t) => {
		const root = postcss.parse(`
      a {} /* comment */
      b {}
    `);

		t.assert.strictEqual(getPreviousNonSharedLineCommentNode(root.nodes[2]), root.nodes[0]);
	});

	it('returns the node before a prior shared-line comment at the beginning of its line', (t) => {
		const root = postcss.parse(`
      a {}
      /* comment */ b {}
    `);

		t.assert.strictEqual(getPreviousNonSharedLineCommentNode(root.nodes[2]), root.nodes[0]);
	});

	it('returns the node before two shared-line comments', (t) => {
		const root = postcss.parse(`
      a {} /* comment */
      /* comment */ b {}
    `);

		t.assert.strictEqual(getPreviousNonSharedLineCommentNode(root.nodes[3]), root.nodes[0]);
	});
});
