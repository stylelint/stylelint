import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import normalizeFilePath from '../normalizeFilePath.mjs';

describe('normalizeFilePath', () => {
	test('lowercases drive letter and normalizes separators on Windows', () => {
		assert.equal(normalizeFilePath('C:\\Path\\To\\file.css', 'win32'), 'c:/Path/To/file.css');
	});

	test('preserves negation while lowercasing drive letter on Windows', () => {
		assert.equal(normalizeFilePath('!D:\\Foo\\bar.css', 'win32'), '!d:/Foo/bar.css');
	});

	test('preserves negation and the leading double slash of UNC paths on Windows', () => {
		assert.equal(
			normalizeFilePath('!\\\\server\\share\\file.css', 'win32'),
			'!//server/share/file.css',
		);
	});

	test('does not affect Windows paths on non-Windows platforms', () => {
		assert.equal(normalizeFilePath('C:\\Path\\To\\file.css', 'linux'), 'C:\\Path\\To\\file.css');
	});

	test('leaves non-Windows paths untouched', () => {
		assert.equal(normalizeFilePath('/tmp/FOO.css', 'win32'), '/tmp/FOO.css');
		assert.equal(normalizeFilePath('/tmp/FOO.css', 'linux'), '/tmp/FOO.css');
	});
});
