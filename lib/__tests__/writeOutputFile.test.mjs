import { fileURLToPath } from 'node:url';
import fs from 'node:fs/promises';
import path from 'node:path';

import writeOutputFile from '../writeOutputFile.js';

describe('writeOutputFile', () => {
	it('creates a file', async () => {
		const filePath = fileURLToPath(new URL('tmpfile', import.meta.url));

		await writeOutputFile('test content', filePath);

		expect((await fs.readFile(filePath)).toString()).toBe('test content');

		await fs.unlink(filePath);
	});

	it('creates a directory if it does not exist', async () => {
		const filePath = fileURLToPath(new URL('tmpdir/tmpfile', import.meta.url));

		await writeOutputFile('test content', filePath);

		expect((await fs.readFile(filePath)).toString()).toBe('test content');

		await fs.rm(path.dirname(filePath), { recursive: true });
	});
});
