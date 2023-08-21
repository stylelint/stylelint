import { createRequire } from 'node:module';
// @ts-expect-error -- TS1343: The 'import.meta' meta-property is only allowed when the '--module' option is 'es2020', 'es2022', 'esnext', 'system', 'node16', or 'nodenext'.
const require = createRequire(import.meta.url);

import importLazy from 'import-lazy';

/** @type {import('stylelint')['formatters']} */
const formatters = {
	compact: importLazy(() => require('./compactFormatter.cjs'))(),
	github: importLazy(() => require('./githubFormatter.cjs'))(),
	json: importLazy(() => require('./jsonFormatter.cjs'))(),
	string: importLazy(() => require('./stringFormatter.cjs'))(),
	tap: importLazy(() => require('./tapFormatter.cjs'))(),
	unix: importLazy(() => require('./unixFormatter.cjs'))(),
	verbose: importLazy(() => require('./verboseFormatter.cjs'))(),
};

export default formatters;
