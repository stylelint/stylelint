/**
 * @param {import('postcss').Declaration} decl
 * @returns {string}
 */
export default function getDeclarationValue(decl) {
	const raw = decl.raws.value;

	// PostCSS ignores the raw once a new value is assigned
	return raw && raw.value === decl.value ? raw.raw : decl.value;
}
