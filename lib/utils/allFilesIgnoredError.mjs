export default class AllFilesIgnoredError extends Error {
	constructor() {
		super();

		this.message =
			'All input files were ignored because of the ignore pattern. Either change your input, ignore pattern or use "--allow-empty-input" to allow no inputs';
	}
}
