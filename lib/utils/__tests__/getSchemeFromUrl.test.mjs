import { it } from 'node:test';

import getSchemeFromUrl from '../getSchemeFromUrl.mjs';

it('getSchemeFromUrl', (t) => {
	t.assert.strictEqual(getSchemeFromUrl(''), null);
	t.assert.strictEqual(getSchemeFromUrl(':'), null);
	t.assert.strictEqual(getSchemeFromUrl('://'), null);
	t.assert.strictEqual(getSchemeFromUrl('./file.jpg'), null);
	t.assert.strictEqual(getSchemeFromUrl('/path/to/file.jpg'), null);
	t.assert.strictEqual(getSchemeFromUrl('//www.example.com/file.jpg'), null);
	t.assert.strictEqual(getSchemeFromUrl('http://www.example.com/file.jpg'), 'http');
	t.assert.strictEqual(getSchemeFromUrl('HTTPS://www.example.com/file.jpg'), 'https');
	t.assert.strictEqual(
		getSchemeFromUrl('data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='),
		'data',
	);
});
