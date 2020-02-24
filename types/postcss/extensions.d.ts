import * as postcss from 'postcss';
declare module 'postcss' {
	interface NodeSource {
		lang?: string;
	}

	interface Input {
		css?: string;
	}
}
