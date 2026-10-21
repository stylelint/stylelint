import { it } from 'node:test';

import findAnimationName from '../findAnimationName.mjs';

it('findAnimationName', (t) => {
	t.assert.deepStrictEqual(findAnimationName('inherit'), [
		{
			sourceEndIndex: 7,
			sourceIndex: 0,
			type: 'word',
			value: 'inherit',
		},
	]);
	t.assert.deepStrictEqual(findAnimationName('INHERIT'), [
		{
			sourceEndIndex: 7,
			sourceIndex: 0,
			type: 'word',
			value: 'INHERIT',
		},
	]);
	t.assert.deepStrictEqual(findAnimationName('3s @variable'), []);
	t.assert.deepStrictEqual(findAnimationName('3s #{$variable}'), []);
	t.assert.deepStrictEqual(findAnimationName('none'), []);
	t.assert.deepStrictEqual(findAnimationName('slidein'), [
		{
			sourceEndIndex: 7,
			sourceIndex: 0,
			type: 'word',
			value: 'slidein',
		},
	]);
	t.assert.deepStrictEqual(findAnimationName('3s slidein'), [
		{
			sourceEndIndex: 10,
			sourceIndex: 3,
			type: 'word',
			value: 'slidein',
		},
	]);
	t.assert.deepStrictEqual(findAnimationName('none slidein'), [
		{
			sourceEndIndex: 12,
			sourceIndex: 5,
			type: 'word',
			value: 'slidein',
		},
	]);
	t.assert.deepStrictEqual(findAnimationName('3s linear 1s slidein'), [
		{
			sourceEndIndex: 20,
			sourceIndex: 13,
			type: 'word',
			value: 'slidein',
		},
	]);
	t.assert.deepStrictEqual(findAnimationName('3S LINEAR 1S SLIDEIN'), [
		{
			sourceEndIndex: 20,
			sourceIndex: 13,
			type: 'word',
			value: 'SLIDEIN',
		},
	]);
	t.assert.deepStrictEqual(findAnimationName('3s ease-in 1s 2 reverse both paused slidein'), [
		{
			sourceEndIndex: 43,
			sourceIndex: 36,
			type: 'word',
			value: 'slidein',
		},
	]);
	t.assert.deepStrictEqual(findAnimationName('go-left-right 3s infinite alternate'), [
		{
			sourceEndIndex: 13,
			sourceIndex: 0,
			type: 'word',
			value: 'go-left-right',
		},
	]);
	t.assert.deepStrictEqual(
		findAnimationName('shrink 2s ease-out, pulsate 4s 2s infinite ease-in-out'),
		[
			{
				sourceEndIndex: 6,
				sourceIndex: 0,
				type: 'word',
				value: 'shrink',
			},
			{
				sourceEndIndex: 27,
				sourceIndex: 20,
				type: 'word',
				value: 'pulsate',
			},
		],
	);
	t.assert.deepStrictEqual(findAnimationName('drive 4s steps(4, end) infinite'), [
		{
			sourceEndIndex: 5,
			sourceIndex: 0,
			type: 'word',
			value: 'drive',
		},
	]);
	t.assert.deepStrictEqual(findAnimationName('foo 2s linear #{0.2 * $i}s both'), []);
});
