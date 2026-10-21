import assert from 'node:assert/strict';

import { isString } from '../utils/validateTypes.mjs';

/**
 * Passes when any chunk matches, as the CLI writes a report in several.
 *
 * @param {import('node:test').Mock<(...args: unknown[]) => unknown>} write
 * @param {string | RegExp} expected
 * @returns {void}
 */
export default function assertWritten(write, expected) {
	const chunks = write.mock.calls.map((call) => String(call.arguments[0]));

	assert.ok(
		chunks.some((chunk) => (isString(expected) ? chunk.includes(expected) : expected.test(chunk))),
		`No write matched ${expected} in:\n${chunks.join('\n')}`,
	);
}
