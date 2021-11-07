'use strict';

const path = require('path');
const fs = require('fs').promises;
const writeOutputFile = require('../writeOutputFile');

describe('writeOutputFile', () => {
	it('creates a file', async () => {
		const filePath = path.resolve(__dirname, 'tmpfile');

		await writeOutputFile('test content', filePath);

		expect((await fs.readFile(filePath)).toString()).toBe('test content');

		await fs.unlink(filePath);
	});

	it('creates a directory if it does not exist', async () => {
		const filePath = path.resolve(__dirname, 'tmpdir/tmpfile');

		await writeOutputFile('test content', filePath);

		expect((await fs.readFile(filePath)).toString()).toBe('test content');

		await fs.rmdir(path.dirname(filePath), { recursive: true });
	});
});
