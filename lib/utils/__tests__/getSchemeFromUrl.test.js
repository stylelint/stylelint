'use strict';

const getSchemeFromUrl = require('../getSchemeFromUrl');

it('getSchemeFromUrl', () => {
	expect(getSchemeFromUrl('')).toBeNull();
	expect(getSchemeFromUrl(':')).toBeNull();
	expect(getSchemeFromUrl('://')).toBeNull();
	expect(getSchemeFromUrl('./file.jpg')).toBeNull();
	expect(getSchemeFromUrl('/path/to/file.jpg')).toBeNull();
	expect(getSchemeFromUrl('//www.example.com/file.jpg')).toBeNull();
	expect(getSchemeFromUrl('http://www.example.com/file.jpg')).toBe('http');
	expect(getSchemeFromUrl('HTTPS://www.example.com/file.jpg')).toBe('https');
	expect(
		getSchemeFromUrl('data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='),
	).toBe('data');
});
