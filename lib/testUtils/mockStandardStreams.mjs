import { mock } from 'node:test';
import process from 'node:process';

/**
 * The test runner reports through the real `process.stdout` of each test process, so mocking its
 * `write` would count the runner's own frames; a swapped stream keeps those apart.
 *
 * @returns {void}
 */
export default function mockStandardStreams() {
	const stdout = Object.create(process.stdout, { write: { value: mock.fn(() => true) } });

	mock.getter(process, 'stdout', () => stdout);
	mock.method(process.stderr, 'write', () => true);
}
