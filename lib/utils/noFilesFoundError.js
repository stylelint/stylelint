'use strict';

const os = require('os');

class NoFilesFoundError extends Error {
	/**
	 * @param {string|string[]} fileList
	 */
	constructor(fileList) {
		super();

		if (typeof fileList === 'string') {
			fileList = [fileList];
		}

		const filteredFileList = fileList.filter((i) => !i.startsWith('!'));
		const pattern = filteredFileList.join(', ');

		this.message = `No files matching the pattern "${pattern}" were found.`;

		if (
			os.platform() === 'win32' &&
			filteredFileList.filter((file) => file.match(/^'.*'$/)).length > 0
		) {
			const packageScript = process.env.npm_lifecycle_event || '';

			if (packageScript) {
				this.message += `

Please use escaped double quotes for a file pattern in your package.json, e.g.:

	stylelint \\"file.scss\\"
`;
			} else {
				this.message += `

Please use double quotes for a file pattern:

	stylelint ${filteredFileList.map((file) => file.replace(/^'(.*)'$/, '"$1"')).join(' ')}
`;
			}
		}
	}
}

module.exports = NoFilesFoundError;
