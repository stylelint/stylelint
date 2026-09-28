import toUnixPath from '../toUnixPath.mjs';

test.each([
	['.//windows\\//unix/\\/mixed////', './windows/unix/mixed/'],
	['..///windows\\..\\\\unix/mixed', '../windows/../unix/mixed'],
	['', ''],
	['/', '/'],
	['\\\\server\\share', '//server/share'],
	['already/forward/slashes', 'already/forward/slashes'],
	['\\', '/'],
	['////multiple///slashes', '//multiple/slashes'],
	['mixed\\back//and///slashes', 'mixed/back/and/slashes'],
	['a\\b\\c', 'a/b/c'],
	['C:\\Users\\test', 'C:/Users/test'],
	['\\\\?\\C:\\docs\\a.css', '//?/C:/docs/a.css'],
	['\\\\.\\CdRomX', '//./CdRomX'],
])('toUnixPath(%j)', (path, expected) => {
	expect(toUnixPath(path)).toBe(expected);
});
