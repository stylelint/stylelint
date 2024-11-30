// TODO: This file aims to suppress the following error in Rollup. We will be able to remove this file
// when increasing the target ES version for TypeScript in the future.
//
// ```
// node_modules/rollup/dist/rollup.d.ts:921:2 - error TS1169: A computed property name in an interface must refer to an expression whose type is a literal type or a 'unique symbol' type.
//
// 921  [Symbol.asyncDispose](): Promise<void>;
//              ~~~~~~~~~~~~
// ```
//
// This copied just a part from:
// https://github.com/microsoft/TypeScript/blob/b3c67d32020a3015fe068fbcb1dcfb18aedcaad3/src/lib/esnext.disposable.d.ts#L5-L15
interface SymbolConstructor {
	/**
	 * A method that is used to release resources held by an object. Called by the semantics of the `using` statement.
	 */
	readonly dispose: unique symbol;

	/**
	 * A method that is used to asynchronously release resources held by an object. Called by the semantics of the `await using` statement.
	 */
	readonly asyncDispose: unique symbol;
}
