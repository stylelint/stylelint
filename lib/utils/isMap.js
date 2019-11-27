/* @flow */
'use strict';

const mapStructure = {
	'0': ['string', 'word'],
	'1': [':'],
	'2': ['function', 'string', 'word'],
	'3': [','],
};

module.exports = function(valueNode /*: Object*/) /*: boolean*/ {
	if (!valueNode) {
		return false;
	}

	if (valueNode.type !== 'function' || !valueNode.nodes || valueNode.value) {
		return false;
	}

	// It's necessary to remove comments and spaces if they are present
	const cleanNodes = valueNode.nodes.filter(
		(node) => node.type !== 'comment' && node.type !== 'space',
	);
	const mapStructureLength = Object.keys(mapStructure).length;
	let mapIndex = 0;

	for (let i = 0; i < cleanNodes.length; i++) {
		const node = cleanNodes[i];
		// Depending on the index we have to check different node properties:
		// For odd nodes value have to be checked
		// For even nodes type have to be checked
		const toCheck = i % 2 ? node.value : node.type;

		if (mapIndex === mapStructureLength) {
			mapIndex = 0;
		}

		if (!mapStructure[mapIndex].includes(toCheck)) {
			return false;
		}

		mapIndex++;
	}

	return true;
};
