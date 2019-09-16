'use strict';

const addEmptyLineAfter = require('../addEmptyLineAfter');
const postcss = require('postcss');

describe('addEmptyLineBefore', () => {
	it('adds single newline to the newline at the beginning', () => {
		expect(run('a {\n}', '\n')).toBe('a {\n\n}');
	});

	it('adds single newline to newline at the beginning with CRLF', () => {
		expect(run('a {\r\n}', '\r\n')).toBe('a {\r\n\r\n}');
	});

	it('adds single newline to newline at the end', () => {
		expect(run('a {\t\n}', '\n')).toBe('a {\t\n\n}');
	});

	it('adds single newline to newline at the end with CRLF', () => {
		expect(run('a {\t\r\n}', '\r\n')).toBe('a {\t\r\n\r\n}');
	});

	it('adds single newline to newline in the middle', () => {
		expect(run('a {  \n\t}', '\n')).toBe('a {  \n\n\t}');
	});

	it('adds single newline to newline in the middle with CRLF', () => {
		expect(run('a {  \r\n\t}', '\r\n')).toBe('a {  \r\n\r\n\t}');
	});

	it("adds two newlines if there aren't any existing newlines", () => {
		expect(run('a {  }', '\n')).toBe('a {  \n\n}');
	});

	it("adds two newlines if there aren't any existing newlines with CRLF", () => {
		expect(run('a {  }', '\r\n')).toBe('a {  \r\n\r\n}');
	});

	it("adds two newlines if there aren't any newlines after semicolon", () => {
		expect(run('a {\n;}', '\n')).toBe('a {\n;\n\n}');
	});

	it("adds two newlines if there aren't any newlines after semicolon with CRLF", () => {
		expect(run('a {\r\n;}', '\r\n')).toBe('a {\r\n;\r\n\r\n}');
	});
});

function run(css, lineEnding) {
	const root = postcss.parse(css);

	addEmptyLineAfter(root.nodes[0], lineEnding);

	return root.toString();
}
