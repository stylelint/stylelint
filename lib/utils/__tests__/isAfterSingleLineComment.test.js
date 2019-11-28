'use strict';

const isAfterSingleLineComment = require('../isAfterSingleLineComment');
const postcss = require('postcss');

describe('isAfterSingleLineComment', () => {
	it('returns true when after a single-line comment', () => {
		const root = postcss.parse(`
      /* comment */
      foo {}
    `);

		expect(isAfterSingleLineComment(root.nodes[1])).toBe(true);
	});

	it('returns false when after a multi-line comment', () => {
		const root = postcss.parse(`
      /* comment
         and more comment */
      foo {}
    `);

		expect(isAfterSingleLineComment(root.nodes[1])).toBe(false);
	});

	it('returns false when after a shared-line comment', () => {
		const root = postcss.parse(`
      bar {} /* comment */
      foo {}
    `);

		expect(isAfterSingleLineComment(root.nodes[2])).toBe(false);
	});

	it('returns false when after a nested shared-line comment', () => {
		const root = postcss.parse(`
      @media { /* comment */
        foo {}
      }
    `);

		expect(isAfterSingleLineComment(root.nodes[0].nodes[1])).toBe(false);
	});

	it('returns false when after a non-comment node', () => {
		const root = postcss.parse(`
      bar {}
      foo {}
    `);

		expect(isAfterSingleLineComment(root.nodes[1])).toBe(false);
	});

	it('returns false when after no nodes', () => {
		const root = postcss.parse(`
      foo {}
    `);

		expect(isAfterSingleLineComment(root.nodes[0])).toBe(false);
	});
});
