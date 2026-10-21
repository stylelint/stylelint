import { describe, it } from 'node:test';

import isAfterComment from '../isAfterComment.mjs';
import postcss from 'postcss';

describe('isAfterComment', () => {
	it('returns true when after a single-line comment', (t) => {
		const root = postcss.parse(`
      /* comment */
      foo {}
    `);

		t.assert.strictEqual(isAfterComment(root.nodes[1]), true);
	});

	it('returns true when after a multi-line comment', (t) => {
		const root = postcss.parse(`
      /* comment
         and more comment */
      foo {}
    `);

		t.assert.strictEqual(isAfterComment(root.nodes[1]), true);
	});

	it('returns false when after a shared-line comment', (t) => {
		const root = postcss.parse(`
      bar {} /* comment */
      foo {}
    `);

		t.assert.strictEqual(isAfterComment(root.nodes[2]), false);
	});

	it('returns false when after a non-comment node', (t) => {
		const root = postcss.parse(`
      bar {}
      foo {}
    `);

		t.assert.strictEqual(isAfterComment(root.nodes[1]), false);
	});

	it('returns false when after no nodes', (t) => {
		const root = postcss.parse(`
      foo {}
    `);

		t.assert.strictEqual(isAfterComment(root.nodes[0]), false);
	});
});
