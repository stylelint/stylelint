'use strict';

const findFontFamily = require('../findFontFamily');

it('findFontFamily', () => {
	expect(findFontFamily('inherit')).toEqual([
		{
			sourceEndIndex: 7,
			sourceIndex: 0,
			type: 'word',
			value: 'inherit',
		},
	]);
	expect(findFontFamily('INHERIT')).toEqual([
		{
			sourceEndIndex: 7,
			sourceIndex: 0,
			type: 'word',
			value: 'INHERIT',
		},
	]);
	expect(findFontFamily('12pt/10pt sans-serif')).toEqual([
		{
			sourceEndIndex: 20,
			sourceIndex: 10,
			type: 'word',
			value: 'sans-serif',
		},
	]);
	expect(findFontFamily('12pt/10pt Red/Black')).toEqual([
		{
			sourceEndIndex: 13,
			sourceIndex: 10,
			type: 'word',
			value: 'Red/Black',
		},
	]);
	expect(findFontFamily('12pt/10pt Red/Black/Three')).toEqual([
		{
			sourceEndIndex: 13,
			sourceIndex: 10,
			type: 'word',
			value: 'Red/Black/Three',
		},
	]);
	expect(findFontFamily('12pt/10pt Hawaii 5-0')).toEqual([
		{
			sourceEndIndex: 16,
			sourceIndex: 10,
			type: 'word',
			value: 'Hawaii 5-0',
		},
	]);
	expect(findFontFamily('12pt/10pt Hawaii 5-0 Font')).toEqual([
		{
			sourceEndIndex: 16,
			sourceIndex: 10,
			type: 'word',
			value: 'Hawaii 5-0 Font',
		},
	]);
	expect(findFontFamily('12pt/10pt /* serif */ Hawaii 5-0')).toEqual([
		{
			sourceEndIndex: 28,
			sourceIndex: 22,
			type: 'word',
			value: 'Hawaii 5-0',
		},
	]);
	expect(findFontFamily('italic bold 12px/30px $font, serif')).toEqual([
		{
			sourceEndIndex: 34,
			sourceIndex: 29,
			type: 'word',
			value: 'serif',
		},
	]);
	expect(findFontFamily('ITALIC BOLD 12PX/30PX serif')).toEqual([
		{
			sourceEndIndex: 27,
			sourceIndex: 22,
			type: 'word',
			value: 'serif',
		},
	]);
	expect(findFontFamily('italic bold 12px/30px #{$font}, serif')).toEqual([
		{
			sourceEndIndex: 37,
			sourceIndex: 32,
			type: 'word',
			value: 'serif',
		},
	]);
	expect(findFontFamily('italic bold 12px/30px @font, serif')).toEqual([
		{
			sourceEndIndex: 34,
			sourceIndex: 29,
			type: 'word',
			value: 'serif',
		},
	]);
	expect(findFontFamily('italic bold 12px/30px var(--font), serif')).toEqual([
		{
			sourceEndIndex: 40,
			sourceIndex: 35,
			type: 'word',
			value: 'serif',
		},
	]);
	expect(findFontFamily('bold italic 110% serif')).toEqual([
		{
			sourceEndIndex: 22,
			sourceIndex: 17,
			type: 'word',
			value: 'serif',
		},
	]);
	expect(findFontFamily('normal small-caps 12px/14px fantasy')).toEqual([
		{
			sourceEndIndex: 35,
			sourceIndex: 28,
			type: 'word',
			value: 'fantasy',
		},
	]);
	expect(findFontFamily('italic bold 12px/30px Georgia, serif')).toEqual([
		{
			sourceEndIndex: 29,
			sourceIndex: 22,
			type: 'word',
			value: 'Georgia',
		},
		{
			sourceEndIndex: 36,
			sourceIndex: 31,
			type: 'word',
			value: 'serif',
		},
	]);
	expect(findFontFamily('italic  bold  12px  /  30px  Georgia,  serif')).toEqual([
		{
			sourceEndIndex: 36,
			sourceIndex: 29,
			type: 'word',
			value: 'Georgia',
		},
		{
			sourceEndIndex: 44,
			sourceIndex: 39,
			type: 'word',
			value: 'serif',
		},
	]);
	expect(findFontFamily('italic bold 12px/30px Lucida Grande, Arial, sans-serif')).toEqual([
		{
			sourceEndIndex: 28,
			sourceIndex: 22,
			type: 'word',
			value: 'Lucida Grande',
		},
		{
			sourceEndIndex: 42,
			sourceIndex: 37,
			type: 'word',
			value: 'Arial',
		},
		{
			sourceEndIndex: 54,
			sourceIndex: 44,
			type: 'word',
			value: 'sans-serif',
		},
	]);
	expect(findFontFamily('italic bold 12px/ 30px Lucida Grande, Arial, sans-serif')).toEqual([
		{
			sourceEndIndex: 29,
			sourceIndex: 23,
			type: 'word',
			value: 'Lucida Grande',
		},
		{
			sourceEndIndex: 43,
			sourceIndex: 38,
			type: 'word',
			value: 'Arial',
		},
		{
			sourceEndIndex: 55,
			sourceIndex: 45,
			type: 'word',
			value: 'sans-serif',
		},
	]);
	expect(findFontFamily('italic bold 12px /30px Lucida Grande, Arial, sans-serif')).toEqual([
		{
			sourceEndIndex: 29,
			sourceIndex: 23,
			type: 'word',
			value: 'Lucida Grande',
		},
		{
			sourceEndIndex: 43,
			sourceIndex: 38,
			type: 'word',
			value: 'Arial',
		},
		{
			sourceEndIndex: 55,
			sourceIndex: 45,
			type: 'word',
			value: 'sans-serif',
		},
	]);
	expect(findFontFamily('italic 1000 12px /30px Lucida Grande, Arial, sans-serif')).toEqual([
		{
			sourceEndIndex: 29,
			sourceIndex: 23,
			type: 'word',
			value: 'Lucida Grande',
		},
		{
			sourceEndIndex: 43,
			sourceIndex: 38,
			type: 'word',
			value: 'Arial',
		},
		{
			sourceEndIndex: 55,
			sourceIndex: 45,
			type: 'word',
			value: 'sans-serif',
		},
	]);
	expect(findFontFamily('italic bold 12px/30px Lucida Grande, Arial, sans-serif')).toEqual([
		{
			sourceEndIndex: 28,
			sourceIndex: 22,
			type: 'word',
			value: 'Lucida Grande',
		},
		{
			sourceEndIndex: 42,
			sourceIndex: 37,
			type: 'word',
			value: 'Arial',
		},
		{
			sourceEndIndex: 54,
			sourceIndex: 44,
			type: 'word',
			value: 'sans-serif',
		},
	]);
	expect(findFontFamily('italic bold 12px/30px "Red/Black", Arial, sans-serif')).toEqual([
		{
			quote: '"',
			sourceEndIndex: 33,
			sourceIndex: 22,
			type: 'string',
			value: 'Red/Black',
		},
		{
			sourceEndIndex: 40,
			sourceIndex: 35,
			type: 'word',
			value: 'Arial',
		},
		{
			sourceEndIndex: 52,
			sourceIndex: 42,
			type: 'word',
			value: 'sans-serif',
		},
	]);
	expect(findFontFamily('italic bold 12px/30px Arial, "Ahem!", sans-serif')).toEqual([
		{
			sourceEndIndex: 27,
			sourceIndex: 22,
			type: 'word',
			value: 'Arial',
		},
		{
			quote: '"',
			sourceEndIndex: 36,
			sourceIndex: 29,
			type: 'string',
			value: 'Ahem!',
		},
		{
			sourceEndIndex: 48,
			sourceIndex: 38,
			type: 'word',
			value: 'sans-serif',
		},
	]);
	expect(findFontFamily('italic bold 12px/30px "Hawaii 5-0", Arial, sans-serif')).toEqual([
		{
			quote: '"',
			sourceEndIndex: 34,
			sourceIndex: 22,
			type: 'string',
			value: 'Hawaii 5-0',
		},
		{
			sourceEndIndex: 41,
			sourceIndex: 36,
			type: 'word',
			value: 'Arial',
		},
		{
			sourceEndIndex: 53,
			sourceIndex: 43,
			type: 'word',
			value: 'sans-serif',
		},
	]);

	expect(findFontFamily('16px/3 Arial')).toEqual([
		{
			sourceEndIndex: 12,
			sourceIndex: 7,
			type: 'word',
			value: 'Arial',
		},
	]);
});
