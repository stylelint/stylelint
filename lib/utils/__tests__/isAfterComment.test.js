'use strict';

const isAfterComment = require('../isAfterComment');
const postcss = require('postcss');

describe('isAfterComment', () => {
	it('returns true when after a single-line comment', () => {
		const root = postcss.parse(`
      /* comment */
      foo {}
    `);

		expect(isAfterComment(root.nodes[1])).toBe(true);
	});

	it('returns true when after a multi-line comment', () => {
		const root = postcss.parse(`
      /* comment
         and more comment */
      foo {}
    `);

		expect(isAfterComment(root.nodes[1])).toBe(true);
	});

	it('returns false when after a shared-line comment', () => {
		const root = postcss.parse(`
      bar {} /* comment */
      foo {}
    `);

		expect(isAfterComment(root.nodes[2])).toBe(false);
	});

	it('returns false when after a non-comment node', () => {
		const root = postcss.parse(`
      bar {}
      foo {}
    `);

		expect(isAfterComment(root.nodes[1])).toBe(false);
	});

	it('returns false when after no nodes', () => {
		const root = postcss.parse(`
      foo {}
    `);

		expect(isAfterComment(root.nodes[0])).toBe(false);
	});
});
