'use strict';

const findListStyleType = require('../findListStyleType');

it('findListStyleType', () => {
	expect(findListStyleType('inherit')).toEqual([
		{
			sourceEndIndex: 7,
			sourceIndex: 0,
			type: 'word',
			value: 'inherit',
		},
	]);
	expect(findListStyleType('INHERIT')).toEqual([
		{
			sourceEndIndex: 7,
			sourceIndex: 0,
			type: 'word',
			value: 'INHERIT',
		},
	]);
	expect(findListStyleType('none')).toEqual([
		{
			sourceEndIndex: 4,
			sourceIndex: 0,
			type: 'word',
			value: 'none',
		},
	]);
	expect(findListStyleType('circle')).toEqual([
		{
			sourceEndIndex: 6,
			sourceIndex: 0,
			type: 'word',
			value: 'circle',
		},
	]);
	expect(findListStyleType('inside')).toEqual([]);
	expect(findListStyleType("url('kayo.jpg')")).toEqual([]);
	expect(findListStyleType("url('marker.gif') inside")).toEqual([]);
	expect(findListStyleType('square outside')).toEqual([
		{
			sourceEndIndex: 6,
			sourceIndex: 0,
			type: 'word',
			value: 'square',
		},
	]);
	expect(findListStyleType('inside square')).toEqual([
		{
			sourceEndIndex: 13,
			sourceIndex: 7,
			type: 'word',
			value: 'square',
		},
	]);
	expect(findListStyleType("square inside url('sqpurple.gif')")).toEqual([
		{
			sourceEndIndex: 6,
			sourceIndex: 0,
			type: 'word',
			value: 'square',
		},
	]);
	expect(findListStyleType("SQUARE INSIDE URL('sqpurple.gif')")).toEqual([
		{
			sourceEndIndex: 6,
			sourceIndex: 0,
			type: 'word',
			value: 'SQUARE',
		},
	]);
	expect(findListStyleType("url('sqpurple.gif') square inside")).toEqual([
		{
			sourceEndIndex: 26,
			sourceIndex: 20,
			type: 'word',
			value: 'square',
		},
	]);
	expect(findListStyleType("square url('sqpurple.gif') inside")).toEqual([
		{
			sourceEndIndex: 6,
			sourceIndex: 0,
			type: 'word',
			value: 'square',
		},
	]);
	expect(findListStyleType('custom-counter-style')).toEqual([
		{
			sourceEndIndex: 20,
			sourceIndex: 0,
			type: 'word',
			value: 'custom-counter-style',
		},
	]);
	expect(findListStyleType('customCounterStyle')).toEqual([
		{
			sourceEndIndex: 18,
			sourceIndex: 0,
			type: 'word',
			value: 'customCounterStyle',
		},
	]);
	expect(findListStyleType('inside custom-counter-style')).toEqual([
		{
			sourceEndIndex: 27,
			sourceIndex: 7,
			type: 'word',
			value: 'custom-counter-style',
		},
	]);
	expect(findListStyleType('custom-counter-style outside')).toEqual([
		{
			sourceEndIndex: 20,
			sourceIndex: 0,
			type: 'word',
			value: 'custom-counter-style',
		},
	]);
	expect(findListStyleType("url('sqpurple.gif') custom-counter-style outside")).toEqual([
		{
			sourceEndIndex: 40,
			sourceIndex: 20,
			type: 'word',
			value: 'custom-counter-style',
		},
	]);
	expect(findListStyleType("custom-counter-style url('sqpurple.gif') outside")).toEqual([
		{
			sourceEndIndex: 20,
			sourceIndex: 0,
			type: 'word',
			value: 'custom-counter-style',
		},
	]);
	expect(findListStyleType("url('sqpurple.gif') outside custom-counter-style")).toEqual([
		{
			sourceEndIndex: 48,
			sourceIndex: 28,
			type: 'word',
			value: 'custom-counter-style',
		},
	]);
});
