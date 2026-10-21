import { describe, it } from 'node:test';

import postcss from 'postcss';
import removeEmptyLinesBefore from '../removeEmptyLinesBefore.mjs';

describe('removeEmptyLineBefore', () => {
	it('removes single newline from the newline at the beginning', (t) => {
		t.assert.strictEqual(run('a {}\n\n  b{}', '\n'), 'a {}\n  b{}');
	});

	it('removes single newline from newline at the beginning with CRLF', (t) => {
		t.assert.strictEqual(run('a {}\r\n\r\n  b{}', '\r\n'), 'a {}\r\n  b{}');
	});

	it('removes single newline from newline at the end', (t) => {
		t.assert.strictEqual(run('a {}\t\n\nb{}', '\n'), 'a {}\t\nb{}');
	});

	it('removes single newline from newline at the end with CRLF', (t) => {
		t.assert.strictEqual(run('a {}\t\r\n\r\nb{}', '\r\n'), 'a {}\t\r\nb{}');
	});

	it('removes single newline from newline in the middle', (t) => {
		t.assert.strictEqual(run('a {}  \n\n\tb{}', '\n'), 'a {}  \n\tb{}');
	});

	it('removes single newline to newline in the middle with CRLF', (t) => {
		t.assert.strictEqual(run('a {}  \r\n\r\n\tb{}', '\r\n'), 'a {}  \r\n\tb{}');
	});

	it('removes two newlines if there are three newlines', (t) => {
		t.assert.strictEqual(run('a {}\n\n\n  b{}', '\n'), 'a {}\n  b{}');
	});

	it('removes two newlines if there are three newlines with CRLF', (t) => {
		t.assert.strictEqual(run('a {}\r\n\r\n\r\n  b{}', '\r\n'), 'a {}\r\n  b{}');
	});

	it('removes three newlines if there are four newlines', (t) => {
		t.assert.strictEqual(run('a {}\n\n\n\n  b{}', '\n'), 'a {}\n  b{}');
	});

	it('removes three newlines if there are four newlines with CRLF', (t) => {
		t.assert.strictEqual(run('a {}\r\n\r\n\r\n\r\n  b{}', '\r\n'), 'a {}\r\n  b{}');
	});
});

function run(css, lineEnding) {
	const root = postcss.parse(css);

	removeEmptyLinesBefore(root.nodes[1], lineEnding);

	return root.toString();
}
