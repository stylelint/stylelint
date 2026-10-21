import { test } from 'node:test';

import toUnixPath from '../toUnixPath.mjs';

const cases = [
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
];

for (const [path, expected] of cases) {
	test(`toUnixPath(${JSON.stringify(path)})`, (t) => {
		t.assert.strictEqual(toUnixPath(path), expected);
	});
}
