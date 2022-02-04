declare module 'postcss-media-query-parser' {
	type WalkerCallback = (node: Child, index: number, nodes: Child[]) => boolean | void;

	export class Node {
		type: string;
		value: string;
		after: string;
		before: string;
		sourceIndex: number;
		nodes?: Child[];

		walk(filter: string | RegExp, callback: WalkerCallback): void;
		walk(callback: WalkerCallback): void;
	}

	export type Child = Node & {
		type:
			| 'media-query'
			| 'media-feature-expression'
			| 'media-feature'
			| 'media-type'
			| 'colon'
			| 'value'
			| 'keyword';
		parent: Node;
	};

	export type Root = Node & {
		type: 'media-query-list';
	};

	function mediaQueryParser(mediaQuery: string): Root;

	export default mediaQueryParser;
}
