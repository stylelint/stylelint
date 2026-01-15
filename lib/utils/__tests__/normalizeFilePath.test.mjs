import normalizeFilePath from '../normalizeFilePath.mjs';

describe('normalizeFilePath', () => {
	test('lowercases drive letter and normalizes separators on Windows', () => {
		expect(normalizeFilePath('C:\\Path\\To\\file.css', 'win32')).toBe('c:/Path/To/file.css');
	});

	test('preserves negation while lowercasing drive letter on Windows', () => {
		expect(normalizeFilePath('!D:\\Foo\\bar.css', 'win32')).toBe('!d:/Foo/bar.css');
	});

	test('does not affect Windows paths on non-Windows platforms', () => {
		expect(normalizeFilePath('C:\\Path\\To\\file.css', 'linux')).toBe('C:\\Path\\To\\file.css');
	});

	test('leaves non-Windows paths untouched', () => {
		expect(normalizeFilePath('/tmp/FOO.css', 'win32')).toBe('/tmp/FOO.css');
		expect(normalizeFilePath('/tmp/FOO.css', 'linux')).toBe('/tmp/FOO.css');
	});
});
