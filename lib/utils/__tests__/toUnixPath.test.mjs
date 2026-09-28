import toUnixPath from '../toUnixPath.mjs';

test.each([
	['\\\\server\\share\\a.css', '//server/share/a.css'],
	['\\\\?\\C:\\docs\\a.css', '//?/C:/docs/a.css'],
	['\\\\.\\CdRomX', '//./CdRomX'],
	['C:\\docs\\a.css', 'C:/docs/a.css'],
	['C:\\docs\\\\a.css', 'C:/docs/a.css'],
	['foo//bar', 'foo/bar'],
	['//foo/bar', '//foo/bar'],
	['foo/bar/', 'foo/bar/'],
])('toUnixPath(%j)', (path, expected) => {
	expect(toUnixPath(path)).toBe(expected);
});
