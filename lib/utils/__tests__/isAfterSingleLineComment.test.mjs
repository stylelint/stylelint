import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import isAfterSingleLineComment from '../isAfterSingleLineComment.mjs';
import postcss from 'postcss';

describe('isAfterSingleLineComment', () => {
	it('returns true when after a single-line comment', () => {
		const root = postcss.parse(`
      /* comment */
      foo {}
    `);

		assert.equal(isAfterSingleLineComment(root.nodes[1]), true);
	});

	it('returns false when after a multi-line comment', () => {
		const root = postcss.parse(`
      /* comment
         and more comment */
      foo {}
    `);

		assert.equal(isAfterSingleLineComment(root.nodes[1]), false);
	});

	it('returns false when after a shared-line comment', () => {
		const root = postcss.parse(`
      bar {} /* comment */
      foo {}
    `);

		assert.equal(isAfterSingleLineComment(root.nodes[2]), false);
	});

	it('returns false when after a nested shared-line comment', () => {
		const root = postcss.parse(`
      @media { /* comment */
        foo {}
      }
    `);

		assert.equal(isAfterSingleLineComment(root.nodes[0].nodes[1]), false);
	});

	it('returns false when after a non-comment node', () => {
		const root = postcss.parse(`
      bar {}
      foo {}
    `);

		assert.equal(isAfterSingleLineComment(root.nodes[1]), false);
	});

	it('returns false when after no nodes', () => {
		const root = postcss.parse(`
      foo {}
    `);

		assert.equal(isAfterSingleLineComment(root.nodes[0]), false);
	});
});
