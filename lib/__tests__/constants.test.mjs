import { it } from 'node:test';

import pkg from '../../package.json' with { type: 'json' };

import { STYLELINT_DESCRIPTION, STYLELINT_VERSION } from '../constants.mjs';

it('matches the "version" field in package.json', (t) => {
	t.assert.strictEqual(STYLELINT_VERSION, pkg.version);
});

it('matches the "description" field in package.json', (t) => {
	t.assert.strictEqual(STYLELINT_DESCRIPTION, pkg.description);
});
