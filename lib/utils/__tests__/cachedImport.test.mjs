import { beforeEach, describe, it } from 'node:test';
import path from 'node:path';

import cachedImport, { clearModuleCache } from '../cachedImport.mjs';

const dirname = import.meta.dirname;
const fixtureModuleA = path.join(dirname, 'fixtures/module-a.mjs');
const fixtureModuleB = path.join(dirname, 'fixtures/module-b.mjs');

beforeEach(() => {
	clearModuleCache();
});

describe('cachedImport', () => {
	it('returns the imported module', async (t) => {
		const result = await cachedImport(fixtureModuleA);

		t.assert.deepStrictEqual(result.default, { name: 'fixture-module-a' });
	});

	it('returns cached promise on subsequent calls', async (t) => {
		const first = cachedImport(fixtureModuleA);
		const second = cachedImport(fixtureModuleA);

		// Should be the exact same promise object.
		t.assert.strictEqual(first, second);

		const [result1, result2] = await Promise.all([first, second]);

		t.assert.strictEqual(result1, result2);
	});

	it('caches different modules separately', async (t) => {
		const resultA = await cachedImport(fixtureModuleA);
		const resultB = await cachedImport(fixtureModuleB);

		t.assert.deepStrictEqual(resultA.default, { name: 'fixture-module-a' });
		t.assert.deepStrictEqual(resultB.default, { name: 'fixture-module-b' });
	});

	it('returns same promise for concurrent calls', async (t) => {
		const promise1 = cachedImport(fixtureModuleA);
		const promise2 = cachedImport(fixtureModuleA);

		// Should be the exact same promise object.
		t.assert.strictEqual(promise1, promise2);

		const [result1, result2] = await Promise.all([promise1, promise2]);

		t.assert.strictEqual(result1, result2);
	});
});
