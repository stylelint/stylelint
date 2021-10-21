declare module 'postcss-media-query-parser' {
	export type Walker = (filter: RegExp, callback: (node: Child) => boolean | void) => void;

	export type Node = {
		type: string;
		value: string;
		after: string;
		before: string;
		sourceIndex: number;
		nodes?: Child[];
		walk: Walker;
	};

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
