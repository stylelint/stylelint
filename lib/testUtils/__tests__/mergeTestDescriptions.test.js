'use strict';

const mergeTestDescriptions = require('../mergeTestDescriptions');

describe('mergeTestDescriptions', () => {
	it('merges empty objects', () => {
		expect(mergeTestDescriptions({}, {})).toEqual({});
	});
	it('merges objects', () => {
		expect(
			mergeTestDescriptions(
				{
					foo: {
						foo: 'bar',
						same: 'foo',
					},
				},
				{
					foo: {
						bar: 'foo',
						same: 'bar',
					},
				},
			),
		).toEqual({
			foo: {
				foo: 'bar',
				bar: 'foo',
				same: 'bar',
			},
		});
	});
	it('merges object with arrays', () => {
		expect(
			mergeTestDescriptions(
				{
					accept: [
						{
							code: 'foo',
							description: 'bar',
						},
					],

					reject: [
						{
							code: 'foo',
							message: 'bar',
						},
					],
				},
				{
					accept: [
						{
							code: 'bar',
							description: 'foo',
						},
					],

					reject: [
						{
							code: 'bar',
							message: 'foo',
						},
					],
				},
			),
		).toEqual({
			accept: [
				{
					code: 'foo',
					description: 'bar',
				},
				{
					code: 'bar',
					description: 'foo',
				},
			],

			reject: [
				{
					code: 'foo',
					message: 'bar',
				},
				{
					code: 'bar',
					message: 'foo',
				},
			],
		});
	});
});
