declare module 'postcss-syntax' {
	import { Syntax } from 'postcss';

	function syntax(config: { [k: string]: Syntax }): Syntax;

	export = syntax;
}
