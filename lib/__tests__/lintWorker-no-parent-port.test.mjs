import { jest } from '@jest/globals';

jest.unstable_mockModule('node:worker_threads', () => ({
	parentPort: null,
	workerData: undefined,
}));

it('throws when imported outside a worker thread', async () => {
	await expect(import('../lintWorker.mjs')).rejects.toThrow(
		'This module must be run in a worker thread',
	);
});
