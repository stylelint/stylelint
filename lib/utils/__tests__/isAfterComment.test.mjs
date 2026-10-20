import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import isAfterComment from '../isAfterComment.mjs';
import postcss from 'postcss';

describe('isAfterComment', () => {
	it('returns true when after a single-line comment', () => {
		const root = postcss.parse(`
      /* comment */
      foo {}
    `);

		assert.equal(isAfterComment(root.nodes[1]), true);
	});

	it('returns true when after a multi-line comment', () => {
		const root = postcss.parse(`
      /* comment
         and more comment */
      foo {}
    `);

		assert.equal(isAfterComment(root.nodes[1]), true);
	});

	it('returns false when after a shared-line comment', () => {
		const root = postcss.parse(`
      bar {} /* comment */
      foo {}
    `);

		assert.equal(isAfterComment(root.nodes[2]), false);
	});

	it('returns false when after a non-comment node', () => {
		const root = postcss.parse(`
      bar {}
      foo {}
    `);

		assert.equal(isAfterComment(root.nodes[1]), false);
	});

	it('returns false when after no nodes', () => {
		const root = postcss.parse(`
      foo {}
    `);

		assert.equal(isAfterComment(root.nodes[0]), false);
	});
});
