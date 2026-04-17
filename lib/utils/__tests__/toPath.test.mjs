import { fileURLToPath } from 'node:url';

import { describe, expect, test } from '@jest/globals';

import toPath from '../toPath.mjs';

describe('toPath', () => {
	test('returns string as-is', () => {
		expect(toPath('/foo/bar')).toBe('/foo/bar');
	});

	test('converts URL to string path', () => {
		const url = new URL(import.meta.url);

		expect(toPath(url)).toBe(fileURLToPath(url));
	});

	test('returns undefined for undefined input', () => {
		expect(toPath(undefined)).toBeUndefined();
	});
});
