import stripIndent from '../stripIndent.mjs';

describe('stripIndent', () => {
	it('strips the shortest indentation and trims the surrounding whitespace', () => {
		expect(stripIndent`
				a {}
			b {}
				c {}
		`).toBe('a {}\nb {}\n\tc {}');
	});

	it('strips nothing when a line with content has no indentation', () => {
		expect(stripIndent`
file.css
  1:1  foo
		`).toBe('file.css\n  1:1  foo');
	});

	it('ignores lines without content when measuring', () => {
		expect(stripIndent`
			a {}

			b {}
		`).toBe('a {}\n\nb {}');
	});

	it('counts characters, so a tab and a space are the same width', () => {
		expect(stripIndent`
				a {}
	    b {}
		`).toBe('a {}\n b {}');
	});

	it('measures lines created by escape sequences', () => {
		expect(stripIndent`
			a {}\n\t\t\tb {}
		`).toBe('a {}\nb {}');
	});

	it('interpolates values', () => {
		const value = 'red';

		expect(stripIndent`
			a { color: ${value}; }
		`).toBe('a { color: red; }');
	});

	it('returns an empty string for a template without content', () => {
		expect(stripIndent`
		`).toBe('');
	});
});
