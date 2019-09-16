'use strict';

const path = require('path');
const standalone = require('../standalone');

const fixturesPath = path.join(__dirname, './fixtures');

describe('processor transforms input and output', () => {
	let results;

	beforeEach(() => {
		const code = 'one\ntwo\n```start\na {}\nb { color: pink }\n```end\nthree';

		return standalone({
			code,
			config: {
				extends: './config-block-no-empty',
				processors: './processor-fenced-blocks',
			},
			configBasedir: fixturesPath,
		}).then((data) => (results = data.results));
	});

	it('number of results', () => {
		expect(results).toHaveLength(1);
	});

	it('number of warnings', () => {
		expect(results[0].warnings).toHaveLength(1);
	});

	it('warning rule', () => {
		expect(results[0].warnings[0].rule).toBe('block-no-empty');
	});

	it('warning line', () => {
		expect(results[0].warnings[0].line).toBe(2);
	});

	it('warning column', () => {
		expect(results[0].warnings[0].column).toBe(3);
	});

	it('special message', () => {
		expect(results[0].specialMessage).toBe('was processed');
	});
});

describe('processor accepts options', () => {
	let results;

	beforeEach(() => {
		const code = 'one\ntwo\n```start\na {}\nb { color: pink }\n```end\nthree';

		return standalone({
			code,
			config: {
				extends: './config-block-no-empty',
				processors: [['./processor-fenced-blocks', { specialMessage: 'options worked' }]],
			},
			configBasedir: fixturesPath,
		}).then((data) => (results = data.results));
	});

	it('special message', () => {
		expect(results[0].specialMessage).toBe('options worked');
	});
});

describe('multiple processors', () => {
	let results;

	beforeEach(() => {
		const code =
			'one\ntwo\n```start\na {}\nb { color: pink }\n```end\nthree???startc {}???end' +
			'\n\n???start```start\na {}\nb { color: pink }\n```end???end';

		return standalone({
			code,
			config: {
				extends: './config-block-no-empty',
				processors: [
					'./processor-triple-question-marks',
					['./processor-fenced-blocks', { specialMessage: 'options worked' }],
				],
			},
			configBasedir: fixturesPath,
		}).then((data) => (results = data.results));
	});

	it('number of results', () => {
		expect(results).toHaveLength(1);
	});

	it('number of warnings', () => {
		expect(results[0].warnings).toHaveLength(1);
	});

	it('warning rule', () => {
		expect(results[0].warnings[0].rule).toBe('block-no-empty');
	});

	it('warning line', () => {
		expect(results[0].warnings[0].line).toBe(2);
	});

	it('warning column', () => {
		expect(results[0].warnings[0].column).toBe(3);
	});

	it('special message', () => {
		expect(results[0].specialMessage).toBe('options worked');
	});

	it('tripleQuestionMarkBlocksFound', () => {
		expect(results[0].tripleQuestionMarkBlocksFound).toBe(true);
	});
});

describe('loading processors (and extend) from process.cwd', () => {
	let actualCwd;
	let results;

	beforeAll(() => {
		actualCwd = process.cwd();
		process.chdir(path.join(__dirname, '..'));
	});

	afterAll(() => {
		process.chdir(actualCwd);
	});

	beforeEach(() => {
		const code =
			'one\ntwo\n```start\na {}\nb { color: pink }\n```end\nthree???startc {}???end' +
			'\n\n???start```start\na {}\nb { color: pink }\n```end???end';

		return standalone({
			code,
			config: {
				extends: './__tests__/fixtures/config-block-no-empty',
				processors: [
					'./__tests__/fixtures/processor-triple-question-marks',
					['./__tests__/fixtures/processor-fenced-blocks', { specialMessage: 'options worked' }],
				],
			},
		}).then((data) => (results = data.results));
	});

	it('number of results', () => {
		expect(results).toHaveLength(1);
	});

	it('number of warnings', () => {
		expect(results[0].warnings).toHaveLength(1);
	});

	it('special message', () => {
		expect(results[0].specialMessage).toBe('options worked');
	});

	it('tripleQuestionMarkBlocksFound', () => {
		expect(results[0].tripleQuestionMarkBlocksFound).toBe(true);
	});
});

describe('processor gets to modify result on CssSyntaxError', () => {
	let results;

	beforeEach(() => {
		const code = "one\ntwo\n```start\na {}\nb { color: 'pink; }\n```end\nthree";

		return standalone({
			code,
			config: {
				rules: { 'block-no-empty': true },
				processors: './processor-fenced-blocks',
			},
			configBasedir: fixturesPath,
		}).then((data) => (results = data.results));
	});

	it('CssSyntaxError occurred', () => {
		expect(results[0].warnings).toHaveLength(1);
		expect(results[0].warnings[0].rule).toBe('CssSyntaxError');
	});

	it('successfully modified result', () => {
		expect(results[0].specialMessage).toBe('was processed');
	});
});
