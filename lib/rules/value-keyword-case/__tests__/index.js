'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: ['lower'],
	fix: true,

	accept: [
		{
			code: 'a { line-height: 1; }',
		},
		{
			code: 'a { color: #000; }',
		},
		{
			code: 'a { color: #fff; }',
		},
		{
			code: 'a { color: #FFF; }',
		},
		{
			code: 'a { color: rgb(0, 255, 0); }',
		},
		{
			code: 'a { font-size: 100%; }',
		},
		{
			code: 'a { width: 10px; }',
		},
		{
			code: 'a { display: block; }',
		},
		{
			code: 'a:hover { display: block; }',
		},
		{
			code: 'a:other { display: block; }',
		},
		{
			code: 'a::before { display: block; }',
		},
		{
			code: 'a::other { display: block; }',
		},
		{
			code: 'a { display: block !import; }',
		},
		{
			code: 'a { transition: -webkit-transform 2s; }',
		},
		{
			code: 'a { background-position: top right, 1em 5vh; }',
		},
		{
			code: 'a { background-image: linear-gradient(to right, white calc(100% - 50em), silver); }',
		},
		{
			code: 'a { transform: rotate(90deg); }',
			description: 'ignore function',
		},
		{
			code: 'a { transform: ROTATE(90deg); }',
			description: 'ignore function',
		},
		{
			code: 'a { width: /* BLOCK */ 1em; }',
			description: 'ignore value keyword within comments',
		},
		{
			code: 'a::before { content: "BLOCK"}',
			description: 'ignore value keyword within quotes',
		},
		{
			code: 'a::before { content: "TeSt tEsT"}',
			description: 'ignore value within quotes',
		},
		{
			code: 'a { content: url(http://www.example.com/test.png) ; }',
		},
		{
			code: 'a { content: attr(value-string); }',
		},
		{
			code: 'a { content: attr(vAlUe-StRiNg); }',
		},
		{
			code: 'a { content: attr(VALUE-STRING); }',
		},
		{
			code: 'a { content: counter(counter-name); }',
		},
		{
			code: 'a { content: counter(cOuNtEr-NaMe); }',
		},
		{
			code: 'a { content: counter(COUNTER-NAME); }',
		},
		{
			code: 'a { content: counters(counter-name); }',
		},
		{
			code: 'a { content: counters(cOuNtEr-NaMe); }',
		},
		{
			code: 'a { content: counters(COUNTER-NAME); }',
		},
		{
			code: "a { content: '[' counter(counter-name) ']' ; }",
		},
		{
			code: "a { content: '[' counter(cOuNtEr-NaMe) ']'; }",
		},
		{
			code: "a { content: '[' counter(COUNTER-NAME) ']'; }",
		},
		{
			code: 'a { font-size: $fsBLOCK; }',
			description: 'ignore preprocessor variable includes value keyword',
		},
		{
			code: 'a { font-size: @fsBLOCK; }',
			description: 'ignore preprocessor variable includes value keyword',
		},
		{
			code: 'a { font-size: var(--some-fs-BLOCK); }',
			description: 'ignore css variable includes value keyword',
		},
		{
			code: 'a { font-size: vAr(--some-fs-BLOCK); }',
			description: 'ignore css variable includes value keyword',
		},
		{
			code: 'a { font-size: VAR(--some-fs-BLOCK); }',
			description: 'ignore css variable includes value keyword',
		},
		{
			code: 'a { background-url: url(BLOCK); }',
			description: 'ignore url function',
		},
		{
			code: 'a { background-url: uRl(BLOCK); }',
			description: 'ignore url function',
		},
		{
			code: 'a { background-url: URL(BLOCK); }',
			description: 'ignore url function',
		},
		{
			code: 'a { displayBLOCK: block; }',
			description: 'ignore property include value keyword',
		},
		{
			code: 'aBLOCK { display: block; }',
			description: 'ignore type selector include value keyword',
		},
		{
			code: '#aBLOCK { display: block; }',
			description: 'ignore class selector include value keyword',
		},
		{
			code: '.aBLOCK { display: block; }',
			description: 'ignore class selector include value keyword',
		},
		{
			code: 'input[type=BLOCK] { display: block; }',
			description: 'ignore class selector include value keyword',
		},
		{
			code: 'a:hoverBLOCK { display: block; }',
			description: 'ignore pseudo-class include value keyword',
		},
		{
			code: 'a::beforeBLOCK { display: block; }',
			description: 'ignore pseudo-class include value keyword',
		},
		{
			code: 'a { display: super-block; }',
			description: 'work with unknown value keyword',
		},
		{
			code: '@media (min-width: 768px) { color: red; }',
		},
		{
			code: '@media screen { color: green; @media (min-width: 768px) { color: red; } }',
		},
		{
			code: 'a { color: red; border: 5px solid currentColor; }',
		},
		{
			code: 'a { text-rendering: optimizeSpeed; }',
		},
		{
			code: 'a { text-rendering: optimizeLegibility; }',
		},
		{
			code: 'a { text-rendering: geometricPrecision; }',
		},
		{
			code: 'a { animation: inherit; }',
		},
		{
			code: 'a { animation: none; }',
		},
		{
			code: 'a { animation: 3s ease-in 1s 2 reverse both paused animation-name; }',
		},
		{
			code: 'a { animation: 3s ease-in 1s 2 reverse both paused aNiMaTiOn-NaMe; }',
		},
		{
			code: 'a { animation: 3s ease-in 1s 2 reverse both paused ANIMATION-NAME; }',
		},
		{
			code: 'a { animation-name: animation-name; }',
		},
		{
			code: 'a { animation-name: aNiMaTiOn-NaMe; }',
		},
		{
			code: 'a { animation-name: ANIMATION-NAME; }',
		},
		{
			code: 'a { font: italic 2em font-family, sans-serif; }',
		},
		{
			code: 'a { font: italic 2em fOnT-FaMiLy, sans-serif; }',
		},
		{
			code: 'a { font: italic 2em FONT-FAMILY, sans-serif; }',
		},
		{
			code: 'a { font-family: serif; }',
		},
		{
			code: 'a { font-family: Gill Sans Extrabold, sans-serif; }',
		},
		{
			code: 'a { counter-increment: counter-name; }',
		},
		{
			code: 'a { counter-increment: cOuNtEr-NaMe; }',
		},
		{
			code: 'a { counter-increment: COUNTER-NAME; }',
		},
		{
			code: 'a { counter-reset: counter-name; }',
		},
		{
			code: 'a { counter-reset: cOuNtEr-NaMe; }',
		},
		{
			code: 'a { counter-reset: COUNTER-NAME; }',
		},
		{
			code: 'a { grid-row: auto / auto; }',
		},
		{
			code: 'a { grid-row: 5 SOOMEGRIDAREA span / 2 span; }',
		},
		{
			code: 'a { grid-column: auto / auto; }',
		},
		{
			code: 'a { grid-column: 5 SOOMEGRIDAREA span / 2 span; }',
		},
		{
			code: 'a { grid-area: auto / auto; }',
		},
		{
			code: 'a { grid-area: 5 SOOMEGRIDAREA span / 2 span; }',
		},
		{
			code: 'a { grid-area: [linename1] 100px [linename2 linename3]; }',
		},
		{
			code: 'a { list-style: inherit; }',
		},
		{
			code: 'a { list-style: none; }',
		},
		{
			code: 'a { list-style: square; }',
		},
		{
			code: "a { list-style: lower-roman url('../img/dino.png') outside; }",
		},
		{
			code: 'a { list-style: custom-counter-style; }',
		},
		{
			code: 'a { list-style: cUsToM-cOuNtEr-StYle; }',
		},
		{
			code: 'a { list-style: CUSTOM-COUNTER-STYLE; }',
		},
		{
			code: 'ol { list-style-type: upper-alpha; }',
		},
		{
			code: 'ol { list-style-type: CUSTOM-COUNTER-STYLE; }',
		},
		{
			code: 'a { color: InactiveCaptionText; }',
			description: 'system color',
		},
		{
			code: 'a { color: ThreeDShadow; }',
			description: 'another system color',
		},
		{
			code: 'a { grid-column-start: span camelCaseArea; }',
			description: 'ignore area case',
		},
	],

	reject: [
		{
			code: 'a { display: Block; }',
			fixed: 'a { display: block; }',
			message: messages.expected('Block', 'block'),
			line: 1,
			column: 14,
		},
		{
			code: 'a { display: Block /* comment */; }',
			fixed: 'a { display: block /* comment */; }',
			message: messages.expected('Block', 'block'),
			line: 1,
			column: 14,
		},
		{
			code: 'a { display: bLoCk; }',
			fixed: 'a { display: block; }',
			message: messages.expected('bLoCk', 'block'),
			line: 1,
			column: 14,
		},
		{
			code: 'a { display: BLOCK; }',
			fixed: 'a { display: block; }',
			message: messages.expected('BLOCK', 'block'),
			line: 1,
			column: 14,
		},
		{
			code: 'a:hover { display: Block; }',
			fixed: 'a:hover { display: block; }',
			message: messages.expected('Block', 'block'),
			line: 1,
			column: 20,
		},
		{
			code: 'a:other { display: Block; }',
			fixed: 'a:other { display: block; }',
			message: messages.expected('Block', 'block'),
			line: 1,
			column: 20,
		},
		{
			code: 'a::before { display: Block; }',
			fixed: 'a::before { display: block; }',
			message: messages.expected('Block', 'block'),
			line: 1,
			column: 22,
		},
		{
			code: 'a::other { display: Block; }',
			fixed: 'a::other { display: block; }',
			message: messages.expected('Block', 'block'),
			line: 1,
			column: 21,
		},
		{
			code: 'a { display: block !Import; }',
			fixed: 'a { display: block !import; }',
			message: messages.expected('!Import', '!import'),
			line: 1,
			column: 20,
		},
		{
			code: 'a { display: block !iMpOrT; }',
			fixed: 'a { display: block !import; }',
			message: messages.expected('!iMpOrT', '!import'),
			line: 1,
			column: 20,
		},
		{
			code: 'a { display: block !IMPORT; }',
			fixed: 'a { display: block !import; }',
			message: messages.expected('!IMPORT', '!import'),
			line: 1,
			column: 20,
		},
		{
			code: 'a { background-position: Top right, 1em 5vh; }',
			fixed: 'a { background-position: top right, 1em 5vh; }',
			message: messages.expected('Top', 'top'),
			line: 1,
			column: 26,
		},
		{
			code: 'a { background-position: top Right, 1em 5vh; }',
			fixed: 'a { background-position: top right, 1em 5vh; }',
			message: messages.expected('Right', 'right'),
			line: 1,
			column: 30,
		},
		{
			code: 'a { transition: -Webkit-transform 2s; }',
			fixed: 'a { transition: -webkit-transform 2s; }',
			message: messages.expected('-Webkit-transform', '-webkit-transform'),
			line: 1,
			column: 17,
		},
		{
			code: 'a { transition: -webkit-Transform 2s; }',
			fixed: 'a { transition: -webkit-transform 2s; }',
			message: messages.expected('-webkit-Transform', '-webkit-transform'),
			line: 1,
			column: 17,
		},
		{
			code: 'a { background-image: linear-gradient(To right, white calc(100% - 50em), silver); }',
			fixed: 'a { background-image: linear-gradient(to right, white calc(100% - 50em), silver); }',
			message: messages.expected('To', 'to'),
			line: 1,
			column: 39,
		},
		{
			code: 'a { background-image: linear-gradient(to Right, white calc(100% - 50em), silver); }',
			fixed: 'a { background-image: linear-gradient(to right, white calc(100% - 50em), silver); }',
			message: messages.expected('Right', 'right'),
			line: 1,
			column: 42,
		},
		{
			code: 'a { background-image: linear-gradient(to right, white calc(100% - 50em), Silver); }',
			fixed: 'a { background-image: linear-gradient(to right, white calc(100% - 50em), silver); }',
			message: messages.expected('Silver', 'silver'),
			line: 1,
			column: 74,
		},
		{
			code: 'a { display: Super-block; }',
			fixed: 'a { display: super-block; }',
			description: 'work with unknown value keyword',
			message: messages.expected('Super-block', 'super-block'),
			line: 1,
			column: 14,
		},
		{
			code: '@media (min-width: 768px) { color: Red; }',
			fixed: '@media (min-width: 768px) { color: red; }',
			message: messages.expected('Red', 'red'),
			line: 1,
			column: 36,
		},
		{
			code: '@media screen { color: green; @media (min-width: 768px) { color: Red; } }',
			fixed: '@media screen { color: green; @media (min-width: 768px) { color: red; } }',
			message: messages.expected('Red', 'red'),
			line: 1,
			column: 66,
		},
		{
			code: 'a { text-rendering: OptimizeSpeed; }',
			fixed: 'a { text-rendering: optimizeSpeed; }',
			message: messages.expected('OptimizeSpeed', 'optimizeSpeed'),
			line: 1,
			column: 21,
		},
		{
			code: 'a { animation: INHERIT; }',
			fixed: 'a { animation: inherit; }',
			message: messages.expected('INHERIT', 'inherit'),
			line: 1,
			column: 16,
		},
		{
			code: 'a { animation: NONE; }',
			fixed: 'a { animation: none; }',
			message: messages.expected('NONE', 'none'),
			line: 1,
			column: 16,
		},
		{
			code: 'a { animation: 3s LINEAR 1s animation-name; }',
			fixed: 'a { animation: 3s linear 1s animation-name; }',
			message: messages.expected('LINEAR', 'linear'),
			line: 1,
			column: 19,
		},
		{
			code: 'a { animation: 3s LINEAR 1s aNiMaTiOn-NaMe; }',
			fixed: 'a { animation: 3s linear 1s aNiMaTiOn-NaMe; }',
			message: messages.expected('LINEAR', 'linear'),
			line: 1,
			column: 19,
		},
		{
			code: 'a { animation: 3s LINEAR 1s ANIMATION-NAME; }',
			fixed: 'a { animation: 3s linear 1s ANIMATION-NAME; }',
			message: messages.expected('LINEAR', 'linear'),
			line: 1,
			column: 19,
		},
		{
			code: 'a { animation-name: INHERIT; }',
			fixed: 'a { animation-name: inherit; }',
			message: messages.expected('INHERIT', 'inherit'),
			line: 1,
			column: 21,
		},
		{
			code: 'a { font: ITALIC 2em font-family, sans-serif; }',
			fixed: 'a { font: italic 2em font-family, sans-serif; }',
			message: messages.expected('ITALIC', 'italic'),
			line: 1,
			column: 11,
		},
		{
			code: 'a { font: ITALIC 2em fOnT-FaMiLy, sans-serif; }',
			fixed: 'a { font: italic 2em fOnT-FaMiLy, sans-serif; }',
			message: messages.expected('ITALIC', 'italic'),
			line: 1,
			column: 11,
		},
		{
			code: 'a { font: ITALIC 2em FONT-FAMILY, sans-serif; }',
			fixed: 'a { font: italic 2em FONT-FAMILY, sans-serif; }',
			message: messages.expected('ITALIC', 'italic'),
			line: 1,
			column: 11,
		},
		{
			code: 'a { font: italic 2em FONT-FAMILY, SANS-SERIF; }',
			fixed: 'a { font: italic 2em FONT-FAMILY, sans-serif; }',
			message: messages.expected('SANS-SERIF', 'sans-serif'),
			line: 1,
			column: 35,
		},
		{
			code: 'a { font-family: MONOSPACE; }',
			fixed: 'a { font-family: monospace; }',
			message: messages.expected('MONOSPACE', 'monospace'),
			line: 1,
			column: 18,
		},
		{
			code: 'a { counter-increment: INHERIT; }',
			fixed: 'a { counter-increment: inherit; }',
			message: messages.expected('INHERIT', 'inherit'),
			line: 1,
			column: 24,
		},
		{
			code: 'a { counter-reset: INHERIT; }',
			fixed: 'a { counter-reset: inherit; }',
			message: messages.expected('INHERIT', 'inherit'),
			line: 1,
			column: 20,
		},
		{
			code: 'a { grid-row: AUTO / auto; }',
			fixed: 'a { grid-row: auto / auto; }',
			message: messages.expected('AUTO', 'auto'),
			line: 1,
			column: 15,
		},
		{
			code: 'a { grid-row: SPAN SOMEGRIDAREA;; }',
			fixed: 'a { grid-row: span SOMEGRIDAREA;; }',
			message: messages.expected('SPAN', 'span'),
			line: 1,
			column: 15,
		},
		{
			code: 'a { grid-column: AUTO / auto; }',
			fixed: 'a { grid-column: auto / auto; }',
			message: messages.expected('AUTO', 'auto'),
			line: 1,
			column: 18,
		},
		{
			code: 'a { grid-column: SPAN SOMEGRIDAREA;; }',
			fixed: 'a { grid-column: span SOMEGRIDAREA;; }',
			message: messages.expected('SPAN', 'span'),
			line: 1,
			column: 18,
		},
		{
			code: 'a { grid-area: AUTO / auto; }',
			fixed: 'a { grid-area: auto / auto; }',
			message: messages.expected('AUTO', 'auto'),
			line: 1,
			column: 16,
		},
		{
			code: 'a { grid-area: SPAN SOMEGRIDAREA;; }',
			fixed: 'a { grid-area: span SOMEGRIDAREA;; }',
			message: messages.expected('SPAN', 'span'),
			line: 1,
			column: 16,
		},
		{
			code: 'a { list-style: INHERIT; }',
			fixed: 'a { list-style: inherit; }',
			message: messages.expected('INHERIT', 'inherit'),
			line: 1,
			column: 17,
		},
		{
			code: 'a { list-style: NONE; }',
			fixed: 'a { list-style: none; }',
			message: messages.expected('NONE', 'none'),
			line: 1,
			column: 17,
		},
		{
			code: 'a { list-style: SQUARE; }',
			fixed: 'a { list-style: square; }',
			message: messages.expected('SQUARE', 'square'),
			line: 1,
			column: 17,
		},
		{
			code: "a { list-style: custom-counter-style url('../img/dino.png') OUTSIDE; }",
			fixed: "a { list-style: custom-counter-style url('../img/dino.png') outside; }",
			message: messages.expected('OUTSIDE', 'outside'),
			line: 1,
			column: 61,
		},
		{
			code: "a { list-style: cUsToM-cOuNtEr-StYlE url('../img/dino.png') OUTSIDE; }",
			fixed: "a { list-style: cUsToM-cOuNtEr-StYlE url('../img/dino.png') outside; }",
			message: messages.expected('OUTSIDE', 'outside'),
			line: 1,
			column: 61,
		},
		{
			code: "a { list-style: CUSTOM-COUNTER-STYLE url('../img/dino.png') OUTSIDE; }",
			fixed: "a { list-style: CUSTOM-COUNTER-STYLE url('../img/dino.png') outside; }",
			message: messages.expected('OUTSIDE', 'outside'),
			line: 1,
			column: 61,
		},
		{
			code: "a { list-style: LOWER-ROMAN url('../img/dino.png') outside; }",
			fixed: "a { list-style: lower-roman url('../img/dino.png') outside; }",
			message: messages.expected('LOWER-ROMAN', 'lower-roman'),
			line: 1,
			column: 17,
		},
		{
			code: 'ol { list-style-type: UPPER-ALPHA; }',
			fixed: 'ol { list-style-type: upper-alpha; }',
			message: messages.expected('UPPER-ALPHA', 'upper-alpha'),
			line: 1,
			column: 23,
		},
		{
			code: 'a { grid-column-start: sPan camelCaseArea; }',
			fixed: 'a { grid-column-start: span camelCaseArea; }',
			message: messages.expected('sPan', 'span'),
			line: 1,
			column: 24,
		},
		{
			code: 'a { GRID-COLUMN-START: SPAN camelCaseArea; }',
			fixed: 'a { GRID-COLUMN-START: span camelCaseArea; }',
			message: messages.expected('SPAN', 'span'),
			line: 1,
			column: 24,
		},
	],
});

testRule({
	ruleName,
	syntax: 'scss',
	config: ['lower'],
	fix: true,

	accept: [
		{
			code: 'a { width: 1em; \n// display: BLOCK\n }',
			description: 'ignore unit within comments',
		},
		{
			code: '$list: (\n key: "vAluE", // single quote comment\n );',
			description: 'ignore list single quote comment',
		},
		{
			code: 'a { $display: block; }',
		},
		{
			code: 'a { margin: 10PX + 10px; }',
		},
		{
			code: 'a { margin: $margin; }',
		},
		{
			code: 'a { margin: $mArGiN; }',
		},
		{
			code: 'a { margin: $MARGIN; }',
		},
		{
			code: 'a { margin: $marginValue; }',
		},
		{
			code: 'a { margin: -$marginValue; }',
		},
		{
			code: 'a { margin: 10+$marginValue; }',
		},
		{
			code: 'a { margin: 10 - $marginValue; }',
		},
		{
			code: 'a { margin: 10 -$marginValue; }',
		},
		{
			code: 'a { margin: 10 *$marginValue; }',
		},
		{
			code: 'a { margin: 10 /$marginValue; }',
		},
		{
			code: 'a { margin: $margin + 10px; }',
		},
		{
			code: 'a { margin: $mArGiN + 10px; }',
		},
		{
			code: 'a { margin: $MARGIN + 10px; }',
		},
		{
			code: 'a { color: some-function(10px); }',
		},
		{
			code: 'a { color: Some-function(10px); }',
		},
		{
			code: 'a { color: some-Function(10px); }',
		},
		{
			code: 'p { font: #{$Font-size}/#{$line-height}; }',
		},
		{
			code: 'p { font: #{$font-Size}/#{$line-height}; }',
		},
		{
			code: 'p { font: #{$font-size}/#{$Line-height}; }',
		},
		{
			code: 'p { font: #{$font-size}/#{$line-Height}; }',
		},
		{
			code: 'a { background-color: spin(lighten($Base, 25%), 8); }',
		},
		{
			code: 'a { background-color: spin(Lighten($base, 25%), 8); }',
		},
		{
			code: 'a { background-color: Spin(lighten($base, 25%), 8); }',
		},
		{
			code: '.content { .link { display: block; } }',
		},
		{
			code: '.a { &-link { display: block } }',
		},
		{
			code: '$map: (display-first: block, display-second: inline);',
		},
		{
			code: 'a { background-#{$variable}: property#{$variable}; }',
		},
		{
			code: 'a { background-#{$variable}: PROPERTY#{$variable}; }',
		},
	],

	reject: [
		{
			code: 'a { $display: Block; }',
			fixed: 'a { $display: block; }',
			message: messages.expected('Block', 'block'),
			line: 1,
			column: 15,
		},
		{
			code: 'a { $display: bLoCk; }',
			fixed: 'a { $display: block; }',
			message: messages.expected('bLoCk', 'block'),
			line: 1,
			column: 15,
		},
		{
			code: 'a { $display: BLOCK; }',
			fixed: 'a { $display: block; }',
			message: messages.expected('BLOCK', 'block'),
			line: 1,
			column: 15,
		},
		{
			code: 'a { font: (italic Bold 10px/8PX) }',
			fixed: 'a { font: (italic bold 10px/8PX) }',
			message: messages.expected('Bold', 'bold'),
			line: 1,
			column: 19,
		},
		{
			code: '.content { .link { display: Block; } }',
			fixed: '.content { .link { display: block; } }',
			message: messages.expected('Block', 'block'),
			line: 1,
			column: 29,
		},
		{
			code: '.a { &-link { display: Block } }',
			fixed: '.a { &-link { display: block } }',
			message: messages.expected('Block', 'block'),
			line: 1,
			column: 24,
		},
		{
			code: '$map: (Display-first: block, display-second: inline);',
			fixed: '$map: (display-first: block, display-second: inline);',
			message: messages.expected('Display-first', 'display-first'),
			line: 1,
			column: 8,
		},
		{
			code: '$map: (display-first: Block, display-second: inline);',
			fixed: '$map: (display-first: block, display-second: inline);',
			message: messages.expected('Block', 'block'),
			line: 1,
			column: 23,
		},
		{
			code: '$map: (display-first: block, display-second: Inline);',
			fixed: '$map: (display-first: block, display-second: inline);',
			message: messages.expected('Inline', 'inline'),
			line: 1,
			column: 46,
		},
	],
});

testRule({
	ruleName,
	syntax: 'less',
	config: ['lower'],
	fix: true,

	accept: [
		{
			code: 'a { width: 1em; \n// display: BLOCK\n }',
			description: 'ignore unit within comments',
		},
		{
			code: 'a { @display: block; }',
		},
		{
			code: 'a { margin: 10PX + 10px; }',
		},
		{
			code: 'a { margin: @margin; }',
		},
		{
			code: 'a { margin: @mArGiN; }',
		},
		{
			code: 'a { margin: @MARGIN; }',
		},
		{
			code: 'a { margin: @margin + 10px; }',
		},
		{
			code: 'a { margin: @mArGiN + 10px; }',
		},
		{
			code: 'a { margin: @MARGIN + 10px; }',
		},
		{
			code: 'a { margin: @marginValue; }',
		},
		{
			code: 'a { margin: -@marginValue; }',
		},
		{
			code: 'a { margin: 10+@marginValue; }',
		},
		{
			code: 'a { margin: 10 - @marginValue; }',
		},
		{
			code: 'a { margin: 10 -@marginValue; }',
		},
		{
			code: 'a { margin: 10 *@marginValue; }',
		},
		{
			code: 'a { margin: 10 /@marginValue; }',
		},
		{
			code: '.bordered { border-bottom: solid 2px black; }',
			description: 'inside mixin',
		},
		{
			code: '#header { .navigation { display: block; } }',
			description: 'nested',
		},
		{
			code: 'a { color: some-function(10px); }',
		},
		{
			code: 'a { color: Some-function(10px); }',
		},
		{
			code: 'a { color: some-Function(10px); }',
		},
		{
			code: 'a { background-color: spin(lighten(@Base, 25%), 8); }',
		},
		{
			code: 'a { background-color: spin(lighten(@Base, 25%), 8); }',
		},
		{
			code: 'a { background-color: Spin(Lighten(@Base, 25%), 8); }',
		},
		{
			code: '@detached-ruleset: { background: red; };',
		},
		{
			code: '.a { &-link { background: red; } };',
		},
	],

	reject: [
		{
			code: '.bordered { border-bottom: Solid 2px black; }',
			fixed: '.bordered { border-bottom: solid 2px black; }',
			description: 'inside mixin',
			message: messages.expected('Solid', 'solid'),
			line: 1,
			column: 28,
		},
		{
			code: '.bordered { border-bottom: solid 2px Black; }',
			fixed: '.bordered { border-bottom: solid 2px black; }',
			description: 'inside mixin',
			message: messages.expected('Black', 'black'),
			line: 1,
			column: 38,
		},
		{
			code: '#header { .navigation { display: Block; } }',
			fixed: '#header { .navigation { display: block; } }',
			description: 'nested',
			message: messages.expected('Block', 'block'),
			line: 1,
			column: 34,
		},
		{
			code: '@detached-ruleset: { background: Red; };',
			fixed: '@detached-ruleset: { background: red; };',
			message: messages.expected('Red', 'red'),
			line: 1,
			column: 34,
		},
		{
			code: '.a { &-link { background: Red; } };',
			fixed: '.a { &-link { background: red; } };',
			message: messages.expected('Red', 'red'),
			line: 1,
			column: 27,
		},
	],
});

testRule({
	ruleName,
	config: ['upper'],
	fix: true,

	accept: [
		{
			code: 'a { line-height: 1; }',
		},
		{
			code: 'a { color: #000; }',
		},
		{
			code: 'a { color: #fff; }',
		},
		{
			code: 'a { color: #FFF; }',
		},
		{
			code: 'a { color: rgb(0, 255, 0); }',
		},
		{
			code: 'a { font-size: 100%; }',
		},
		{
			code: 'a { width: 10px; }',
		},
		{
			code: 'a { display: BLOCK; }',
		},
		{
			code: 'a:hover { display: BLOCK; }',
		},
		{
			code: 'a:other { display: BLOCK; }',
		},
		{
			code: 'a::before { display: BLOCK; }',
		},
		{
			code: 'a::other { display: BLOCK; }',
		},
		{
			code: 'a { display: BLOCK !IMPORT; }',
		},
		{
			code: 'a { transition: -WEBKIT-TRANSFORM 2s; }',
		},
		{
			code: 'a { background-position: TOP RIGHT, 1em 5vh; }',
		},
		{
			code: 'a { background-image: linear-gradient(TO RIGHT, WHITE calc(100% - 50em), SILVER); }',
		},
		{
			code: 'a { transform: rotate(90deg); }',
			description: 'ignore function',
		},
		{
			code: 'a { transform: ROTATE(90deg); }',
			description: 'ignore function',
		},
		{
			code: 'a { width: /* block */ 1em; }',
			description: 'ignore value keyword within comments',
		},
		{
			code: 'a::before { content: "block"}',
			description: 'ignore value keyword within quotes',
		},
		{
			code: 'a::before { content: "TeSt tEsT"}',
			description: 'ignore value within quotes',
		},
		{
			code: 'a { content: url(http://www.example.com/test.png) ; }',
		},
		{
			code: 'a { content: attr(value-string); }',
		},
		{
			code: 'a { content: attr(vAlUe-StRiNg); }',
		},
		{
			code: 'a { content: attr(VALUE-STRING); }',
		},
		{
			code: 'a { content: counter(counter-name); }',
		},
		{
			code: 'a { content: counter(cOuNtEr-NaMe); }',
		},
		{
			code: 'a { content: counter(COUNTER-NAME); }',
		},
		{
			code: 'a { content: counters(counter-name); }',
		},
		{
			code: 'a { content: counters(cOuNtEr-NaMe); }',
		},
		{
			code: 'a { content: counters(COUNTER-NAME); }',
		},
		{
			code: "a { content: '[' counter(counter-name) ']' ; }",
		},
		{
			code: "a { content: '[' counter(cOuNtEr-NaMe) ']'; }",
		},
		{
			code: "a { content: '[' counter(COUNTER-NAME) ']'; }",
		},
		{
			code: 'a { font-size: $fsblock; }',
			description: 'ignore preprocessor variable includes value keyword',
		},
		{
			code: 'a { font-size: @fsblock; }',
			description: 'ignore preprocessor variable includes value keyword',
		},
		{
			code: 'a { font-size: var(--some-fs-block); }',
			description: 'ignore css variable includes value keyword',
		},
		{
			code: 'a { font-size: vAr(--some-fs-block); }',
			description: 'ignore css variable includes value keyword',
		},
		{
			code: 'a { font-size: VAR(--some-fs-block); }',
			description: 'ignore css variable includes value keyword',
		},
		{
			code: 'a { background-url: url(block); }',
			description: 'ignore url function',
		},
		{
			code: 'a { background-url: uRl(block); }',
			description: 'ignore url function',
		},
		{
			code: 'a { background-url: URL(block); }',
			description: 'ignore url function',
		},
		{
			code: 'a { displayblock: BLOCK; }',
			description: 'ignore property include value keyword',
		},
		{
			code: 'ablock { display: BLOCK; }',
			description: 'ignore type selector include value keyword',
		},
		{
			code: '#ablock { display: BLOCK; }',
			description: 'ignore class selector include value keyword',
		},
		{
			code: '.ablock { display: BLOCK; }',
			description: 'ignore class selector include value keyword',
		},
		{
			code: 'input[type=block] { display: BLOCK; }',
			description: 'ignore class selector include value keyword',
		},
		{
			code: 'a:hoverblock { display: BLOCK; }',
			description: 'ignore pseudo-class include value keyword',
		},
		{
			code: 'a::beforeblock { display: BLOCK; }',
			description: 'ignore pseudo-class include value keyword',
		},
		{
			code: 'a { display: SUPER-BLOCK; }',
			description: 'work with unknown value keyword',
		},
		{
			code: '@media (min-width: 768px) { color: RED; }',
		},
		{
			code: '@media screen { color: GREEN; @media (min-width: 768px) { color: RED; } }',
		},
		{
			code: 'a { color: RED; border: 5px SOLID CURRENTCOLOR; }',
		},
		{
			code: 'a { text-rendering: OPTIMIZESPEED; }',
		},
		{
			code: 'a { text-rendering: OPTIMIZELEGIBILITY; }',
		},
		{
			code: 'a { text-rendering: GEOMETRICPRECISION; }',
		},
		{
			code: 'a { animation: NONE; }',
		},
		{
			code: 'a { animation: 3s EASE-IN 1s 2 REVERSE BOTH PAUSED animation-name; }',
		},
		{
			code: 'a { animation: 3s EASE-IN 1s 2 REVERSE BOTH PAUSED aNiMaTiOn-NaMe; }',
		},
		{
			code: 'a { animation: 3s EASE-IN 1s 2 REVERSE BOTH PAUSED ANIMATION-NAME; }',
		},
		{
			code: 'a { animation-name: animation-name; }',
		},
		{
			code: 'a { animation-name: aNiMaTiOn-NaMe; }',
		},
		{
			code: 'a { animation-name: ANIMATION-NAME; }',
		},
		{
			code: 'a { font: ITALIC 2em font-family, SANS-SERIF; }',
		},
		{
			code: 'a { font: ITALIC 2em fOnT-FaMiLy, SANS-SERIF; }',
		},
		{
			code: 'a { font: ITALIC 2em FONT-FAMILY, SANS-SERIF; }',
		},
		{
			code: 'a { font-family: SERIF; }',
		},
		{
			code: 'a { font-family: Gill Sans Extrabold, SANS-SERIF; }',
		},
		{
			code: 'a { counter-increment: counter-name; }',
		},
		{
			code: 'a { counter-increment: cOuNtEr-NaMe; }',
		},
		{
			code: 'a { counter-increment: COUNTER-NAME; }',
		},
		{
			code: 'a { counter-reset: counter-name; }',
		},
		{
			code: 'a { counter-reset: cOuNtEr-NaMe; }',
		},
		{
			code: 'a { counter-reset: COUNTER-NAME; }',
		},
		{
			code: 'a { grid-row: AUTO / AUTO; }',
		},
		{
			code: 'a { grid-row: 5 somegridarea SPAN / 2 SPAN; }',
		},
		{
			code: 'a { grid-column: AUTO / AUTO; }',
		},
		{
			code: 'a { grid-column: 5 somegridarea SPAN / 2 SPAN; }',
		},
		{
			code: 'a { grid-area: AUTO / AUTO; }',
		},
		{
			code: 'a { grid-area: 5 somegridarea SPAN / 2 SPAN; }',
		},
		{
			code: 'a { grid-area: [linename1] 100px [linename2 linename3]; }',
		},
		{
			code: 'a { list-style: INHERIT; }',
		},
		{
			code: 'a { list-style: NONE; }',
		},
		{
			code: 'a { list-style: SQUARE; }',
		},
		{
			code: "a { list-style: LOWER-ROMAN url('../img/dino.png') OUTSIDE; }",
		},
		{
			code: 'a { list-style: custom-counter-style; }',
		},
		{
			code: 'a { list-style: cUsToM-cOuNtEr-StYle; }',
		},
		{
			code: 'a { list-style: CUSTOM-COUNTER-STYLE; }',
		},
		{
			code: 'ol { list-style-type: UPPER-ALPHA; }',
		},
		{
			code: 'ol { list-style-type: custom-counter-style; }',
		},
		{
			code: 'a { color: InactiveCaptionText; }',
			description: 'system color',
		},
		{
			code: 'a { color: ThreeDShadow; }',
			description: 'another system color',
		},
		{
			code: 'a { GRID-COLUMN-START: SPAN camelCaseArea; }',
			description: 'ignore property case',
		},
	],

	reject: [
		{
			code: 'a { display: Block; }',
			fixed: 'a { display: BLOCK; }',
			message: messages.expected('Block', 'BLOCK'),
			line: 1,
			column: 14,
		},
		{
			code: 'a { display: bLoCk; }',
			fixed: 'a { display: BLOCK; }',
			message: messages.expected('bLoCk', 'BLOCK'),
			line: 1,
			column: 14,
		},
		{
			code: 'a { display: block; }',
			fixed: 'a { display: BLOCK; }',
			message: messages.expected('block', 'BLOCK'),
			line: 1,
			column: 14,
		},
		{
			code: 'a:hover { display: Block; }',
			fixed: 'a:hover { display: BLOCK; }',
			message: messages.expected('Block', 'BLOCK'),
			line: 1,
			column: 20,
		},
		{
			code: 'a:other { display: Block; }',
			fixed: 'a:other { display: BLOCK; }',
			message: messages.expected('Block', 'BLOCK'),
			line: 1,
			column: 20,
		},
		{
			code: 'a::before { display: Block; }',
			fixed: 'a::before { display: BLOCK; }',
			message: messages.expected('Block', 'BLOCK'),
			line: 1,
			column: 22,
		},
		{
			code: 'a::other { display: Block; }',
			fixed: 'a::other { display: BLOCK; }',
			message: messages.expected('Block', 'BLOCK'),
			line: 1,
			column: 21,
		},
		{
			code: 'a { display: BLOCK !Import; }',
			fixed: 'a { display: BLOCK !IMPORT; }',
			message: messages.expected('!Import', '!IMPORT'),
			line: 1,
			column: 20,
		},
		{
			code: 'a { display: BLOCK !iMpOrT; }',
			fixed: 'a { display: BLOCK !IMPORT; }',
			message: messages.expected('!iMpOrT', '!IMPORT'),
			line: 1,
			column: 20,
		},
		{
			code: 'a { display: BLOCK !import; }',
			fixed: 'a { display: BLOCK !IMPORT; }',
			message: messages.expected('!import', '!IMPORT'),
			line: 1,
			column: 20,
		},
		{
			code: 'a { background-position: Top RIGHT, 1em 5vh; }',
			fixed: 'a { background-position: TOP RIGHT, 1em 5vh; }',
			message: messages.expected('Top', 'TOP'),
			line: 1,
			column: 26,
		},
		{
			code: 'a { background-position: TOP Right, 1em 5vh; }',
			fixed: 'a { background-position: TOP RIGHT, 1em 5vh; }',
			message: messages.expected('Right', 'RIGHT'),
			line: 1,
			column: 30,
		},
		{
			code: 'a { transition: -Webkit-transform 2s; }',
			fixed: 'a { transition: -WEBKIT-TRANSFORM 2s; }',
			message: messages.expected('-Webkit-transform', '-WEBKIT-TRANSFORM'),
			line: 1,
			column: 17,
		},
		{
			code: 'a { transition: -webkit-Transform 2s; }',
			fixed: 'a { transition: -WEBKIT-TRANSFORM 2s; }',
			message: messages.expected('-webkit-Transform', '-WEBKIT-TRANSFORM'),
			line: 1,
			column: 17,
		},
		{
			code: 'a { background-image: linear-gradient(To RIGHT, WHITE calc(100% - 50em), SILVER); }',
			fixed: 'a { background-image: linear-gradient(TO RIGHT, WHITE calc(100% - 50em), SILVER); }',
			message: messages.expected('To', 'TO'),
			line: 1,
			column: 39,
		},
		{
			code: 'a { background-image: linear-gradient(TO Right, WHITE calc(100% - 50em), SILVER); }',
			fixed: 'a { background-image: linear-gradient(TO RIGHT, WHITE calc(100% - 50em), SILVER); }',
			message: messages.expected('Right', 'RIGHT'),
			line: 1,
			column: 42,
		},
		{
			code: 'a { background-image: linear-gradient(TO RIGHT, WHITE calc(100% - 50em), Silver); }',
			fixed: 'a { background-image: linear-gradient(TO RIGHT, WHITE calc(100% - 50em), SILVER); }',
			message: messages.expected('Silver', 'SILVER'),
			line: 1,
			column: 74,
		},
		{
			code: 'a { display: Super-block; }',
			fixed: 'a { display: SUPER-BLOCK; }',
			description: 'work with unknown value keyword',
			message: messages.expected('Super-block', 'SUPER-BLOCK'),
			line: 1,
			column: 14,
		},
		{
			code: '@media (min-width: 768px) { color: Red; }',
			fixed: '@media (min-width: 768px) { color: RED; }',
			message: messages.expected('Red', 'RED'),
			line: 1,
			column: 36,
		},
		{
			code: '@media screen { color: GREEN; @media (min-width: 768px) { color: Red; } }',
			fixed: '@media screen { color: GREEN; @media (min-width: 768px) { color: RED; } }',
			message: messages.expected('Red', 'RED'),
			line: 1,
			column: 66,
		},
		{
			code: 'a { text-rendering: optimizeSpeed; }',
			fixed: 'a { text-rendering: OPTIMIZESPEED; }',
			message: messages.expected('optimizeSpeed', 'OPTIMIZESPEED'),
			line: 1,
			column: 21,
		},
		{
			code: 'a { animation: none; }',
			fixed: 'a { animation: NONE; }',
			message: messages.expected('none', 'NONE'),
			line: 1,
			column: 16,
		},
		{
			code: 'a { animation: 3s linear 1s animation-name; }',
			fixed: 'a { animation: 3s LINEAR 1s animation-name; }',
			message: messages.expected('linear', 'LINEAR'),
			line: 1,
			column: 19,
		},
		{
			code: 'a { animation: 3s linear 1s aNiMaTiOn-NaMe; }',
			fixed: 'a { animation: 3s LINEAR 1s aNiMaTiOn-NaMe; }',
			message: messages.expected('linear', 'LINEAR'),
			line: 1,
			column: 19,
		},
		{
			code: 'a { animation: 3s linear 1s ANIMATION-NAME; }',
			fixed: 'a { animation: 3s LINEAR 1s ANIMATION-NAME; }',
			message: messages.expected('linear', 'LINEAR'),
			line: 1,
			column: 19,
		},
		{
			code: 'a { animation-name: inherit; }',
			fixed: 'a { animation-name: INHERIT; }',
			message: messages.expected('inherit', 'INHERIT'),
			line: 1,
			column: 21,
		},
		{
			code: 'a { font: italic 2em font-family, SANS-SERIF; }',
			fixed: 'a { font: ITALIC 2em font-family, SANS-SERIF; }',
			message: messages.expected('italic', 'ITALIC'),
			line: 1,
			column: 11,
		},
		{
			code: 'a { font: italic 2em fOnT-fAmIlY, SANS-SERIF; }',
			fixed: 'a { font: ITALIC 2em fOnT-fAmIlY, SANS-SERIF; }',
			message: messages.expected('italic', 'ITALIC'),
			line: 1,
			column: 11,
		},
		{
			code: 'a { font: italic 2em FONT-FAMILY, SANS-SERIF; }',
			fixed: 'a { font: ITALIC 2em FONT-FAMILY, SANS-SERIF; }',
			message: messages.expected('italic', 'ITALIC'),
			line: 1,
			column: 11,
		},
		{
			code: 'a { font: ITALIC 2em font-family, sans-serif; }',
			fixed: 'a { font: ITALIC 2em font-family, SANS-SERIF; }',
			message: messages.expected('sans-serif', 'SANS-SERIF'),
			line: 1,
			column: 35,
		},
		{
			code: 'a { font-family: monospace; }',
			fixed: 'a { font-family: MONOSPACE; }',
			message: messages.expected('monospace', 'MONOSPACE'),
			line: 1,
			column: 18,
		},
		{
			code: 'a { counter-increment: inherit; }',
			fixed: 'a { counter-increment: INHERIT; }',
			message: messages.expected('inherit', 'INHERIT'),
			line: 1,
			column: 24,
		},
		{
			code: 'a { counter-reset: inherit; }',
			fixed: 'a { counter-reset: INHERIT; }',
			message: messages.expected('inherit', 'INHERIT'),
			line: 1,
			column: 20,
		},
		{
			code: 'a { grid-row: auto / AUTO; }',
			fixed: 'a { grid-row: AUTO / AUTO; }',
			message: messages.expected('auto', 'AUTO'),
			line: 1,
			column: 15,
		},
		{
			code: 'a { grid-row: span somegridarea; }',
			fixed: 'a { grid-row: SPAN somegridarea; }',
			message: messages.expected('span', 'SPAN'),
			line: 1,
			column: 15,
		},
		{
			code: 'a { grid-column: auto / AUTO; }',
			fixed: 'a { grid-column: AUTO / AUTO; }',
			message: messages.expected('auto', 'AUTO'),
			line: 1,
			column: 18,
		},
		{
			code: 'a { grid-column: span somegridarea; }',
			fixed: 'a { grid-column: SPAN somegridarea; }',
			message: messages.expected('span', 'SPAN'),
			line: 1,
			column: 18,
		},
		{
			code: 'a { grid-area: auto / AUTO; }',
			fixed: 'a { grid-area: AUTO / AUTO; }',
			message: messages.expected('auto', 'AUTO'),
			line: 1,
			column: 16,
		},
		{
			code: 'a { grid-area: span somegridarea; }',
			fixed: 'a { grid-area: SPAN somegridarea; }',
			message: messages.expected('span', 'SPAN'),
			line: 1,
			column: 16,
		},
		{
			code: 'a { list-style: inherit; }',
			fixed: 'a { list-style: INHERIT; }',
			message: messages.expected('inherit', 'INHERIT'),
			line: 1,
			column: 17,
		},
		{
			code: 'a { list-style: none; }',
			fixed: 'a { list-style: NONE; }',
			message: messages.expected('none', 'NONE'),
			line: 1,
			column: 17,
		},
		{
			code: 'a { list-style: square; }',
			fixed: 'a { list-style: SQUARE; }',
			message: messages.expected('square', 'SQUARE'),
			line: 1,
			column: 17,
		},
		{
			code: "a { list-style: custom-counter-style url('../img/dino.png') outside; }",
			fixed: "a { list-style: custom-counter-style url('../img/dino.png') OUTSIDE; }",
			message: messages.expected('outside', 'OUTSIDE'),
			line: 1,
			column: 61,
		},
		{
			code: "a { list-style: cUsToM-cOuNtEr-StYlE url('../img/dino.png') outside; }",
			fixed: "a { list-style: cUsToM-cOuNtEr-StYlE url('../img/dino.png') OUTSIDE; }",
			message: messages.expected('outside', 'OUTSIDE'),
			line: 1,
			column: 61,
		},
		{
			code: "a { list-style: CUSTOM-COUNTER-STYLE url('../img/dino.png') outside; }",
			fixed: "a { list-style: CUSTOM-COUNTER-STYLE url('../img/dino.png') OUTSIDE; }",
			message: messages.expected('outside', 'OUTSIDE'),
			line: 1,
			column: 61,
		},
		{
			code: "a { list-style: lower-roman url('../img/dino.png') OUTSIDE; }",
			fixed: "a { list-style: LOWER-ROMAN url('../img/dino.png') OUTSIDE; }",
			message: messages.expected('lower-roman', 'LOWER-ROMAN'),
			line: 1,
			column: 17,
		},
		{
			code: "a { list-style: LOWER-ROMAN url('../img/dino.png') outside; }",
			fixed: "a { list-style: LOWER-ROMAN url('../img/dino.png') OUTSIDE; }",
			message: messages.expected('outside', 'OUTSIDE'),
			line: 1,
			column: 52,
		},
		{
			code: 'ol { list-style-type: upper-alpha; }',
			fixed: 'ol { list-style-type: UPPER-ALPHA; }',
			message: messages.expected('upper-alpha', 'UPPER-ALPHA'),
			line: 1,
			column: 23,
		},
	],
});

testRule({
	ruleName,
	syntax: 'scss',
	config: ['upper'],
	fix: true,

	accept: [
		{
			code: 'a { width: 1em; \n// display: block\n }',
			description: 'ignore unit within comments',
		},
		{
			code: 'a { $display: BLOCK; }',
		},
		{
			code: 'a { margin: 10PX + 10px; }',
		},
		{
			code: 'a { margin: $margin; }',
		},
		{
			code: 'a { margin: $mArGiN; }',
		},
		{
			code: 'a { margin: $MARGIN; }',
		},
		{
			code: 'a { margin: $margin + 10px; }',
		},
		{
			code: 'a { margin: $mArGiN + 10px; }',
		},
		{
			code: 'a { margin: $MARGIN + 10px; }',
		},
		{
			code: 'a { margin: $marginValue; }',
		},
		{
			code: 'a { margin: -$marginValue; }',
		},
		{
			code: 'a { margin: 10+$marginValue; }',
		},
		{
			code: 'a { margin: 10 - $marginValue; }',
		},
		{
			code: 'a { margin: 10 -$marginValue; }',
		},
		{
			code: 'a { margin: 10 *$marginValue; }',
		},
		{
			code: 'a { margin: 10 /$marginValue; }',
		},
		{
			code: 'a { color: some-function(10px); }',
		},
		{
			code: 'a { color: Some-function(10px); }',
		},
		{
			code: 'a { color: some-Function(10px); }',
		},
		{
			code: 'p { font: #{$Font-size}/#{$line-height}; }',
		},
		{
			code: 'p { font: #{$font-Size}/#{$line-height}; }',
		},
		{
			code: 'p { font: #{$font-size}/#{$Line-height}; }',
		},
		{
			code: 'p { font: #{$font-size}/#{$line-Height}; }',
		},
		{
			code: 'a { background-color: spin(lighten($Base, 25%), 8); }',
		},
		{
			code: 'a { background-color: spin(Lighten($base, 25%), 8); }',
		},
		{
			code: 'a { background-color: Spin(lighten($base, 25%), 8); }',
		},
		{
			code: '.content { .link { display: BLOCK; } }',
		},
		{
			code: '.a { &-link { display: BLOCK } }',
		},
		{
			code: '$map: (DISPLAY-FIRST: BLOCK, DISPLAY-SECOND: INLINE);',
		},
		{
			code: 'a { background-#{$variable}: property#{$variable}; }',
		},
		{
			code: 'a { background-#{$variable}: PROPERTY#{$variable}; }',
		},
	],

	reject: [
		{
			code: 'a { $display: Block; }',
			fixed: 'a { $display: BLOCK; }',
			message: messages.expected('Block', 'BLOCK'),
			line: 1,
			column: 15,
		},
		{
			code: 'a { $display: bLoCk; }',
			fixed: 'a { $display: BLOCK; }',
			message: messages.expected('bLoCk', 'BLOCK'),
			line: 1,
			column: 15,
		},
		{
			code: 'a { $display: block; }',
			fixed: 'a { $display: BLOCK; }',
			message: messages.expected('block', 'BLOCK'),
			line: 1,
			column: 15,
		},
		{
			code: 'a { font: (ITALIC Bold 10px/8PX) }',
			fixed: 'a { font: (ITALIC BOLD 10px/8PX) }',
			message: messages.expected('Bold', 'BOLD'),
			line: 1,
			column: 19,
		},
		{
			code: '.content { .link { display: Block; } }',
			fixed: '.content { .link { display: BLOCK; } }',
			message: messages.expected('Block', 'BLOCK'),
			line: 1,
			column: 29,
		},
		{
			code: '.a { &-link { display: Block } }',
			fixed: '.a { &-link { display: BLOCK } }',
			message: messages.expected('Block', 'BLOCK'),
			line: 1,
			column: 24,
		},
		{
			code: '$map: (display-first: BLOCK, DISPLAY-SECOND: INLINE);',
			fixed: '$map: (DISPLAY-FIRST: BLOCK, DISPLAY-SECOND: INLINE);',
			message: messages.expected('display-first', 'DISPLAY-FIRST'),
			line: 1,
			column: 8,
		},
		{
			code: '$map: (DISPLAY-FIRST: Block, DISPLAY-SECOND: INLINE);',
			fixed: '$map: (DISPLAY-FIRST: BLOCK, DISPLAY-SECOND: INLINE);',
			message: messages.expected('Block', 'BLOCK'),
			line: 1,
			column: 23,
		},
		{
			code: '$map: (DISPLAY-FIRST: BLOCK, DISPLAY-SECOND: Inline);',
			fixed: '$map: (DISPLAY-FIRST: BLOCK, DISPLAY-SECOND: INLINE);',
			message: messages.expected('Inline', 'INLINE'),
			line: 1,
			column: 46,
		},
	],
});

testRule({
	ruleName,
	syntax: 'less',
	config: ['upper'],
	fix: true,

	accept: [
		{
			code: 'a { width: 1em; \n// display: block\n }',
			description: 'ignore unit within comments',
		},
		{
			code: 'a { @display: BLOCK; }',
		},
		{
			code: 'a { margin: 10PX + 10px; }',
		},
		{
			code: 'a { margin: @margin; }',
		},
		{
			code: 'a { margin: @mArGiN; }',
		},
		{
			code: 'a { margin: @MARGIN; }',
		},
		{
			code: 'a { margin: @margin + 10px; }',
		},
		{
			code: 'a { margin: @mArGiN + 10px; }',
		},
		{
			code: 'a { margin: @MARGIN + 10px; }',
		},
		{
			code: 'a { margin: @marginValue; }',
		},
		{
			code: 'a { margin: -@marginValue; }',
		},
		{
			code: 'a { margin: 10+@marginValue; }',
		},
		{
			code: 'a { margin: 10 - @marginValue; }',
		},
		{
			code: 'a { margin: 10 -@marginValue; }',
		},
		{
			code: 'a { margin: 10 *@marginValue; }',
		},
		{
			code: 'a { margin: 10 /@marginValue; }',
		},
		{
			code: '.bordered { border-bottom: SOLID 2px BLOCK; }',
			description: 'inside mixin',
		},
		{
			code: '#header { .navigation { display: BLOCK; } }',
			description: 'nested',
		},
		{
			code: 'a { color: some-function(10px); }',
		},
		{
			code: 'a { color: Some-function(10px); }',
		},
		{
			code: 'a { color: some-Function(10px); }',
		},
		{
			code: 'a { background-color: spin(lighten(@Base, 25%), 8); }',
		},
		{
			code: 'a { background-color: spin(lighten(@Base, 25%), 8); }',
		},
		{
			code: 'a { background-color: Spin(Lighten(@Base, 25%), 8); }',
		},
		{
			code: '@detached-ruleset: { background: RED; };',
		},
		{
			code: '.a { &-link { background: RED; } };',
		},
	],

	reject: [
		{
			code: '.bordered { border-bottom: Solid 2px BLACK; }',
			fixed: '.bordered { border-bottom: SOLID 2px BLACK; }',
			description: 'inside mixin',
			message: messages.expected('Solid', 'SOLID'),
			line: 1,
			column: 28,
		},
		{
			code: '.bordered { border-bottom: SOLID 2px Black; }',
			fixed: '.bordered { border-bottom: SOLID 2px BLACK; }',
			description: 'inside mixin',
			message: messages.expected('Black', 'BLACK'),
			line: 1,
			column: 38,
		},
		{
			code: '#header { .navigation { display: Block; } }',
			fixed: '#header { .navigation { display: BLOCK; } }',
			description: 'nested',
			message: messages.expected('Block', 'BLOCK'),
			line: 1,
			column: 34,
		},
		{
			code: '@detached-ruleset: { background: Red; };',
			fixed: '@detached-ruleset: { background: RED; };',
			message: messages.expected('Red', 'RED'),
			line: 1,
			column: 34,
		},
		{
			code: '.a { &-link { background: Red; } };',
			fixed: '.a { &-link { background: RED; } };',
			message: messages.expected('Red', 'RED'),
			line: 1,
			column: 27,
		},
	],
});

testRule({
	ruleName,
	config: ['lower', { ignoreKeywords: ['Block', '/^(f|F)lex$/'] }],
	fix: true,

	accept: [
		{
			code: 'a { display: block; }',
			description: "Accepted because primary option is 'lower'",
		},
		{
			code: 'a { display: Block; }',
			description: 'Accepted because exact case-sensitive string is ignored',
		},
		{
			code: 'a { display: flex; }',
		},
		{
			code: 'a { display: Flex; }',
		},
	],

	reject: [
		{
			code: 'a { display: bLoCk; }',
			fixed: 'a { display: block; }',
			message: messages.expected('bLoCk', 'block'),
			line: 1,
			column: 14,
			description: "Rejected because doesn't match exact case-sensitive string that is ignored",
		},
		{
			code: 'a { display: BLOCK; }',
			fixed: 'a { display: block; }',
			message: messages.expected('BLOCK', 'block'),
			line: 1,
			column: 14,
			description: "Rejected because doesn't match exact case-sensitive string that is ignored",
		},
		{
			code: 'a { display: Inline; }',
			fixed: 'a { display: inline; }',
			message: messages.expected('Inline', 'inline'),
			line: 1,
			column: 14,
		},
		{
			code: 'a { display: iNlInE; }',
			fixed: 'a { display: inline; }',
			message: messages.expected('iNlInE', 'inline'),
			line: 1,
			column: 14,
		},
		{
			code: 'a { display: INLINE; }',
			fixed: 'a { display: inline; }',
			message: messages.expected('INLINE', 'inline'),
			line: 1,
			column: 14,
		},
		{
			code: 'a { display: fLeX; }',
			fixed: 'a { display: flex; }',
			message: messages.expected('fLeX', 'flex'),
			line: 1,
			column: 14,
		},
		{
			code: 'a { display: FLEX; }',
			fixed: 'a { display: flex; }',
			message: messages.expected('FLEX', 'flex'),
			line: 1,
			column: 14,
		},
	],
});

testRule({
	ruleName,
	config: ['upper', { ignoreKeywords: ['Block', 'bLoCk', 'block', '/^(f|F)lex$/'] }],
	fix: true,

	accept: [
		{
			code: 'a { display: block; }',
		},
		{
			code: 'a { display: Block; }',
		},
		{
			code: 'a { display: bLoCk; }',
		},
		{
			code: 'a { display: BLOCK; }',
		},
		{
			code: 'a { display: FLEX; }',
		},
		{
			code: 'a { display: Flex; }',
		},
		{
			code: 'a { display: flex; }',
		},
	],

	reject: [
		{
			code: 'a { display: Inline; }',
			fixed: 'a { display: INLINE; }',
			message: messages.expected('Inline', 'INLINE'),
			line: 1,
			column: 14,
		},
		{
			code: 'a { display: iNlInE; }',
			fixed: 'a { display: INLINE; }',
			message: messages.expected('iNlInE', 'INLINE'),
			line: 1,
			column: 14,
		},
		{
			code: 'a { display: inline; }',
			fixed: 'a { display: INLINE; }',
			message: messages.expected('inline', 'INLINE'),
			line: 1,
			column: 14,
		},
		{
			code: 'a { display: fLeX; }',
			fixed: 'a { display: FLEX; }',
			message: messages.expected('fLeX', 'FLEX'),
			line: 1,
			column: 14,
		},
		{
			code: 'a { display: fLEX; }',
			fixed: 'a { display: FLEX; }',
			message: messages.expected('fLEX', 'FLEX'),
			line: 1,
			column: 14,
		},
	],
});

testRule({
	ruleName,
	config: ['upper', { ignoreKeywords: [/^(f|F)lex$/] }],
	fix: true,

	accept: [
		{
			code: 'a { display: FLEX; }',
		},
		{
			code: 'a { display: Flex; }',
		},
		{
			code: 'a { display: flex; }',
		},
	],

	reject: [
		{
			code: 'a { display: inline; }',
			fixed: 'a { display: INLINE; }',
			message: messages.expected('inline', 'INLINE'),
			line: 1,
			column: 14,
		},
	],
});

testRule({
	ruleName,
	config: ['lower', { ignoreProperties: ['display', '/^(b|B)ackground$/'] }],
	fix: true,

	accept: [
		{
			code: 'a { display: bloCk; }',
		},
		{
			code: 'a { display: BloCk; }',
		},
		{
			code: 'a { display: BLOCK; }',
		},
		{
			code: 'a { display: block; }',
		},
		{
			code: 'a { background: Red; }',
		},
		{
			code: 'a { Background: deepPink; }',
		},
	],

	reject: [
		{
			code: 'a { text-align: LEFT; }',
			fixed: 'a { text-align: left; }',
			message: messages.expected('LEFT', 'left'),
			description: "Rejected because property doesn't match any property in ignoreProperties list",
		},
		{
			code: 'a { text-align: Left; }',
			fixed: 'a { text-align: left; }',
			message: messages.expected('Left', 'left'),
			description: "Rejected because property doesn't match any property in ignoreProperties list",
		},
	],
});

testRule({
	ruleName,
	syntax: 'scss',
	config: ['lower', { ignoreProperties: ['$fontFamily'] }],
	fix: true,

	accept: [
		{
			code: '$fontFamily: Menlo;',
			description: 'property (Sass variable) matches an ignored property',
		},
	],

	reject: [
		{
			code: '$color: Red;',
			fixed: '$color: red;',
			message: messages.expected('Red', 'red'),
			description: "Rejected because property doesn't match any property in ignoreProperties list",
		},
	],
});

testRule({
	ruleName,
	config: ['lower', { ignoreProperties: [/^(b|B)ackground$/] }],
	fix: true,

	accept: [
		{
			code: 'a { background: Red; }',
		},
		{
			code: 'a { Background: deepPink; }',
		},
	],

	reject: [
		{
			code: 'a { text-align: LEFT; }',
			fixed: 'a { text-align: left; }',
			message: messages.expected('LEFT', 'left'),
			description: "Rejected because property doesn't match any property in ignoreProperties list",
		},
	],
});

testRule({
	ruleName,
	config: ['lower', { ignoreProperties: ['BACKGROUND'] }],
	fix: true,

	accept: [
		{
			code: 'a { BACKGROUND: Red; }',
		},
		{
			code: 'a { BACKGROUND: deepPink; }',
		},
	],

	reject: [
		{
			code: 'a { text-align: LEFT; }',
			fixed: 'a { text-align: left; }',
			message: messages.expected('LEFT', 'left'),
			description: "Rejected because property doesn't match any property in ignoreProperties list",
		},
	],
});

testRule({
	ruleName,
	config: ['upper', { ignoreProperties: ['display', '/^(b|B)ackground$/'] }],
	fix: true,

	accept: [
		{
			code: 'a { display: bloCk; }',
		},
		{
			code: 'a { display: BloCk; }',
		},
		{
			code: 'a { display: BLOCK; }',
		},
		{
			code: 'a { display: block; }',
		},
		{
			code: 'a { background: Red; }',
		},
		{
			code: 'a { Background: deepPink; }',
		},
	],

	reject: [
		{
			code: 'a { text-align: left; }',
			fixed: 'a { text-align: LEFT; }',
			message: messages.expected('left', 'LEFT'),
			description: "Rejected because property doesn't match any property in ignoreProperties list",
		},
		{
			code: 'a { text-align: LeFt; }',
			fixed: 'a { text-align: LEFT; }',
			message: messages.expected('LeFt', 'LEFT'),
			description: "Rejected because property doesn't match any property in ignoreProperties list",
		},
		{
			code: 'a { text-align: Left; }',
			fixed: 'a { text-align: LEFT; }',
			message: messages.expected('Left', 'LEFT'),
			description: "Rejected because property doesn't match any property in ignoreProperties list",
		},
	],
});

testRule({
	ruleName,
	config: ['upper', { ignoreFunctions: ['t', /^(f|F)oo$/] }],
	fix: true,

	accept: [
		{
			code: 'a { display: t(flex); }',
		},
		{
			code: 'a { display: t(fLeX); }',
		},
		{
			code: 'a { color: t(--camelCase); }',
		},
		{
			code: 'a { color: foo(--camelCase); }',
		},
		{
			code: 'a { color: Foo(--camelCase); }',
		},
	],

	reject: [
		{
			code: 'a { display: b(inline); }',
			fixed: 'a { display: b(INLINE); }',
			message: messages.expected('inline', 'INLINE'),
			line: 1,
			column: 16,
		},
		{
			code: 'a { display: bar(--camelCase); }',
			fixed: 'a { display: bar(--CAMELCASE); }',
			message: messages.expected('--camelCase', '--CAMELCASE'),
			line: 1,
			column: 18,
		},
	],
});
