'use strict';

const postcss = require('postcss');
const removeEmptyLinesAfter = require('../removeEmptyLinesAfter');

describe('removeEmptyLineBefore', () => {
	it('removes single newline from the newline at the beginning', () => {
		expect(run('a {\n\n  }', '\n')).toBe('a {\n  }');
	});

	it('removes single newline from newline at the beginning with CRLF', () => {
		expect(run('a {\r\n\r\n  }', '\r\n')).toBe('a {\r\n  }');
	});

	it('removes single newline from newline at the end', () => {
		expect(run('a {\t\n\n}', '\n')).toBe('a {\t\n}');
	});

	it('removes single newline from newline at the end with CRLF', () => {
		expect(run('a {\t\r\n\r\n}', '\r\n')).toBe('a {\t\r\n}');
	});

	it('removes single newline from newline in the middle', () => {
		expect(run('a {  \n\n\t}', '\n')).toBe('a {  \n\t}');
	});

	it('removes single newline to newline in the middle with CRLF', () => {
		expect(run('a {  \r\n\r\n\t}', '\r\n')).toBe('a {  \r\n\t}');
	});

	it('removes two newlines if there are three newlines', () => {
		expect(run('a {\n\n\n  }', '\n')).toBe('a {\n  }');
	});

	it('removes two newlines if there are three newlines with CRLF', () => {
		expect(run('a {\r\n\r\n\r\n  }', '\r\n')).toBe('a {\r\n  }');
	});

	it('removes three newlines if there are four newlines', () => {
		expect(run('a {\n\n\n\n  }', '\n')).toBe('a {\n  }');
	});

	it('removes three newlines if there are four newlines with CRLF', () => {
		expect(run('a {\r\n\r\n\r\n\r\n  }', '\r\n')).toBe('a {\r\n  }');
	});
});

function run(css, lineEnding) {
	const root = postcss.parse(css);

	removeEmptyLinesAfter(root.nodes[0], lineEnding);

	return root.toString();
}
