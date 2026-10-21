import { describe, it } from 'node:test';

import isSharedLineComment from '../isSharedLineComment.mjs';
import postcss from 'postcss';

describe('isSharedLineComment', () => {
	it('returns false for the first node', (t) => {
		const css = `
			/* comment */
		`;

		t.assert.strictEqual(isSharedLineComment(comment(css)), false);
	});

	it('returns false for a non-shared-line comment before a rule', (t) => {
		const css = `
			/* comment */
			a {}
		`;

		t.assert.strictEqual(isSharedLineComment(comment(css)), false);
	});

	it('returns false for a non-shared-line comment after a rule', (t) => {
		const css = `
			a {}
			/* comment */
		`;

		t.assert.strictEqual(isSharedLineComment(comment(css)), false);
	});

	it('returns true for a shared-line comment before a rule', (t) => {
		const css = `
			/* comment */ a {}
		`;

		t.assert.strictEqual(isSharedLineComment(comment(css)), true);
	});

	it('returns true for a shared-line comment after a rule', (t) => {
		const css = `
			a {} /* comment */
		`;

		t.assert.strictEqual(isSharedLineComment(comment(css)), true);
	});

	it('returns false for a shared-line non-comment', (t) => {
		const root = postcss.parse(`
			a {} b {}
		`);

		t.assert.strictEqual(isSharedLineComment(root.nodes[0]), false);
		t.assert.strictEqual(isSharedLineComment(root.nodes[1]), false);
	});

	it('returns true when comment shares a line with the start of a rule block, before it', (t) => {
		const css = `
			/* comment */ a {
				color: pink;
			}
		`;

		t.assert.strictEqual(isSharedLineComment(comment(css)), true);
	});

	it('returns true when comment shares a line with the start of a rule block with a multiline selector, before it', (t) => {
		const css = `
			/* comment */ a,
			b {
				color: pink;
			}
		`;

		t.assert.strictEqual(isSharedLineComment(comment(css)), true);
	});

	it('returns true when comment shares a line with the start of a rule block, after it', (t) => {
		const css = `
			a { /* comment */
				color: pink;
			}
		`;

		t.assert.strictEqual(isSharedLineComment(comment(css)), true);
	});

	it('returns true when comment shares a line with the start of a rule block with a multiline selector, after it', (t) => {
		const css = `
			a,
			b { /* comment */
				color: pink;
			}
		`;

		t.assert.strictEqual(isSharedLineComment(comment(css)), true);
	});

	it('returns true when comment shares a line with the start of an at-rule block, before it', (t) => {
		const css = `
			/* comment */ @media (min-width: 0px) {
				a { color: pink; }
			}
		`;

		t.assert.strictEqual(isSharedLineComment(comment(css)), true);
	});

	it('returns true when comment shares a line with the start of an at-rule block with a multiline selector, before it', (t) => {
		const css = `
			/* comment */ @media
			(min-width: 0px) {
				a { color: pink; }
			}
		`;

		t.assert.strictEqual(isSharedLineComment(comment(css)), true);
	});

	it('returns true when comment shares a line with the start of an at-rule block, after it', (t) => {
		const css = `
			@media (min-width: 0px) { /* comment */
				a { color: pink; }
			}
		`;

		t.assert.strictEqual(isSharedLineComment(comment(css)), true);
	});

	it('returns true when comment shares a line with the start of an at-rule block with a multiline selector, after it', (t) => {
		const css = `
			@media
			(min-width: 0px) { /* comment */
				a { color: pink; }
			}
		`;

		t.assert.strictEqual(isSharedLineComment(comment(css)), true);
	});

	it('returns false when comment shares a line with only another comment', (t) => {
		const css = `
			/* comment */ /* comment */
		`;

		t.assert.strictEqual(isSharedLineComment(comment(css)), false);
	});

	it('returns true when comment shares a line with another comment and a non-comment', (t) => {
		const css = `
			/* comment */ /* comment */ a {}
		`;

		t.assert.strictEqual(isSharedLineComment(comment(css)), true);
	});

	it('returns true when comment shares a line with the end of a multi-line rule block, after it', (t) => {
		const css = `
			a {
				color: pink;
			} /* comment */
		`;

		t.assert.strictEqual(isSharedLineComment(comment(css)), true);
	});

	it('returns true when comment shares a line with the end of a multi-line property declaration, after it', (t) => {
		const css = `
			a {
				border-radius:
					1em
					0; /* comment */
			}
		`;

		t.assert.strictEqual(isSharedLineComment(comment(css)), true);
	});

	it('returns true when comment shares a line with the start of a multi-line property declaration, before it', (t) => {
		const css = `
			a {
				/* comment */ border-radius:
					1em
					0;
			}
		`;

		t.assert.strictEqual(isSharedLineComment(comment(css)), true);
	});
});

function comment(css) {
	const comments = [];

	postcss.parse(css).walkComments((c) => comments.push(c));

	return comments[0];
}
