declare namespace writeFile {
	interface Options {
		chown?: {
			uid: number;
			gid: number;
		};
		encoding?: string;
		fsync?: boolean;
		mode?: number;
	}
}

declare function writeFileAsync(
	filename: string,
	data: string | Buffer,
	options?: writeFile.Options,
): Promise<Error | undefined>;

declare module 'write-file-atomic' {
	export = writeFileAsync;
}
