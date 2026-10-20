import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import postcss from 'postcss';
import removeEmptyLinesBefore from '../removeEmptyLinesBefore.mjs';

describe('removeEmptyLineBefore', () => {
	it('removes single newline from the newline at the beginning', () => {
		assert.equal(run('a {}\n\n  b{}', '\n'), 'a {}\n  b{}');
	});

	it('removes single newline from newline at the beginning with CRLF', () => {
		assert.equal(run('a {}\r\n\r\n  b{}', '\r\n'), 'a {}\r\n  b{}');
	});

	it('removes single newline from newline at the end', () => {
		assert.equal(run('a {}\t\n\nb{}', '\n'), 'a {}\t\nb{}');
	});

	it('removes single newline from newline at the end with CRLF', () => {
		assert.equal(run('a {}\t\r\n\r\nb{}', '\r\n'), 'a {}\t\r\nb{}');
	});

	it('removes single newline from newline in the middle', () => {
		assert.equal(run('a {}  \n\n\tb{}', '\n'), 'a {}  \n\tb{}');
	});

	it('removes single newline to newline in the middle with CRLF', () => {
		assert.equal(run('a {}  \r\n\r\n\tb{}', '\r\n'), 'a {}  \r\n\tb{}');
	});

	it('removes two newlines if there are three newlines', () => {
		assert.equal(run('a {}\n\n\n  b{}', '\n'), 'a {}\n  b{}');
	});

	it('removes two newlines if there are three newlines with CRLF', () => {
		assert.equal(run('a {}\r\n\r\n\r\n  b{}', '\r\n'), 'a {}\r\n  b{}');
	});

	it('removes three newlines if there are four newlines', () => {
		assert.equal(run('a {}\n\n\n\n  b{}', '\n'), 'a {}\n  b{}');
	});

	it('removes three newlines if there are four newlines with CRLF', () => {
		assert.equal(run('a {}\r\n\r\n\r\n\r\n  b{}', '\r\n'), 'a {}\r\n  b{}');
	});
});

function run(css, lineEnding) {
	const root = postcss.parse(css);

	removeEmptyLinesBefore(root.nodes[1], lineEnding);

	return root.toString();
}
