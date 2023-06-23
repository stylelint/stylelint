let latestId = 0;

/**
 * @returns {number}
 */
export default function uniqueId() {
	return ++latestId;
}
