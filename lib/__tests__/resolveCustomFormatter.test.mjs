import { cwd } from 'node:process';
import { join } from 'node:path';

import resolveCustomFormatter from '../resolveCustomFormatter.mjs';

describe('resolveCustomFormatter', () => {
	it('should return absolute path when provided path is a file path', () => {
		const aRelativePath = 'lib/__tests__/fixtures/custom-formatter.mjs';
		const result = resolveCustomFormatter(aRelativePath);
		const expected = join(cwd(), aRelativePath);

		expect(result).toEqual(expected);
	});

	it('should return provided path when path is neither absolute nor relative', () => {
		const aModulePath = 'benchmark/benchmark.js'; // should be a stable package as possible
		const result = resolveCustomFormatter(aModulePath);
		const expected = join('node_modules', aModulePath);

		expect(result.endsWith(expected)).toBe(true);
	});
});
