'use strict';

class AllFilesIgnoredError extends Error {
	/**
	 * @param {string|string[]} fileList
	 */
	constructor(fileList) {
		super();

		if (typeof fileList === 'string') {
			fileList = [fileList];
		}

		const pattern = fileList.filter((i) => !i.startsWith('!')).join(', ');

		this.message = `File "${pattern}" ignored because of a matching ignore pattern. Move ignore config to .stylelintrc or use "--allow-empty-input" to override.`;
	}
}

module.exports = AllFilesIgnoredError;
