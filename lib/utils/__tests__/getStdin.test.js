'use strict';

const { Readable } = require('stream');

const getStdin = require('../getStdin');

test('get stdin as string', async () => {
	const stdin = Readable.from(Buffer.from('abc'));

	expect(await getStdin(stdin)).toBe('abc');
});
