import { pathToFileURL } from 'node:url';

import { describe, expect, test } from '@jest/globals';

import toPath from '../toPath.mjs';

describe('toPath', () => {
	test('returns string as-is', () => {
		expect(toPath('/foo/bar')).toBe('/foo/bar');
	});

	test('converts URL to string path', () => {
		const url = pathToFileURL('/foo/bar');

		expect(toPath(url)).toBe('/foo/bar');
	});

	test('returns undefined for undefined input', () => {
		expect(toPath(undefined)).toBeUndefined();
	});
});
