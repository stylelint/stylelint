declare function searchFn(
	param: {
		source: string;
		target: string | string[];
		once?: boolean;
		comments?: 'skip' | 'check' | 'only';
		strings?: 'skip' | 'check' | 'only';
		functionNames?: 'skip' | 'check' | 'only';
		functionArguments?: 'skip' | 'check' | 'only';
		parentheticals?: 'skip' | 'check' | 'only';
	},
	callback: (param: { startIndex: number; endIndex: number }) => void,
): void;

declare module 'style-search' {
	export = searchFn;
}
