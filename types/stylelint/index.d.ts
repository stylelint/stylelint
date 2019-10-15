declare module 'stylelint' {
	import { Result, WarningOptions } from 'postcss';

	export type DisabledRange = {
		start: number,
		strictStart: boolean,
		end?: number,
		strictEnd?: boolean
	};

	export type DisabledRangeObject = {
		[ruleName: string]: Array<DisabledRange>
	};

	export type StylelintPostcssResult = {
		ruleSeverities: {[k: string]: any},
		customMessages: {[k: string]: any},
		quiet?: boolean,
		disabledRanges: DisabledRangeObject,
		ignored?: boolean,
		ignoreDisables?: boolean,
		stylelintError?: boolean
	};

	export type PostcssResult = Result & {
		stylelint: StylelintPostcssResult,
		warn(message: string, options?: WarningOptions & {stylelintType?: string}): void;
	};
}
