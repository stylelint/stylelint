declare module 'postcss/lib/comment' {
	import { Comment, NodeRaws } from 'postcss';

	interface NodeRawsExt extends NodeRaws {
		// Used by the SCSS parser to indicate `//` comments.
		inline?: boolean;
	}

	interface CommentExt extends Comment {
		// Used by the Less parser to indicate `//` comments.
		inline?: boolean;
		raws: NodeRawsExt;
	}

	export = CommentExt;
}

declare module 'postcss/lib/lazy-result' {
	import {
		LazyResult,
		Result,
		Processor,
		ResultMap,
		ResultMessage,
		ResultOptions,
		Root,
		Warning,
	} from 'postcss';

	class LazyResultImpl extends Promise<Result> implements LazyResult {
		constructor(p: Processor, code: string, options: { from?: string; syntax: any });

		content: string;
		css: string;
		map: ResultMap;
		messages: ResultMessage[];
		opts: ResultOptions;
		processor: Processor;
		root: Root;

		warnings(): Warning[];
	}

	export = LazyResultImpl;
}

declare module 'postcss/lib/result' {
	import { Result } from 'postcss';

	export = Result;
}
