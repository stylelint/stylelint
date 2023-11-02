import { createRequire } from 'node:module';

// @ts-expect-error -- TS1343: The 'import.meta' meta-property is only allowed when the '--module' option is 'es2020', 'es2022', 'esnext', 'system', 'node16', or 'nodenext'
const require = createRequire(import.meta.url);

// NOTE: mathml-tag-names v3 is a pure ESM package,
// so we cannot update it while supporting both ESM and CJS.
//
// In addition, mathml-tag-names v2 provides only a JSON file,
// so ESM cannot import it (raises the "ERR_IMPORT_ASSERTION_TYPE_MISSING" error).
const mathMLTags = require('mathml-tag-names');

export default mathMLTags;
