/**
 * @param {import('stylelint').PostcssResult} result
 * @param {string} name
 * @param {import('stylelint').FixerData} data
 */
export default (result, name, data) => {
	const list = result.stylelint.fixersData[name];

	if (!list) result.stylelint.fixersData[name] = [data];
	else list.push(data);
};
