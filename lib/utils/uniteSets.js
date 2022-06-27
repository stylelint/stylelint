/**
 * Unite two or more sets
 *
 * @param {(string[] | Set<string>)[]} args
 */
module.exports = function uniteSets(...args) {
	return new Set([...args].reduce((result, set) => [...result, ...set], []));
};
