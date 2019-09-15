'use strict';

const findListStyleType = require('../findListStyleType');

it('findListStyleType', () => {
	expect(findListStyleType('inherit')).toEqual([
		{
			sourceIndex: 0,
			type: 'word',
			value: 'inherit',
		},
	]);
	expect(findListStyleType('INHERIT')).toEqual([
		{
			sourceIndex: 0,
			type: 'word',
			value: 'INHERIT',
		},
	]);
	expect(findListStyleType('none')).toEqual([
		{
			sourceIndex: 0,
			type: 'word',
			value: 'none',
		},
	]);
	expect(findListStyleType('circle')).toEqual([
		{
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
			sourceIndex: 0,
			type: 'word',
			value: 'square',
		},
	]);
	expect(findListStyleType('inside square')).toEqual([
		{
			sourceIndex: 7,
			type: 'word',
			value: 'square',
		},
	]);
	expect(findListStyleType("square inside url('sqpurple.gif')")).toEqual([
		{
			sourceIndex: 0,
			type: 'word',
			value: 'square',
		},
	]);
	expect(findListStyleType("SQUARE INSIDE URL('sqpurple.gif')")).toEqual([
		{
			sourceIndex: 0,
			type: 'word',
			value: 'SQUARE',
		},
	]);
	expect(findListStyleType("url('sqpurple.gif') square inside")).toEqual([
		{
			sourceIndex: 20,
			type: 'word',
			value: 'square',
		},
	]);
	expect(findListStyleType("square url('sqpurple.gif') inside")).toEqual([
		{
			sourceIndex: 0,
			type: 'word',
			value: 'square',
		},
	]);
	expect(findListStyleType('custom-counter-style')).toEqual([
		{
			sourceIndex: 0,
			type: 'word',
			value: 'custom-counter-style',
		},
	]);
	expect(findListStyleType('customCounterStyle')).toEqual([
		{
			sourceIndex: 0,
			type: 'word',
			value: 'customCounterStyle',
		},
	]);
	expect(findListStyleType('inside custom-counter-style')).toEqual([
		{
			sourceIndex: 7,
			type: 'word',
			value: 'custom-counter-style',
		},
	]);
	expect(findListStyleType('custom-counter-style outside')).toEqual([
		{
			sourceIndex: 0,
			type: 'word',
			value: 'custom-counter-style',
		},
	]);
	expect(findListStyleType("url('sqpurple.gif') custom-counter-style outside")).toEqual([
		{
			sourceIndex: 20,
			type: 'word',
			value: 'custom-counter-style',
		},
	]);
	expect(findListStyleType("custom-counter-style url('sqpurple.gif') outside")).toEqual([
		{
			sourceIndex: 0,
			type: 'word',
			value: 'custom-counter-style',
		},
	]);
	expect(findListStyleType("url('sqpurple.gif') outside custom-counter-style")).toEqual([
		{
			sourceIndex: 28,
			type: 'word',
			value: 'custom-counter-style',
		},
	]);
});
