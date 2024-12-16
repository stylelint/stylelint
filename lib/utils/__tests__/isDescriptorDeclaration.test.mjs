import isDescriptorDeclaration from '../isDescriptorDeclaration.mjs';
import postcss from 'postcss';

describe('isDescriptorDeclaration', () => {
	it('detects a descriptor declaration', () => {
		const nodes = nodesIn('@font-face { font-weight: 400; }');

		expect(nodes).toHaveLength(2);
		expect(isDescriptorDeclaration(nodes[1])).toBeTruthy();
	});

	it('detects a descriptor declaration within nested at-rules', () => {
		const nodes = nodesIn(
			'@position-try --custom-bottom-right { @supports (position-area: bottom right) { position-area: bottom right; } }',
		);

		expect(nodes).toHaveLength(3);
		expect(isDescriptorDeclaration(nodes[2])).toBeTruthy();
	});

	it('detects a descriptor declaration within case different at-rule', () => {
		const nodes = nodesIn('@Counter-STYLE { system:	cyclic; }');

		expect(nodes).toHaveLength(2);
		expect(isDescriptorDeclaration(nodes[1])).toBeTruthy();
	});

	it('ignores a property declaration', () => {
		const nodes = nodesIn('a { color: red; }');

		expect(nodes).toHaveLength(2);
		expect(isDescriptorDeclaration(nodes[1])).toBeFalsy();
	});

	it('ignores a property declaration within a nesting-supported at-rule', () => {
		const nodes = nodesIn('@media (min-width: 10px) { a { color: red; } }');

		expect(nodes).toHaveLength(3);
		expect(isDescriptorDeclaration(nodes[2])).toBeFalsy();
	});

	it('ignores a property declaration within a nested nesting-supported at-rule', () => {
		const nodes = nodesIn('a { @media (min-width: 10px) { color: red; } }');

		expect(nodes).toHaveLength(3);
		expect(isDescriptorDeclaration(nodes[2])).toBeFalsy();
	});
});

function nodesIn(css) {
	const nodes = [];

	postcss.parse(css).walk((node) => nodes.push(node));

	return nodes;
}
