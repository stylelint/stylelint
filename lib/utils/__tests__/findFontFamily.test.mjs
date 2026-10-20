import assert from 'node:assert/strict';
import { it } from 'node:test';

import findFontFamily from '../findFontFamily.mjs';

it('findFontFamily', () => {
	assert.deepEqual(findFontFamily('inherit'), [
		{
			sourceEndIndex: 7,
			sourceIndex: 0,
			type: 'word',
			value: 'inherit',
		},
	]);
	assert.deepEqual(findFontFamily('INHERIT'), [
		{
			sourceEndIndex: 7,
			sourceIndex: 0,
			type: 'word',
			value: 'INHERIT',
		},
	]);
	assert.deepEqual(findFontFamily('12pt/10pt sans-serif'), [
		{
			sourceEndIndex: 20,
			sourceIndex: 10,
			type: 'word',
			value: 'sans-serif',
		},
	]);
	assert.deepEqual(findFontFamily('12pt/10pt Red/Black'), [
		{
			sourceEndIndex: 13,
			sourceIndex: 10,
			type: 'word',
			value: 'Red/Black',
		},
	]);
	assert.deepEqual(findFontFamily('12pt/10pt Red/Black/Three'), [
		{
			sourceEndIndex: 13,
			sourceIndex: 10,
			type: 'word',
			value: 'Red/Black/Three',
		},
	]);
	assert.deepEqual(findFontFamily('12pt/10pt Hawaii 5-0'), [
		{
			sourceEndIndex: 16,
			sourceIndex: 10,
			type: 'word',
			value: 'Hawaii 5-0',
		},
	]);
	assert.deepEqual(findFontFamily('12pt/10pt Hawaii 5-0 Font'), [
		{
			sourceEndIndex: 16,
			sourceIndex: 10,
			type: 'word',
			value: 'Hawaii 5-0 Font',
		},
	]);
	assert.deepEqual(findFontFamily('12pt/10pt /* serif */ Hawaii 5-0'), [
		{
			sourceEndIndex: 28,
			sourceIndex: 22,
			type: 'word',
			value: 'Hawaii 5-0',
		},
	]);
	assert.deepEqual(findFontFamily('italic bold 12px/30px $font, serif'), [
		{
			sourceEndIndex: 34,
			sourceIndex: 29,
			type: 'word',
			value: 'serif',
		},
	]);
	assert.deepEqual(findFontFamily('ITALIC BOLD 12PX/30PX serif'), [
		{
			sourceEndIndex: 27,
			sourceIndex: 22,
			type: 'word',
			value: 'serif',
		},
	]);
	assert.deepEqual(findFontFamily('italic bold 12px/30px #{$font}, serif'), [
		{
			sourceEndIndex: 37,
			sourceIndex: 32,
			type: 'word',
			value: 'serif',
		},
	]);
	assert.deepEqual(findFontFamily('italic bold 12px/30px @font, serif'), [
		{
			sourceEndIndex: 34,
			sourceIndex: 29,
			type: 'word',
			value: 'serif',
		},
	]);
	assert.deepEqual(findFontFamily('italic bold 12px/30px var(--font), serif'), [
		{
			sourceEndIndex: 40,
			sourceIndex: 35,
			type: 'word',
			value: 'serif',
		},
	]);
	assert.deepEqual(findFontFamily('bold italic 110% serif'), [
		{
			sourceEndIndex: 22,
			sourceIndex: 17,
			type: 'word',
			value: 'serif',
		},
	]);
	assert.deepEqual(findFontFamily('normal small-caps 12px/14px fantasy'), [
		{
			sourceEndIndex: 35,
			sourceIndex: 28,
			type: 'word',
			value: 'fantasy',
		},
	]);
	assert.deepEqual(findFontFamily('italic bold 12px/30px Georgia, serif'), [
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
	assert.deepEqual(findFontFamily('italic  bold  12px  /  30px  Georgia,  serif'), [
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
	assert.deepEqual(findFontFamily('italic bold 12px/30px Lucida Grande, Arial, sans-serif'), [
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
	assert.deepEqual(findFontFamily('italic bold 12px/ 30px Lucida Grande, Arial, sans-serif'), [
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
	assert.deepEqual(findFontFamily('italic bold 12px /30px Lucida Grande, Arial, sans-serif'), [
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
	assert.deepEqual(findFontFamily('italic 1000 12px /30px Lucida Grande, Arial, sans-serif'), [
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
	assert.deepEqual(findFontFamily('italic bold 12px/30px Lucida Grande, Arial, sans-serif'), [
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
	assert.deepEqual(findFontFamily('italic bold 12px/30px "Red/Black", Arial, sans-serif'), [
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
	assert.deepEqual(findFontFamily('italic bold 12px/30px Arial, "Ahem!", sans-serif'), [
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
	assert.deepEqual(findFontFamily('italic bold 12px/30px "Hawaii 5-0", Arial, sans-serif'), [
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
	assert.deepEqual(findFontFamily('16px/3 Arial'), [
		{
			sourceEndIndex: 12,
			sourceIndex: 7,
			type: 'word',
			value: 'Arial',
		},
	]);
	assert.deepEqual(findFontFamily('12px math'), [
		{
			sourceEndIndex: 9,
			sourceIndex: 5,
			type: 'word',
			value: 'math',
		},
	]);
	assert.deepEqual(findFontFamily('math, math'), [
		{
			sourceEndIndex: 4,
			sourceIndex: 0,
			type: 'word',
			value: 'math',
		},
		{
			sourceEndIndex: 10,
			sourceIndex: 6,
			type: 'word',
			value: 'math',
		},
	]);
	assert.deepEqual(findFontFamily('math math'), [
		{
			sourceEndIndex: 9,
			sourceIndex: 5,
			type: 'word',
			value: 'math',
		},
	]);
	assert.deepEqual(findFontFamily('math / normal math'), [
		{
			sourceEndIndex: 18,
			sourceIndex: 14,
			type: 'word',
			value: 'math',
		},
	]);
	assert.deepEqual(findFontFamily('math math, math'), [
		{
			sourceEndIndex: 9,
			sourceIndex: 5,
			type: 'word',
			value: 'math',
		},
		{
			sourceEndIndex: 15,
			sourceIndex: 11,
			type: 'word',
			value: 'math',
		},
	]);
	assert.deepEqual(findFontFamily('12px serif, math font'), [
		{
			sourceEndIndex: 10,
			sourceIndex: 5,
			type: 'word',
			value: 'serif',
		},
		{
			sourceEndIndex: 16,
			sourceIndex: 12,
			type: 'word',
			value: 'math font',
		},
	]);
});
