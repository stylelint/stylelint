import { createRequire } from 'node:module';
import { jest } from '@jest/globals'; // eslint-disable-line node/no-extraneous-import

const require = createRequire(import.meta.url);

jest.mock('fs');
jest.mock('path');

const fs = require('fs');
const path = require('path');
const resolveCustomFormatter = require('../resolveCustomFormatter.js');

describe('resolveCustomFormatter', () => {
	it('should return absolute path when provided path is a file path', () => {
		const aRelativePath = 'a/relative/path';
		const expected = `/cwd/${aRelativePath}`;

		path.resolve.mockReturnValue(expected);
		path.isAbsolute.mockReturnValue(false);
		fs.existsSync.mockReturnValue(true);

		const result = resolveCustomFormatter(aRelativePath);

		expect(result).toEqual(expected);
	});

	it('should return provided path when path is neither absolute nor relative', () => {
		const aModulePath = '@stylelint/prettier-config/index.js';

		fs.existsSync.mockReturnValue(false);

		const result = resolveCustomFormatter(aModulePath);

		const realPathModule = jest.requireActual('path');
		const expectedPath = realPathModule.join('node_modules', aModulePath);

		expect(result.endsWith(expectedPath)).toBe(true);
	});
});
