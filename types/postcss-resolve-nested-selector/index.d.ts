declare module 'postcss-resolve-nested-selector' {
	import { Node } from 'postcss';

	function resolvedNestedSelector(selector: string, node: Node): string[];

	export = resolvedNestedSelector;
}
