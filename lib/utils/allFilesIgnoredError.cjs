// NOTICE: This file is generated by Rollup. To modify it,
// please instead edit the ESM counterpart and rebuild with Rollup (npm run build).
'use strict';

class AllFilesIgnoredError extends Error {
	constructor() {
		super();

		this.message =
			'All input files were ignored because of the ignore pattern. Either change your input, ignore pattern or use "--allow-empty-input" to allow no inputs';
	}
}

module.exports = AllFilesIgnoredError;
