declare var join: {
	(...globs: Array<string>): any; //TODO TYPES
};

declare module 'globjoin' {
	export = join;
}
