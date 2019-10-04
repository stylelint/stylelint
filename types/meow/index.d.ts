interface Flag {
	alias?: string,
	type?: string | boolean,
	default?: any
}

interface Options {
	argv?: string[],
	autoHelp: boolean,
	autoVersion: boolean,
	help: string,
	pkg: object,
	flags: {[k: string]: Flag }
}

declare var meowFn: {
	(options: Options): {
		input: any,
		help: any,
		pkg: any,
		showHelp: Function,
		showVersion: Function,
		flags: any // TODO TYPES
	};
};

declare module 'meow' {
	export = meowFn;
}
