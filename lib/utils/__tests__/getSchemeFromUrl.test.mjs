import assert from 'node:assert/strict';
import { it } from 'node:test';

import getSchemeFromUrl from '../getSchemeFromUrl.mjs';

it('getSchemeFromUrl', () => {
	assert.equal(getSchemeFromUrl(''), null);
	assert.equal(getSchemeFromUrl(':'), null);
	assert.equal(getSchemeFromUrl('://'), null);
	assert.equal(getSchemeFromUrl('./file.jpg'), null);
	assert.equal(getSchemeFromUrl('/path/to/file.jpg'), null);
	assert.equal(getSchemeFromUrl('//www.example.com/file.jpg'), null);
	assert.equal(getSchemeFromUrl('http://www.example.com/file.jpg'), 'http');
	assert.equal(getSchemeFromUrl('HTTPS://www.example.com/file.jpg'), 'https');
	assert.equal(
		getSchemeFromUrl('data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='),
		'data',
	);
});
