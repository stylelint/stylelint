'use strict';

const createStylelint = require('./createStylelint');
const path = require('path');
const postcss = require('postcss');
//'block-no-empty': bool || Array

module.exports = postcss.plugin('stylelint', (options = {}) => {
	const tailoredOptions = options.rules ? { config: options } : options;
	const stylelint = createStylelint(tailoredOptions);

	return (root, result) => {
		let filePath = options.from;

		if (!filePath) filePath = root.source && root.source.input.file;

		if (filePath && !path.isAbsolute(filePath)) {
			filePath = path.join(process.cwd(), filePath);
		}

		return stylelint._lintSource({
			filePath,
			existingPostcssResult: result,
		});
	};
});
