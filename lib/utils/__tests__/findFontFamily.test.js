'use strict';

const findFontFamily = require('../findFontFamily');

it('findFontFamily', () => {
	expect(findFontFamily('inherit')).toEqual([
		{
			sourceIndex: 0,
			type: 'word',
			value: 'inherit',
		},
	]);
	expect(findFontFamily('INHERIT')).toEqual([
		{
			sourceIndex: 0,
			type: 'word',
			value: 'INHERIT',
		},
	]);
	expect(findFontFamily('12pt/10pt sans-serif')).toEqual([
		{
			sourceIndex: 10,
			type: 'word',
			value: 'sans-serif',
		},
	]);
	expect(findFontFamily('12pt/10pt Red/Black')).toEqual([
		{
			sourceIndex: 10,
			type: 'word',
			value: 'Red/Black',
		},
	]);
	expect(findFontFamily('12pt/10pt Red/Black/Three')).toEqual([
		{
			sourceIndex: 10,
			type: 'word',
			value: 'Red/Black/Three',
		},
	]);
	expect(findFontFamily('12pt/10pt Hawaii 5-0')).toEqual([
		{
			sourceIndex: 10,
			type: 'word',
			value: 'Hawaii 5-0',
		},
	]);
	expect(findFontFamily('12pt/10pt Hawaii 5-0 Font')).toEqual([
		{
			sourceIndex: 10,
			type: 'word',
			value: 'Hawaii 5-0 Font',
		},
	]);
	expect(findFontFamily('12pt/10pt /* serif */ Hawaii 5-0')).toEqual([
		{
			sourceIndex: 22,
			type: 'word',
			value: 'Hawaii 5-0',
		},
	]);
	expect(findFontFamily('italic bold 12px/30px $font, serif')).toEqual([
		{
			sourceIndex: 29,
			type: 'word',
			value: 'serif',
		},
	]);
	expect(findFontFamily('ITALIC BOLD 12PX/30PX serif')).toEqual([
		{
			sourceIndex: 22,
			type: 'word',
			value: 'serif',
		},
	]);
	expect(findFontFamily('italic bold 12px/30px #{$font}, serif')).toEqual([
		{
			sourceIndex: 32,
			type: 'word',
			value: 'serif',
		},
	]);
	expect(findFontFamily('italic bold 12px/30px @font, serif')).toEqual([
		{
			sourceIndex: 29,
			type: 'word',
			value: 'serif',
		},
	]);
	expect(findFontFamily('italic bold 12px/30px var(--font), serif')).toEqual([
		{
			sourceIndex: 35,
			type: 'word',
			value: 'serif',
		},
	]);
	expect(findFontFamily('bold italic 110% serif')).toEqual([
		{
			sourceIndex: 17,
			type: 'word',
			value: 'serif',
		},
	]);
	expect(findFontFamily('normal small-caps 12px/14px fantasy')).toEqual([
		{
			sourceIndex: 28,
			type: 'word',
			value: 'fantasy',
		},
	]);
	expect(findFontFamily('italic bold 12px/30px Georgia, serif')).toEqual([
		{
			sourceIndex: 22,
			type: 'word',
			value: 'Georgia',
		},
		{
			sourceIndex: 31,
			type: 'word',
			value: 'serif',
		},
	]);
	expect(findFontFamily('italic  bold  12px  /  30px  Georgia,  serif')).toEqual([
		{
			sourceIndex: 29,
			type: 'word',
			value: 'Georgia',
		},
		{
			sourceIndex: 39,
			type: 'word',
			value: 'serif',
		},
	]);
	expect(findFontFamily('italic bold 12px/30px Lucida Grande, Arial, sans-serif')).toEqual([
		{
			sourceIndex: 22,
			type: 'word',
			value: 'Lucida Grande',
		},
		{
			sourceIndex: 37,
			type: 'word',
			value: 'Arial',
		},
		{
			sourceIndex: 44,
			type: 'word',
			value: 'sans-serif',
		},
	]);
	expect(findFontFamily('italic bold 12px/ 30px Lucida Grande, Arial, sans-serif')).toEqual([
		{
			sourceIndex: 23,
			type: 'word',
			value: 'Lucida Grande',
		},
		{
			sourceIndex: 38,
			type: 'word',
			value: 'Arial',
		},
		{
			sourceIndex: 45,
			type: 'word',
			value: 'sans-serif',
		},
	]);
	expect(findFontFamily('italic bold 12px /30px Lucida Grande, Arial, sans-serif')).toEqual([
		{
			sourceIndex: 23,
			type: 'word',
			value: 'Lucida Grande',
		},
		{
			sourceIndex: 38,
			type: 'word',
			value: 'Arial',
		},
		{
			sourceIndex: 45,
			type: 'word',
			value: 'sans-serif',
		},
	]);
	expect(findFontFamily('italic 1000 12px /30px Lucida Grande, Arial, sans-serif')).toEqual([
		{
			sourceIndex: 23,
			type: 'word',
			value: 'Lucida Grande',
		},
		{
			sourceIndex: 38,
			type: 'word',
			value: 'Arial',
		},
		{
			sourceIndex: 45,
			type: 'word',
			value: 'sans-serif',
		},
	]);
	expect(findFontFamily('italic bold 12px/30px Lucida Grande, Arial, sans-serif')).toEqual([
		{
			sourceIndex: 22,
			type: 'word',
			value: 'Lucida Grande',
		},
		{
			sourceIndex: 37,
			type: 'word',
			value: 'Arial',
		},
		{
			sourceIndex: 44,
			type: 'word',
			value: 'sans-serif',
		},
	]);
	expect(findFontFamily('italic bold 12px/30px "Red/Black", Arial, sans-serif')).toEqual([
		{
			quote: '"',
			sourceIndex: 22,
			type: 'string',
			value: 'Red/Black',
		},
		{
			sourceIndex: 35,
			type: 'word',
			value: 'Arial',
		},
		{
			sourceIndex: 42,
			type: 'word',
			value: 'sans-serif',
		},
	]);
	expect(findFontFamily('italic bold 12px/30px Arial, "Ahem!", sans-serif')).toEqual([
		{
			sourceIndex: 22,
			type: 'word',
			value: 'Arial',
		},
		{
			quote: '"',
			sourceIndex: 29,
			type: 'string',
			value: 'Ahem!',
		},
		{
			sourceIndex: 38,
			type: 'word',
			value: 'sans-serif',
		},
	]);
	expect(findFontFamily('italic bold 12px/30px "Hawaii 5-0", Arial, sans-serif')).toEqual([
		{
			quote: '"',
			sourceIndex: 22,
			type: 'string',
			value: 'Hawaii 5-0',
		},
		{
			sourceIndex: 36,
			type: 'word',
			value: 'Arial',
		},
		{
			sourceIndex: 43,
			type: 'word',
			value: 'sans-serif',
		},
	]);

	expect(findFontFamily('16px/3 Arial')).toEqual([
		{
			sourceIndex: 7,
			type: 'word',
			value: 'Arial',
		},
	]);
});
