import { describe, it } from 'node:test';

import mergeTestDescriptions from '../mergeTestDescriptions.mjs';

describe('mergeTestDescriptions', () => {
	it('keeps the schema properties', (t) => {
		t.assert.deepStrictEqual(
			mergeTestDescriptions(
				{
					accept: [
						{
							code: 'foo',
							description: 'bar',
						},
					],
				},
				{
					ruleName: 'foo',
					config: ['always'],

					reject: [
						{
							code: 'bar',
							message: 'foo',
						},
					],
				},
			),
			{
				ruleName: 'foo',
				config: ['always'],

				accept: [
					{
						code: 'foo',
						description: 'bar',
					},
				],

				reject: [
					{
						code: 'bar',
						message: 'foo',
					},
				],
			},
		);
	});

	it('concatenates accept and reject cases', (t) => {
		t.assert.deepStrictEqual(
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
			{
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
			},
		);
	});
});
