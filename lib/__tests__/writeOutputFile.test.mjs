import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs/promises';
import path from 'node:path';

import writeOutputFile from '../writeOutputFile.mjs';

describe('writeOutputFile', () => {
	it('creates a file', async (t) => {
		const filePath = fileURLToPath(new URL('tmpfile', import.meta.url));

		await writeOutputFile('test content', filePath);

		t.assert.strictEqual((await fs.readFile(filePath)).toString(), 'test content');

		await fs.unlink(filePath);
	});

	it('creates a directory if it does not exist', async (t) => {
		const filePath = fileURLToPath(new URL('tmpdir/tmpfile', import.meta.url));

		await writeOutputFile('test content', filePath);

		t.assert.strictEqual((await fs.readFile(filePath)).toString(), 'test content');

		await fs.rm(path.dirname(filePath), { recursive: true });
	});
});
