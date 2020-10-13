'use strict';

const isSharedLineComment = require('../isSharedLineComment');
const postcss = require('postcss');

describe('isSharedLineComment', () => {
	it('returns false for the first node', () => {
		const css = `
			/* comment */
		`;

		expect(isSharedLineComment(comment(css))).toBe(false);
	});

	it('returns false for a non-shared-line comment before a rule', () => {
		const css = `
			/* comment */
			a {}
		`;

		expect(isSharedLineComment(comment(css))).toBe(false);
	});

	it('returns false for a non-shared-line comment after a rule', () => {
		const css = `
			a {}
			/* comment */
		`;

		expect(isSharedLineComment(comment(css))).toBe(false);
	});

	it('returns true for a shared-line comment before a rule', () => {
		const css = `
			/* comment */ a {}
		`;

		expect(isSharedLineComment(comment(css))).toBe(true);
	});

	it('returns true for a shared-line comment after a rule', () => {
		const css = `
			a {} /* comment */
		`;

		expect(isSharedLineComment(comment(css))).toBe(true);
	});

	it('returns false for a shared-line non-comment', () => {
		const root = postcss.parse(`
			a {} b {}
		`);

		expect(isSharedLineComment(root.nodes[0])).toBe(false);
		expect(isSharedLineComment(root.nodes[1])).toBe(false);
	});

	it('returns true when comment shares a line with the start of a rule block, before it', () => {
		const css = `
			/* comment */ a {
				color: pink;
			}
		`;

		expect(isSharedLineComment(comment(css))).toBe(true);
	});

	it('returns true when comment shares a line with the start of a rule block with a multiline selector, before it', () => {
		const css = `
			/* comment */ a,
			b {
				color: pink;
			}
		`;

		expect(isSharedLineComment(comment(css))).toBe(true);
	});

	it('returns true when comment shares a line with the start of a rule block, after it', () => {
		const css = `
			a { /* comment */
				color: pink;
			}
		`;

		expect(isSharedLineComment(comment(css))).toBe(true);
	});

	it('returns true when comment shares a line with the start of a rule block with a multiline selector, after it', () => {
		const css = `
			a,
			b { /* comment */
				color: pink;
			}
		`;

		expect(isSharedLineComment(comment(css))).toBe(true);
	});

	it('returns true when comment shares a line with the start of an at-rule block, before it', () => {
		const css = `
			/* comment */ @media (min-width: 0px) {
				a { color: pink; }
			}
		`;

		expect(isSharedLineComment(comment(css))).toBe(true);
	});

	it('returns true when comment shares a line with the start of an at-rule block with a multiline selector, before it', () => {
		const css = `
			/* comment */ @media
			(min-width: 0px) {
				a { color: pink; }
			}
		`;

		expect(isSharedLineComment(comment(css))).toBe(true);
	});

	it('returns true when comment shares a line with the start of an at-rule block, after it', () => {
		const css = `
			@media (min-width: 0px) { /* comment */
				a { color: pink; }
			}
		`;

		expect(isSharedLineComment(comment(css))).toBe(true);
	});

	it('returns true when comment shares a line with the start of an at-rule block with a multiline selector, after it', () => {
		const css = `
			@media
			(min-width: 0px) { /* comment */
				a { color: pink; }
			}
		`;

		expect(isSharedLineComment(comment(css))).toBe(true);
	});

	it('returns false when comment shares a line with only another comment', () => {
		const css = `
			/* comment */ /* comment */
		`;

		expect(isSharedLineComment(comment(css))).toBe(false);
	});

	it('returns true when comment shares a line with another comment and a non-comment', () => {
		const css = `
			/* comment */ /* comment */ a {}
		`;

		expect(isSharedLineComment(comment(css))).toBe(true);
	});

	it('returns true when comment shares a line with the end of a multi-line rule block, after it', () => {
		const css = `
			a {
				color: pink;
			} /* comment */
		`;

		expect(isSharedLineComment(comment(css))).toBe(true);
	});

	it('returns true when comment shares a line with the end of a multi-line property declaration, after it', () => {
		const css = `
			a {
				border-radius:
					1em
					0; /* comment */
			}
		`;

		expect(isSharedLineComment(comment(css))).toBe(true);
	});

	it('returns true when comment shares a line with the start of a multi-line property declaration, before it', () => {
		const css = `
			a {
				/* comment */ border-radius:
					1em
					0;
			}
		`;

		expect(isSharedLineComment(comment(css))).toBe(true);
	});
});

function comment(css) {
	const comments = [];

	// TODO: Issue #4985
	// eslint-disable-next-line no-shadow
	postcss.parse(css).walkComments((comment) => comments.push(comment));

	return comments[0];
}
