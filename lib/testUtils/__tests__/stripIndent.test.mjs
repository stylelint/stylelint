import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import stripIndent from '../stripIndent.mjs';

describe('stripIndent', () => {
	it('strips the shortest indentation and trims the surrounding whitespace', () => {
		assert.equal(
			stripIndent`
				a {}
			b {}
				c {}
		`,
			'a {}\nb {}\n\tc {}',
		);
	});

	it('strips nothing when a line with content has no indentation', () => {
		assert.equal(
			stripIndent`
file.css
  1:1  foo
		`,
			'file.css\n  1:1  foo',
		);
	});

	it('ignores lines without content when measuring', () => {
		assert.equal(
			stripIndent`
			a {}

			b {}
		`,
			'a {}\n\nb {}',
		);
	});

	it('counts characters, so a tab and a space are the same width', () => {
		assert.equal(
			stripIndent`
				a {}
	    b {}
		`,
			'a {}\n b {}',
		);
	});

	it('measures lines created by escape sequences', () => {
		assert.equal(
			stripIndent`
			a {}\n\t\t\tb {}
		`,
			'a {}\nb {}',
		);
	});

	it('interpolates values', () => {
		const value = 'red';

		assert.equal(
			stripIndent`
			a { color: ${value}; }
		`,
			'a { color: red; }',
		);
	});

	it('returns an empty string for a template without content', () => {
		assert.equal(
			stripIndent`
		`,
			'',
		);
	});
});
