import { describe, it } from 'node:test';

import stripIndent from '../stripIndent.mjs';

describe('stripIndent', () => {
	it('strips the shortest indentation and trims the surrounding whitespace', (t) => {
		t.assert.strictEqual(
			stripIndent`
				a {}
			b {}
				c {}
		`,
			'a {}\nb {}\n\tc {}',
		);
	});

	it('strips nothing when a line with content has no indentation', (t) => {
		t.assert.strictEqual(
			stripIndent`
file.css
  1:1  foo
		`,
			'file.css\n  1:1  foo',
		);
	});

	it('ignores lines without content when measuring', (t) => {
		t.assert.strictEqual(
			stripIndent`
			a {}

			b {}
		`,
			'a {}\n\nb {}',
		);
	});

	it('counts characters, so a tab and a space are the same width', (t) => {
		t.assert.strictEqual(
			stripIndent`
				a {}
	    b {}
		`,
			'a {}\n b {}',
		);
	});

	it('measures lines created by escape sequences', (t) => {
		t.assert.strictEqual(
			stripIndent`
			a {}\n\t\t\tb {}
		`,
			'a {}\nb {}',
		);
	});

	it('interpolates values', (t) => {
		const value = 'red';

		t.assert.strictEqual(
			stripIndent`
			a { color: ${value}; }
		`,
			'a { color: red; }',
		);
	});

	it('returns an empty string for a template without content', (t) => {
		t.assert.strictEqual(
			stripIndent`
		`,
			'',
		);
	});
});
