import { describe, it } from 'node:test';

import addEmptyLineBefore from '../addEmptyLineBefore.mjs';
import postcss from 'postcss';

describe('addEmptyLineBefore', () => {
	it('adds single newline to the newline at the beginning', (t) => {
		t.assert.strictEqual(run('a {}\n  b{}', '\n'), 'a {}\n\n  b{}');
	});

	it('adds single newline to newline at the beginning with CRLF', (t) => {
		t.assert.strictEqual(run('a {}\r\n  b{}', '\r\n'), 'a {}\r\n\r\n  b{}');
	});

	it('adds single newline to newline at the end', (t) => {
		t.assert.strictEqual(run('a {}\t\nb{}', '\n'), 'a {}\t\n\nb{}');
	});

	it('adds single newline to newline at the end with CRLF', (t) => {
		t.assert.strictEqual(run('a {}\t\r\nb{}', '\r\n'), 'a {}\t\r\n\r\nb{}');
	});

	it('adds single newline to newline in the middle', (t) => {
		t.assert.strictEqual(run('a {}  \n\tb{}', '\n'), 'a {}  \n\n\tb{}');
	});

	it('adds single newline to newline in the middle with CRLF', (t) => {
		t.assert.strictEqual(run('a {}  \r\n\tb{}', '\r\n'), 'a {}  \r\n\r\n\tb{}');
	});

	it("adds two newlines if there aren't any existing newlines", (t) => {
		t.assert.strictEqual(run('a {}  b{}', '\n'), 'a {}\n\n  b{}');
	});

	it("adds two newlines if there aren't any existing newlines with CRLF", (t) => {
		t.assert.strictEqual(run('a {}  b{}', '\r\n'), 'a {}\r\n\r\n  b{}');
	});
});

function run(css, lineEnding) {
	const root = postcss.parse(css);

	addEmptyLineBefore(root.nodes[1], lineEnding);

	return root.toString();
}
