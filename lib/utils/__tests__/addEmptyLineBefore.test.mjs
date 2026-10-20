import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import addEmptyLineBefore from '../addEmptyLineBefore.mjs';
import postcss from 'postcss';

describe('addEmptyLineBefore', () => {
	it('adds single newline to the newline at the beginning', () => {
		assert.equal(run('a {}\n  b{}', '\n'), 'a {}\n\n  b{}');
	});

	it('adds single newline to newline at the beginning with CRLF', () => {
		assert.equal(run('a {}\r\n  b{}', '\r\n'), 'a {}\r\n\r\n  b{}');
	});

	it('adds single newline to newline at the end', () => {
		assert.equal(run('a {}\t\nb{}', '\n'), 'a {}\t\n\nb{}');
	});

	it('adds single newline to newline at the end with CRLF', () => {
		assert.equal(run('a {}\t\r\nb{}', '\r\n'), 'a {}\t\r\n\r\nb{}');
	});

	it('adds single newline to newline in the middle', () => {
		assert.equal(run('a {}  \n\tb{}', '\n'), 'a {}  \n\n\tb{}');
	});

	it('adds single newline to newline in the middle with CRLF', () => {
		assert.equal(run('a {}  \r\n\tb{}', '\r\n'), 'a {}  \r\n\r\n\tb{}');
	});

	it("adds two newlines if there aren't any existing newlines", () => {
		assert.equal(run('a {}  b{}', '\n'), 'a {}\n\n  b{}');
	});

	it("adds two newlines if there aren't any existing newlines with CRLF", () => {
		assert.equal(run('a {}  b{}', '\r\n'), 'a {}\r\n\r\n  b{}');
	});
});

function run(css, lineEnding) {
	const root = postcss.parse(css);

	addEmptyLineBefore(root.nodes[1], lineEnding);

	return root.toString();
}
