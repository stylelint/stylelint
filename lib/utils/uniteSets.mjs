/**
 * Unite two or more sets
 *
 * @param {Iterable<string>[]} args
 */
export default function uniteSets(...args) {
	return new Set([...args].reduce((result, set) => [...result, ...set], []));
}
