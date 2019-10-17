declare module 'postcss/lib/lazy-result' {
	import {
		LazyResult,
		Result,
		Processor,
		ResultMap,
		ResultMessage,
		ResultOptions,
		Root,
		Warning
	} from 'postcss';

	class LazyResultImpl extends Promise<Result> implements LazyResult {
		constructor(p: Processor, code: string, options: {from?: string, syntax: any});

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

declare module 'postcss-syntax' {
	var result: any; // TODO TYPES

	export = result;
}
