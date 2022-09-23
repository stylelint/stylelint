const { promises: fs, existsSync } = require('fs');

/**
 * Remove a file.
 *
 * @param {string} filePath
 * @returns {Promise<void>}
 */
module.exports = async function removeFile(filePath) {
	// NOTE: `fs.rm(file, { force: true })` will be available when we drop the support of older Node versions.
	//       See https://nodejs.org/api/fs.html#fs_fs_rm_path_options_callback
	if (existsSync(filePath)) {
		await fs.unlink(filePath);
	}
};
