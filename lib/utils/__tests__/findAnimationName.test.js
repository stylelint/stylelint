'use strict';

const findAnimationName = require('../findAnimationName');

it('findAnimationName', () => {
	expect(findAnimationName('inherit')).toEqual([
		{
			sourceIndex: 0,
			type: 'word',
			value: 'inherit',
		},
	]);
	expect(findAnimationName('INHERIT')).toEqual([
		{
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
			sourceIndex: 0,
			type: 'word',
			value: 'slidein',
		},
	]);
	expect(findAnimationName('3s slidein')).toEqual([
		{
			sourceIndex: 3,
			type: 'word',
			value: 'slidein',
		},
	]);
	expect(findAnimationName('none slidein')).toEqual([
		{
			sourceIndex: 5,
			type: 'word',
			value: 'slidein',
		},
	]);
	expect(findAnimationName('3s linear 1s slidein')).toEqual([
		{
			sourceIndex: 13,
			type: 'word',
			value: 'slidein',
		},
	]);
	expect(findAnimationName('3S LINEAR 1S SLIDEIN')).toEqual([
		{
			sourceIndex: 13,
			type: 'word',
			value: 'SLIDEIN',
		},
	]);
	expect(findAnimationName('3s ease-in 1s 2 reverse both paused slidein')).toEqual([
		{
			sourceIndex: 36,
			type: 'word',
			value: 'slidein',
		},
	]);
	expect(findAnimationName('go-left-right 3s infinite alternate')).toEqual([
		{
			sourceIndex: 0,
			type: 'word',
			value: 'go-left-right',
		},
	]);
	expect(findAnimationName('shrink 2s ease-out, pulsate 4s 2s infinite ease-in-out')).toEqual([
		{
			sourceIndex: 0,
			type: 'word',
			value: 'shrink',
		},
		{
			sourceIndex: 20,
			type: 'word',
			value: 'pulsate',
		},
	]);
	expect(findAnimationName('drive 4s steps(4, end) infinite')).toEqual([
		{
			sourceIndex: 0,
			type: 'word',
			value: 'drive',
		},
	]);
});
