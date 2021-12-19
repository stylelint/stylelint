'use strict';

const { colord } = require('../colordUtils');

describe('colord gray', () => {
	const TESTS = [
		{
			input: 'gray(100)',
			output: '#ffffff',
		},
		{
			input: 'gray(0)',
			output: '#000000',
		},
		{
			input: 'gray(10)',
			output: '#1b1b1b',
		},
		{
			input: 'gray(100%)',
			output: '#ffffff',
		},
		{
			input: 'gray(0%)',
			output: '#000000',
		},
		{
			input: 'gray(10%)',
			output: '#1b1b1b',
		},
		{
			input: 'gray(100, 1)',
			output: '#ffffff',
		},
		{
			input: 'gray(0, 1)',
			output: '#000000',
		},
		{
			input: 'gray(10, 1)',
			output: '#1b1b1b',
		},
		{
			input: 'gray(100%, 1)',
			output: '#ffffff',
		},
		{
			input: 'gray(0%, 1)',
			output: '#000000',
		},
		{
			input: 'gray(10%, 1)',
			output: '#1b1b1b',
		},
		{
			input: 'gray(100, 100%)',
			output: '#ffffff',
		},
		{
			input: 'gray(0, 100%)',
			output: '#000000',
		},
		{
			input: 'gray(10, 100%)',
			output: '#1b1b1b',
		},
		{
			input: 'gray(100%, 100%)',
			output: '#ffffff',
		},
		{
			input: 'gray(0%, 100%)',
			output: '#000000',
		},
		{
			input: 'gray(10%, 100%)',
			output: '#1b1b1b',
		},
		{
			input: 'gray(100, .5)',
			output: '#ffffff80',
		},
		{
			input: 'gray(0, .5)',
			output: '#00000080',
		},
		{
			input: 'gray(10, 0.5)',
			output: '#1b1b1b80',
		},
		{
			input: 'gray(100%, .5)',
			output: '#ffffff80',
		},
		{
			input: 'gray(0%, .5)',
			output: '#00000080',
		},
		{
			input: 'gray(10%, .5)',
			output: '#1b1b1b80',
		},
		{
			input: 'gray(100, 50%)',
			output: '#ffffff80',
		},
		{
			input: 'gray(0, 50%)',
			output: '#00000080',
		},
		{
			input: 'gray(10, 50%)',
			output: '#1b1b1b80',
		},
		{
			input: 'gray(100%, 50%)',
			output: '#ffffff80',
		},
		{
			input: 'gray(0%, 50%)',
			output: '#00000080',
		},
		{
			input: 'gray(10%, 50%)',
			output: '#1b1b1b80',
		},
		{
			input: 'gray(0% / 50%)',
			valid: false,
		},
		{
			input: 'gray(100 / 50%)',
			valid: false,
		},
		{
			input: 'gray(100 , 50px)',
			valid: false,
		},
		{
			input: 'gray(100px , 1)',
			valid: false,
		},
		{
			input: 'gray()',
			valid: false,
		},
		{
			input: 'gray(    )',
			valid: false,
		},
		{
			input: 'gray( , )',
			valid: false,
		},
		{
			input: 'gray(100, 1, 1)',
			valid: false,
		},
	];

	for (const { input, output = '#000000', valid = true } of TESTS) {
		it(`input: ${input}`, () => {
			const result = colord(input);

			expect(result.isValid()).toBe(valid);

			expect(result.toHex()).toEqual(output);
		});
	}
});

describe('colord hwb with comma', () => {
	const TESTS = [
		{
			input: 'hwb(0, 0%, 0%)',
			output: '#ff0000',
		},
		{
			input: 'hwb(0, 0%, 0% , 0)',
			output: '#ff000000',
		},
		{
			input: 'hwb(0, 0%, 0% / 0%)',
			valid: false,
		},
		{
			input: 'hwb(0, 0%)',
			valid: false,
		},
		{
			input: 'hwb(0 0% 0% , , )',
			valid: false,
		},
		{
			input: 'hwb( , , )',
			valid: false,
		},
		{
			input: 'hwb()',
			valid: false,
		},
		{
			input: 'hwb(    )',
			valid: false,
		},
		{
			input: 'hwb(0px, 0%, 0%)',
			valid: false,
		},
		{
			input: 'hwb(0, 0%, 0% , 0, 0)',
			valid: false,
		},
	];

	for (const { input, output = '#000000', valid = true } of TESTS) {
		it(`input: ${input}`, () => {
			const result = colord(input);

			expect(result.isValid()).toBe(valid);

			expect(result.toHex()).toEqual(output);
		});
	}
});
