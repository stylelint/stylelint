'use strict';

const findAnimationName = require('../findAnimationName');

it('findAnimationName', () => {
	expect(findAnimationName('inherit')).toEqual([
		{
			sourceEndIndex: 7,
			sourceIndex: 0,
			type: 'word',
			value: 'inherit',
		},
	]);
	expect(findAnimationName('INHERIT')).toEqual([
		{
			sourceEndIndex: 7,
			sourceIndex: 0,
			type: 'word',
			value: 'INHERIT',
		},
	]);
	expect(findAnimationName('3s @varialbe')).toEqual([]);
	expect(findAnimationName('3s #{$variable}')).toEqual([]);
	expect(findAnimationName('none')).toEqual([]);
	expect(findAnimationName('slidein')).toEqual([
		{
			sourceEndIndex: 7,
			sourceIndex: 0,
			type: 'word',
			value: 'slidein',
		},
	]);
	expect(findAnimationName('3s slidein')).toEqual([
		{
			sourceEndIndex: 10,
			sourceIndex: 3,
			type: 'word',
			value: 'slidein',
		},
	]);
	expect(findAnimationName('none slidein')).toEqual([
		{
			sourceEndIndex: 12,
			sourceIndex: 5,
			type: 'word',
			value: 'slidein',
		},
	]);
	expect(findAnimationName('3s linear 1s slidein')).toEqual([
		{
			sourceEndIndex: 20,
			sourceIndex: 13,
			type: 'word',
			value: 'slidein',
		},
	]);
	expect(findAnimationName('3S LINEAR 1S SLIDEIN')).toEqual([
		{
			sourceEndIndex: 20,
			sourceIndex: 13,
			type: 'word',
			value: 'SLIDEIN',
		},
	]);
	expect(findAnimationName('3s ease-in 1s 2 reverse both paused slidein')).toEqual([
		{
			sourceEndIndex: 43,
			sourceIndex: 36,
			type: 'word',
			value: 'slidein',
		},
	]);
	expect(findAnimationName('go-left-right 3s infinite alternate')).toEqual([
		{
			sourceEndIndex: 13,
			sourceIndex: 0,
			type: 'word',
			value: 'go-left-right',
		},
	]);
	expect(findAnimationName('shrink 2s ease-out, pulsate 4s 2s infinite ease-in-out')).toEqual([
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
	]);
	expect(findAnimationName('drive 4s steps(4, end) infinite')).toEqual([
		{
			sourceEndIndex: 5,
			sourceIndex: 0,
			type: 'word',
			value: 'drive',
		},
	]);
});
