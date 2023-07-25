'use strict';

/**
 * Unite two or more sets
 *
 * @param {Iterable<string>[]} args
 */
function uniteSets(...args) {
	return new Set([...args].reduce((result, set) => [...result, ...set], []));
}

module.exports = uniteSets;
