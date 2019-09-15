'use strict';

const addEmptyLineBefore = require('../addEmptyLineBefore');
const postcss = require('postcss');

describe('addEmptyLineBefore', () => {
	it('adds single newline to the newline at the beginning', () => {
		expect(run('a {}\n  b{}', '\n')).toBe('a {}\n\n  b{}');
	});

	it('adds single newline to newline at the beginning with CRLF', () => {
		expect(run('a {}\r\n  b{}', '\r\n')).toBe('a {}\r\n\r\n  b{}');
	});

	it('adds single newline to newline at the end', () => {
		expect(run('a {}\t\nb{}', '\n')).toBe('a {}\t\n\nb{}');
	});

	it('adds single newline to newline at the end with CRLF', () => {
		expect(run('a {}\t\r\nb{}', '\r\n')).toBe('a {}\t\r\n\r\nb{}');
	});

	it('adds single newline to newline in the middle', () => {
		expect(run('a {}  \n\tb{}', '\n')).toBe('a {}  \n\n\tb{}');
	});

	it('adds single newline to newline in the middle with CRLF', () => {
		expect(run('a {}  \r\n\tb{}', '\r\n')).toBe('a {}  \r\n\r\n\tb{}');
	});

	it("adds two newlines if there aren't any existing newlines", () => {
		expect(run('a {}  b{}', '\n')).toBe('a {}\n\n  b{}');
	});

	it("adds two newlines if there aren't any existing newlines with CRLF", () => {
		expect(run('a {}  b{}', '\r\n')).toBe('a {}\r\n\r\n  b{}');
	});
});

function run(css, lineEnding) {
	const root = postcss.parse(css);

	addEmptyLineBefore(root.nodes[1], lineEnding);

	return root.toString();
}
