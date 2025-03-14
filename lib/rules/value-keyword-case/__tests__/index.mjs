import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: ['lower'],
	fix: true,
	computeEditInfo: true,

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
			code: 'a { color: red; border: 5px solid currentcolor; }',
		},
		{
			code: 'a { text-rendering: optimizespeed; }',
		},
		{
			code: 'a { text-rendering: optimizelegibility; }',
		},
		{
			code: 'a { text-rendering: geometricprecision; }',
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
			code: 'a { color: CanvasText; }',
			description: 'newer system color',
		},
		{
			code: 'a { color: -moz-NativeHyperlinkText; }',
			description: 'prefixed system color',
			fix: {
				range: [16, 67],
				text: 'any',
			},
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
			fix: {
				range: [13, 14],
				text: 'b',
			},
			message: messages.expected('Block', 'block'),
			line: 1,
			column: 14,
		},
		{
			code: 'a { display: Block /* comment */; }',
			fixed: 'a { display: block /* comment */; }',
			fix: {
				range: [13, 14],
				text: 'b',
			},
			message: messages.expected('Block', 'block'),
			line: 1,
			column: 14,
		},
		{
			code: 'a { display: bLoCk; }',
			fixed: 'a { display: block; }',
			fix: {
				range: [14, 17],
				text: 'loc',
			},
			message: messages.expected('bLoCk', 'block'),
			line: 1,
			column: 14,
		},
		{
			code: 'a { display: BLOCK; }',
			fixed: 'a { display: block; }',
			fix: {
				range: [13, 18],
				text: 'block',
			},
			message: messages.expected('BLOCK', 'block'),
			line: 1,
			column: 14,
		},
		{
			code: 'a:hover { display: Block; }',
			fixed: 'a:hover { display: block; }',
			fix: {
				range: [19, 20],
				text: 'b',
			},
			message: messages.expected('Block', 'block'),
			line: 1,
			column: 20,
		},
		{
			code: 'a:other { display: Block; }',
			fixed: 'a:other { display: block; }',
			fix: {
				range: [19, 20],
				text: 'b',
			},
			message: messages.expected('Block', 'block'),
			line: 1,
			column: 20,
		},
		{
			code: 'a::before { display: Block; }',
			fixed: 'a::before { display: block; }',
			fix: {
				range: [21, 22],
				text: 'b',
			},
			message: messages.expected('Block', 'block'),
			line: 1,
			column: 22,
		},
		{
			code: 'a::other { display: Block; }',
			fixed: 'a::other { display: block; }',
			fix: {
				range: [20, 21],
				text: 'b',
			},
			message: messages.expected('Block', 'block'),
			line: 1,
			column: 21,
		},
		{
			code: 'a { display: block !Import; }',
			fixed: 'a { display: block !import; }',
			fix: {
				range: [20, 21],
				text: 'i',
			},
			message: messages.expected('!Import', '!import'),
			line: 1,
			column: 20,
		},
		{
			code: 'a { display: block !iMpOrT; }',
			fixed: 'a { display: block !import; }',
			fix: {
				range: [21, 26],
				text: 'mport',
			},
			message: messages.expected('!iMpOrT', '!import'),
			line: 1,
			column: 20,
		},
		{
			code: 'a { display: block !IMPORT; }',
			fixed: 'a { display: block !import; }',
			fix: {
				range: [20, 26],
				text: 'import',
			},
			message: messages.expected('!IMPORT', '!import'),
			line: 1,
			column: 20,
		},
		{
			code: 'a { background-position: Top right, 1em 5vh; }',
			fixed: 'a { background-position: top right, 1em 5vh; }',
			fix: {
				range: [25, 26],
				text: 't',
			},
			message: messages.expected('Top', 'top'),
			line: 1,
			column: 26,
		},
		{
			code: 'a { background-position: top Right, 1em 5vh; }',
			fixed: 'a { background-position: top right, 1em 5vh; }',
			fix: {
				range: [29, 30],
				text: 'r',
			},
			message: messages.expected('Right', 'right'),
			line: 1,
			column: 30,
		},
		{
			code: 'a { transition: -Webkit-transform 2s; }',
			fixed: 'a { transition: -webkit-transform 2s; }',
			fix: {
				range: [17, 18],
				text: 'w',
			},
			message: messages.expected('-Webkit-transform', '-webkit-transform'),
			line: 1,
			column: 17,
		},
		{
			code: 'a { transition: -webkit-Transform 2s; }',
			fixed: 'a { transition: -webkit-transform 2s; }',
			fix: {
				range: [24, 25],
				text: 't',
			},
			message: messages.expected('-webkit-Transform', '-webkit-transform'),
			line: 1,
			column: 17,
		},
		{
			code: 'a { background-image: linear-gradient(To right, white calc(100% - 50em), silver); }',
			fixed: 'a { background-image: linear-gradient(to right, white calc(100% - 50em), silver); }',
			fix: {
				range: [38, 39],
				text: 't',
			},
			message: messages.expected('To', 'to'),
			line: 1,
			column: 39,
		},
		{
			code: 'a { background-image: linear-gradient(to Right, white calc(100% - 50em), silver); }',
			fixed: 'a { background-image: linear-gradient(to right, white calc(100% - 50em), silver); }',
			fix: {
				range: [41, 42],
				text: 'r',
			},
			message: messages.expected('Right', 'right'),
			line: 1,
			column: 42,
		},
		{
			code: 'a { background-image: linear-gradient(to right, white calc(100% - 50em), Silver); }',
			fixed: 'a { background-image: linear-gradient(to right, white calc(100% - 50em), silver); }',
			fix: {
				range: [73, 74],
				text: 's',
			},
			message: messages.expected('Silver', 'silver'),
			line: 1,
			column: 74,
		},
		{
			code: 'a { display: Super-block; }',
			fixed: 'a { display: super-block; }',
			fix: {
				range: [13, 14],
				text: 's',
			},
			description: 'work with unknown value keyword',
			message: messages.expected('Super-block', 'super-block'),
			line: 1,
			column: 14,
		},
		{
			code: '@media (min-width: 768px) { color: Red; }',
			fixed: '@media (min-width: 768px) { color: red; }',
			fix: {
				range: [35, 36],
				text: 'r',
			},
			message: messages.expected('Red', 'red'),
			line: 1,
			column: 36,
		},
		{
			code: '@media screen { color: green; @media (min-width: 768px) { color: Red; } }',
			fixed: '@media screen { color: green; @media (min-width: 768px) { color: red; } }',
			fix: {
				range: [65, 66],
				text: 'r',
			},
			message: messages.expected('Red', 'red'),
			line: 1,
			column: 66,
		},
		{
			code: 'a { text-rendering: OptimizeSpeed; }',
			fixed: 'a { text-rendering: optimizespeed; }',
			fix: {
				range: [20, 29],
				text: 'optimizes',
			},
			message: messages.expected('OptimizeSpeed', 'optimizespeed'),
			line: 1,
			column: 21,
		},
		{
			code: 'a { animation: INHERIT; }',
			fixed: 'a { animation: inherit; }',
			fix: {
				range: [15, 22],
				text: 'inherit',
			},
			message: messages.expected('INHERIT', 'inherit'),
			line: 1,
			column: 16,
		},
		{
			code: 'a { animation: NONE; }',
			fixed: 'a { animation: none; }',
			fix: {
				range: [15, 19],
				text: 'none',
			},
			message: messages.expected('NONE', 'none'),
			line: 1,
			column: 16,
		},
		{
			code: 'a { animation: 3s LINEAR 1s animation-name; }',
			fixed: 'a { animation: 3s linear 1s animation-name; }',
			fix: {
				range: [18, 24],
				text: 'linear',
			},
			message: messages.expected('LINEAR', 'linear'),
			line: 1,
			column: 19,
		},
		{
			code: 'a { animation: 3s LINEAR 1s aNiMaTiOn-NaMe; }',
			fixed: 'a { animation: 3s linear 1s aNiMaTiOn-NaMe; }',
			fix: {
				range: [18, 24],
				text: 'linear',
			},
			message: messages.expected('LINEAR', 'linear'),
			line: 1,
			column: 19,
		},
		{
			code: 'a { animation: 3s LINEAR 1s ANIMATION-NAME; }',
			fixed: 'a { animation: 3s linear 1s ANIMATION-NAME; }',
			fix: {
				range: [18, 24],
				text: 'linear',
			},
			message: messages.expected('LINEAR', 'linear'),
			line: 1,
			column: 19,
		},
		{
			code: 'a { animation-name: INHERIT; }',
			fixed: 'a { animation-name: inherit; }',
			fix: {
				range: [20, 27],
				text: 'inherit',
			},
			message: messages.expected('INHERIT', 'inherit'),
			line: 1,
			column: 21,
		},
		{
			code: 'a { font: ITALIC 2em font-family, sans-serif; }',
			fixed: 'a { font: italic 2em font-family, sans-serif; }',
			fix: {
				range: [10, 16],
				text: 'italic',
			},
			message: messages.expected('ITALIC', 'italic'),
			line: 1,
			column: 11,
		},
		{
			code: 'a { font: ITALIC 2em fOnT-FaMiLy, sans-serif; }',
			fixed: 'a { font: italic 2em fOnT-FaMiLy, sans-serif; }',
			fix: {
				range: [10, 16],
				text: 'italic',
			},
			message: messages.expected('ITALIC', 'italic'),
			line: 1,
			column: 11,
		},
		{
			code: 'a { font: ITALIC 2em FONT-FAMILY, sans-serif; }',
			fixed: 'a { font: italic 2em FONT-FAMILY, sans-serif; }',
			fix: {
				range: [10, 16],
				text: 'italic',
			},
			message: messages.expected('ITALIC', 'italic'),
			line: 1,
			column: 11,
		},
		{
			code: 'a { font: italic 2em FONT-FAMILY, SANS-SERIF; }',
			fixed: 'a { font: italic 2em FONT-FAMILY, sans-serif; }',
			fix: {
				range: [34, 44],
				text: 'sans-serif',
			},
			message: messages.expected('SANS-SERIF', 'sans-serif'),
			line: 1,
			column: 35,
		},
		{
			code: 'a { font-family: MONOSPACE; }',
			fixed: 'a { font-family: monospace; }',
			fix: {
				range: [17, 26],
				text: 'monospace',
			},
			message: messages.expected('MONOSPACE', 'monospace'),
			line: 1,
			column: 18,
		},
		{
			code: 'a { counter-increment: INHERIT; }',
			fixed: 'a { counter-increment: inherit; }',
			fix: {
				range: [23, 30],
				text: 'inherit',
			},
			message: messages.expected('INHERIT', 'inherit'),
			line: 1,
			column: 24,
		},
		{
			code: 'a { counter-reset: INHERIT; }',
			fixed: 'a { counter-reset: inherit; }',
			fix: {
				range: [19, 26],
				text: 'inherit',
			},
			message: messages.expected('INHERIT', 'inherit'),
			line: 1,
			column: 20,
		},
		{
			code: 'a { grid-row: AUTO / auto; }',
			fixed: 'a { grid-row: auto / auto; }',
			fix: {
				range: [14, 18],
				text: 'auto',
			},
			message: messages.expected('AUTO', 'auto'),
			line: 1,
			column: 15,
		},
		{
			code: 'a { grid-row: SPAN SOMEGRIDAREA;; }',
			fixed: 'a { grid-row: span SOMEGRIDAREA;; }',
			fix: {
				range: [14, 18],
				text: 'span',
			},
			message: messages.expected('SPAN', 'span'),
			line: 1,
			column: 15,
		},
		{
			code: 'a { grid-column: AUTO / auto; }',
			fixed: 'a { grid-column: auto / auto; }',
			fix: {
				range: [17, 21],
				text: 'auto',
			},
			message: messages.expected('AUTO', 'auto'),
			line: 1,
			column: 18,
		},
		{
			code: 'a { grid-column: SPAN SOMEGRIDAREA;; }',
			fixed: 'a { grid-column: span SOMEGRIDAREA;; }',
			fix: {
				range: [17, 21],
				text: 'span',
			},
			message: messages.expected('SPAN', 'span'),
			line: 1,
			column: 18,
		},
		{
			code: 'a { grid-area: AUTO / auto; }',
			fixed: 'a { grid-area: auto / auto; }',
			fix: {
				range: [15, 19],
				text: 'auto',
			},
			message: messages.expected('AUTO', 'auto'),
			line: 1,
			column: 16,
		},
		{
			code: 'a { grid-area: SPAN SOMEGRIDAREA;; }',
			fixed: 'a { grid-area: span SOMEGRIDAREA;; }',
			fix: {
				range: [15, 19],
				text: 'span',
			},
			message: messages.expected('SPAN', 'span'),
			line: 1,
			column: 16,
		},
		{
			code: 'a { list-style: INHERIT; }',
			fixed: 'a { list-style: inherit; }',
			fix: {
				range: [16, 23],
				text: 'inherit',
			},
			message: messages.expected('INHERIT', 'inherit'),
			line: 1,
			column: 17,
		},
		{
			code: 'a { list-style: NONE; }',
			fixed: 'a { list-style: none; }',
			fix: {
				range: [16, 20],
				text: 'none',
			},
			message: messages.expected('NONE', 'none'),
			line: 1,
			column: 17,
		},
		{
			code: 'a { list-style: SQUARE; }',
			fixed: 'a { list-style: square; }',
			fix: {
				range: [16, 22],
				text: 'square',
			},
			message: messages.expected('SQUARE', 'square'),
			line: 1,
			column: 17,
		},
		{
			code: "a { list-style: custom-counter-style url('../img/dino.png') OUTSIDE; }",
			fixed: "a { list-style: custom-counter-style url('../img/dino.png') outside; }",
			fix: {
				range: [60, 67],
				text: 'outside',
			},
			message: messages.expected('OUTSIDE', 'outside'),
			line: 1,
			column: 61,
		},
		{
			code: "a { list-style: cUsToM-cOuNtEr-StYlE url('../img/dino.png') OUTSIDE; }",
			fixed: "a { list-style: cUsToM-cOuNtEr-StYlE url('../img/dino.png') outside; }",
			fix: {
				range: [60, 67],
				text: 'outside',
			},
			message: messages.expected('OUTSIDE', 'outside'),
			line: 1,
			column: 61,
		},
		{
			code: "a { list-style: CUSTOM-COUNTER-STYLE url('../img/dino.png') OUTSIDE; }",
			fixed: "a { list-style: CUSTOM-COUNTER-STYLE url('../img/dino.png') outside; }",
			fix: {
				range: [60, 67],
				text: 'outside',
			},
			message: messages.expected('OUTSIDE', 'outside'),
			line: 1,
			column: 61,
		},
		{
			code: "a { list-style: LOWER-ROMAN url('../img/dino.png') outside; }",
			fixed: "a { list-style: lower-roman url('../img/dino.png') outside; }",
			fix: {
				range: [16, 27],
				text: 'lower-roman',
			},
			message: messages.expected('LOWER-ROMAN', 'lower-roman'),
			line: 1,
			column: 17,
		},
		{
			code: 'ol { list-style-type: UPPER-ALPHA; }',
			fixed: 'ol { list-style-type: upper-alpha; }',
			fix: {
				range: [22, 33],
				text: 'upper-alpha',
			},
			message: messages.expected('UPPER-ALPHA', 'upper-alpha'),
			line: 1,
			column: 23,
		},
		{
			code: 'ol { list-style-type: SOMALI; }',
			fixed: 'ol { list-style-type: somali; }',
			fix: {
				range: [22, 28],
				text: 'somali',
			},
			message: messages.expected('SOMALI', 'somali'),
			line: 1,
			column: 23,
		},
		{
			code: 'a { grid-column-start: sPan camelCaseArea; }',
			fixed: 'a { grid-column-start: span camelCaseArea; }',
			fix: {
				range: [24, 25],
				text: 'p',
			},
			message: messages.expected('sPan', 'span'),
			line: 1,
			column: 24,
		},
		{
			code: 'a { GRID-COLUMN-START: SPAN camelCaseArea; }',
			fixed: 'a { GRID-COLUMN-START: span camelCaseArea; }',
			fix: {
				range: [23, 27],
				text: 'span',
			},
			message: messages.expected('SPAN', 'span'),
			line: 1,
			column: 24,
		},
	],
});

testRule({
	ruleName,
	customSyntax: 'postcss-scss',
	config: ['lower'],
	fix: true,
	computeEditInfo: true,

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
			fix: {
				range: [14, 15],
				text: 'b',
			},
			message: messages.expected('Block', 'block'),
			line: 1,
			column: 15,
		},
		{
			code: 'a { $display: bLoCk; }',
			fixed: 'a { $display: block; }',
			fix: {
				range: [15, 18],
				text: 'loc',
			},
			message: messages.expected('bLoCk', 'block'),
			line: 1,
			column: 15,
		},
		{
			code: 'a { $display: BLOCK; }',
			fixed: 'a { $display: block; }',
			fix: {
				range: [14, 19],
				text: 'block',
			},
			message: messages.expected('BLOCK', 'block'),
			line: 1,
			column: 15,
		},
		{
			code: 'a { font: (italic Bold 10px/8PX) }',
			fixed: 'a { font: (italic bold 10px/8PX) }',
			fix: {
				range: [18, 19],
				text: 'b',
			},
			message: messages.expected('Bold', 'bold'),
			line: 1,
			column: 19,
		},
		{
			code: '.content { .link { display: Block; } }',
			fixed: '.content { .link { display: block; } }',
			fix: {
				range: [28, 29],
				text: 'b',
			},
			message: messages.expected('Block', 'block'),
			line: 1,
			column: 29,
		},
		{
			code: '.a { &-link { display: Block } }',
			fixed: '.a { &-link { display: block } }',
			fix: {
				range: [23, 24],
				text: 'b',
			},
			message: messages.expected('Block', 'block'),
			line: 1,
			column: 24,
		},
		{
			code: '$map: (Display-first: block, display-second: inline);',
			fixed: '$map: (display-first: block, display-second: inline);',
			fix: {
				range: [7, 8],
				text: 'd',
			},
			message: messages.expected('Display-first', 'display-first'),
			line: 1,
			column: 8,
		},
		{
			code: '$map: (display-first: Block, display-second: inline);',
			fixed: '$map: (display-first: block, display-second: inline);',
			fix: {
				range: [22, 23],
				text: 'b',
			},
			message: messages.expected('Block', 'block'),
			line: 1,
			column: 23,
		},
		{
			code: '$map: (display-first: block, display-second: Inline);',
			fixed: '$map: (display-first: block, display-second: inline);',
			fix: {
				range: [45, 46],
				text: 'i',
			},
			message: messages.expected('Inline', 'inline'),
			line: 1,
			column: 46,
		},
	],
});

testRule({
	ruleName,
	customSyntax: 'postcss-less',
	config: ['lower'],
	fix: true,
	computeEditInfo: true,

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
			fix: {
				range: [27, 28],
				text: 's',
			},
			description: 'inside mixin',
			message: messages.expected('Solid', 'solid'),
			line: 1,
			column: 28,
		},
		{
			code: '.bordered { border-bottom: solid 2px Black; }',
			fixed: '.bordered { border-bottom: solid 2px black; }',
			fix: {
				range: [37, 38],
				text: 'b',
			},
			description: 'inside mixin',
			message: messages.expected('Black', 'black'),
			line: 1,
			column: 38,
		},
		{
			code: '#header { .navigation { display: Block; } }',
			fixed: '#header { .navigation { display: block; } }',
			fix: {
				range: [33, 34],
				text: 'b',
			},
			description: 'nested',
			message: messages.expected('Block', 'block'),
			line: 1,
			column: 34,
		},
		{
			code: '@detached-ruleset: { background: Red; };',
			fixed: '@detached-ruleset: { background: red; };',
			fix: {
				range: [33, 34],
				text: 'r',
			},
			message: messages.expected('Red', 'red'),
			line: 1,
			column: 34,
		},
		{
			code: '.a { &-link { background: Red; } };',
			fixed: '.a { &-link { background: red; } };',
			fix: {
				range: [26, 27],
				text: 'r',
			},
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
	computeEditInfo: true,

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
			code: 'a { color: CanvasText; }',
			description: 'newer system color',
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
			fix: {
				range: [14, 18],
				text: 'LOCK',
			},
			message: messages.expected('Block', 'BLOCK'),
			line: 1,
			column: 14,
		},
		{
			code: 'a { display: bLoCk; }',
			fixed: 'a { display: BLOCK; }',
			fix: {
				range: [13, 18],
				text: 'BLOCK',
			},
			message: messages.expected('bLoCk', 'BLOCK'),
			line: 1,
			column: 14,
		},
		{
			code: 'a { display: block; }',
			fixed: 'a { display: BLOCK; }',
			fix: {
				range: [13, 18],
				text: 'BLOCK',
			},
			message: messages.expected('block', 'BLOCK'),
			line: 1,
			column: 14,
		},
		{
			code: 'a:hover { display: Block; }',
			fixed: 'a:hover { display: BLOCK; }',
			fix: {
				range: [20, 24],
				text: 'LOCK',
			},
			message: messages.expected('Block', 'BLOCK'),
			line: 1,
			column: 20,
		},
		{
			code: 'a:other { display: Block; }',
			fixed: 'a:other { display: BLOCK; }',
			fix: {
				range: [20, 24],
				text: 'LOCK',
			},
			message: messages.expected('Block', 'BLOCK'),
			line: 1,
			column: 20,
		},
		{
			code: 'a::before { display: Block; }',
			fixed: 'a::before { display: BLOCK; }',
			fix: {
				range: [22, 26],
				text: 'LOCK',
			},
			message: messages.expected('Block', 'BLOCK'),
			line: 1,
			column: 22,
		},
		{
			code: 'a::other { display: Block; }',
			fixed: 'a::other { display: BLOCK; }',
			fix: {
				range: [21, 25],
				text: 'LOCK',
			},
			message: messages.expected('Block', 'BLOCK'),
			line: 1,
			column: 21,
		},
		{
			code: 'a { display: BLOCK !Import; }',
			fixed: 'a { display: BLOCK !IMPORT; }',
			fix: {
				range: [21, 26],
				text: 'MPORT',
			},
			message: messages.expected('!Import', '!IMPORT'),
			line: 1,
			column: 20,
		},
		{
			code: 'a { display: BLOCK !iMpOrT; }',
			fixed: 'a { display: BLOCK !IMPORT; }',
			fix: {
				range: [20, 25],
				text: 'IMPOR',
			},
			message: messages.expected('!iMpOrT', '!IMPORT'),
			line: 1,
			column: 20,
		},
		{
			code: 'a { display: BLOCK !import; }',
			fixed: 'a { display: BLOCK !IMPORT; }',
			fix: {
				range: [20, 26],
				text: 'IMPORT',
			},
			message: messages.expected('!import', '!IMPORT'),
			line: 1,
			column: 20,
		},
		{
			code: 'a { background-position: Top RIGHT, 1em 5vh; }',
			fixed: 'a { background-position: TOP RIGHT, 1em 5vh; }',
			fix: {
				range: [26, 28],
				text: 'OP',
			},
			message: messages.expected('Top', 'TOP'),
			line: 1,
			column: 26,
		},
		{
			code: 'a { background-position: TOP Right, 1em 5vh; }',
			fixed: 'a { background-position: TOP RIGHT, 1em 5vh; }',
			fix: {
				range: [30, 34],
				text: 'IGHT',
			},
			message: messages.expected('Right', 'RIGHT'),
			line: 1,
			column: 30,
		},
		{
			code: 'a { transition: -Webkit-transform 2s; }',
			fixed: 'a { transition: -WEBKIT-TRANSFORM 2s; }',
			fix: {
				range: [18, 33],
				text: 'EBKIT-TRANSFORM',
			},
			message: messages.expected('-Webkit-transform', '-WEBKIT-TRANSFORM'),
			line: 1,
			column: 17,
		},
		{
			code: 'a { transition: -webkit-Transform 2s; }',
			fixed: 'a { transition: -WEBKIT-TRANSFORM 2s; }',
			fix: {
				range: [17, 33],
				text: 'WEBKIT-TRANSFORM',
			},
			message: messages.expected('-webkit-Transform', '-WEBKIT-TRANSFORM'),
			line: 1,
			column: 17,
		},
		{
			code: 'a { background-image: linear-gradient(To RIGHT, WHITE calc(100% - 50em), SILVER); }',
			fixed: 'a { background-image: linear-gradient(TO RIGHT, WHITE calc(100% - 50em), SILVER); }',
			fix: {
				range: [39, 40],
				text: 'O',
			},
			message: messages.expected('To', 'TO'),
			line: 1,
			column: 39,
		},
		{
			code: 'a { background-image: linear-gradient(TO Right, WHITE calc(100% - 50em), SILVER); }',
			fixed: 'a { background-image: linear-gradient(TO RIGHT, WHITE calc(100% - 50em), SILVER); }',
			fix: {
				range: [42, 46],
				text: 'IGHT',
			},
			message: messages.expected('Right', 'RIGHT'),
			line: 1,
			column: 42,
		},
		{
			code: 'a { background-image: linear-gradient(TO RIGHT, WHITE calc(100% - 50em), Silver); }',
			fixed: 'a { background-image: linear-gradient(TO RIGHT, WHITE calc(100% - 50em), SILVER); }',
			fix: {
				range: [74, 79],
				text: 'ILVER',
			},
			message: messages.expected('Silver', 'SILVER'),
			line: 1,
			column: 74,
		},
		{
			code: 'a { display: Super-block; }',
			fixed: 'a { display: SUPER-BLOCK; }',
			fix: {
				range: [14, 24],
				text: 'UPER-BLOCK',
			},
			description: 'work with unknown value keyword',
			message: messages.expected('Super-block', 'SUPER-BLOCK'),
			line: 1,
			column: 14,
		},
		{
			code: '@media (min-width: 768px) { color: Red; }',
			fixed: '@media (min-width: 768px) { color: RED; }',
			fix: {
				range: [36, 38],
				text: 'ED',
			},
			message: messages.expected('Red', 'RED'),
			line: 1,
			column: 36,
		},
		{
			code: '@media screen { color: GREEN; @media (min-width: 768px) { color: Red; } }',
			fixed: '@media screen { color: GREEN; @media (min-width: 768px) { color: RED; } }',
			fix: {
				range: [66, 68],
				text: 'ED',
			},
			message: messages.expected('Red', 'RED'),
			line: 1,
			column: 66,
		},
		{
			code: 'a { text-rendering: optimizeSpeed; }',
			fixed: 'a { text-rendering: OPTIMIZESPEED; }',
			fix: {
				range: [20, 33],
				text: 'OPTIMIZESPEED',
			},
			message: messages.expected('optimizeSpeed', 'OPTIMIZESPEED'),
			line: 1,
			column: 21,
		},
		{
			code: 'a { animation: none; }',
			fixed: 'a { animation: NONE; }',
			fix: {
				range: [15, 19],
				text: 'NONE',
			},
			message: messages.expected('none', 'NONE'),
			line: 1,
			column: 16,
		},
		{
			code: 'a { animation: 3s linear 1s animation-name; }',
			fixed: 'a { animation: 3s LINEAR 1s animation-name; }',
			fix: {
				range: [18, 24],
				text: 'LINEAR',
			},
			message: messages.expected('linear', 'LINEAR'),
			line: 1,
			column: 19,
		},
		{
			code: 'a { animation: 3s linear 1s aNiMaTiOn-NaMe; }',
			fixed: 'a { animation: 3s LINEAR 1s aNiMaTiOn-NaMe; }',
			fix: {
				range: [18, 24],
				text: 'LINEAR',
			},
			message: messages.expected('linear', 'LINEAR'),
			line: 1,
			column: 19,
		},
		{
			code: 'a { animation: 3s linear 1s ANIMATION-NAME; }',
			fixed: 'a { animation: 3s LINEAR 1s ANIMATION-NAME; }',
			fix: {
				range: [18, 24],
				text: 'LINEAR',
			},
			message: messages.expected('linear', 'LINEAR'),
			line: 1,
			column: 19,
		},
		{
			code: 'a { animation-name: inherit; }',
			fixed: 'a { animation-name: INHERIT; }',
			fix: {
				range: [20, 27],
				text: 'INHERIT',
			},
			message: messages.expected('inherit', 'INHERIT'),
			line: 1,
			column: 21,
		},
		{
			code: 'a { font: italic 2em font-family, SANS-SERIF; }',
			fixed: 'a { font: ITALIC 2em font-family, SANS-SERIF; }',
			fix: {
				range: [10, 16],
				text: 'ITALIC',
			},
			message: messages.expected('italic', 'ITALIC'),
			line: 1,
			column: 11,
		},
		{
			code: 'a { font: italic 2em fOnT-fAmIlY, SANS-SERIF; }',
			fixed: 'a { font: ITALIC 2em fOnT-fAmIlY, SANS-SERIF; }',
			fix: {
				range: [10, 16],
				text: 'ITALIC',
			},
			message: messages.expected('italic', 'ITALIC'),
			line: 1,
			column: 11,
		},
		{
			code: 'a { font: italic 2em FONT-FAMILY, SANS-SERIF; }',
			fixed: 'a { font: ITALIC 2em FONT-FAMILY, SANS-SERIF; }',
			fix: {
				range: [10, 16],
				text: 'ITALIC',
			},
			message: messages.expected('italic', 'ITALIC'),
			line: 1,
			column: 11,
		},
		{
			code: 'a { font: ITALIC 2em font-family, sans-serif; }',
			fixed: 'a { font: ITALIC 2em font-family, SANS-SERIF; }',
			fix: {
				range: [34, 44],
				text: 'SANS-SERIF',
			},
			message: messages.expected('sans-serif', 'SANS-SERIF'),
			line: 1,
			column: 35,
		},
		{
			code: 'a { font-family: monospace; }',
			fixed: 'a { font-family: MONOSPACE; }',
			fix: {
				range: [17, 26],
				text: 'MONOSPACE',
			},
			message: messages.expected('monospace', 'MONOSPACE'),
			line: 1,
			column: 18,
		},
		{
			code: 'a { counter-increment: inherit; }',
			fixed: 'a { counter-increment: INHERIT; }',
			fix: {
				range: [23, 30],
				text: 'INHERIT',
			},
			message: messages.expected('inherit', 'INHERIT'),
			line: 1,
			column: 24,
		},
		{
			code: 'a { counter-reset: inherit; }',
			fixed: 'a { counter-reset: INHERIT; }',
			fix: {
				range: [19, 26],
				text: 'INHERIT',
			},
			message: messages.expected('inherit', 'INHERIT'),
			line: 1,
			column: 20,
		},
		{
			code: 'a { grid-row: auto / AUTO; }',
			fixed: 'a { grid-row: AUTO / AUTO; }',
			fix: {
				range: [14, 18],
				text: 'AUTO',
			},
			message: messages.expected('auto', 'AUTO'),
			line: 1,
			column: 15,
		},
		{
			code: 'a { grid-row: span somegridarea; }',
			fixed: 'a { grid-row: SPAN somegridarea; }',
			fix: {
				range: [14, 18],
				text: 'SPAN',
			},
			message: messages.expected('span', 'SPAN'),
			line: 1,
			column: 15,
		},
		{
			code: 'a { grid-column: auto / AUTO; }',
			fixed: 'a { grid-column: AUTO / AUTO; }',
			fix: {
				range: [17, 21],
				text: 'AUTO',
			},
			message: messages.expected('auto', 'AUTO'),
			line: 1,
			column: 18,
		},
		{
			code: 'a { grid-column: span somegridarea; }',
			fixed: 'a { grid-column: SPAN somegridarea; }',
			fix: {
				range: [17, 21],
				text: 'SPAN',
			},
			message: messages.expected('span', 'SPAN'),
			line: 1,
			column: 18,
		},
		{
			code: 'a { grid-area: auto / AUTO; }',
			fixed: 'a { grid-area: AUTO / AUTO; }',
			fix: {
				range: [15, 19],
				text: 'AUTO',
			},
			message: messages.expected('auto', 'AUTO'),
			line: 1,
			column: 16,
		},
		{
			code: 'a { grid-area: span somegridarea; }',
			fixed: 'a { grid-area: SPAN somegridarea; }',
			fix: {
				range: [15, 19],
				text: 'SPAN',
			},
			message: messages.expected('span', 'SPAN'),
			line: 1,
			column: 16,
		},
		{
			code: 'a { list-style: inherit; }',
			fixed: 'a { list-style: INHERIT; }',
			fix: {
				range: [16, 23],
				text: 'INHERIT',
			},
			message: messages.expected('inherit', 'INHERIT'),
			line: 1,
			column: 17,
		},
		{
			code: 'a { list-style: none; }',
			fixed: 'a { list-style: NONE; }',
			fix: {
				range: [16, 20],
				text: 'NONE',
			},
			message: messages.expected('none', 'NONE'),
			line: 1,
			column: 17,
		},
		{
			code: 'a { list-style: square; }',
			fixed: 'a { list-style: SQUARE; }',
			fix: {
				range: [16, 22],
				text: 'SQUARE',
			},
			message: messages.expected('square', 'SQUARE'),
			line: 1,
			column: 17,
		},
		{
			code: "a { list-style: custom-counter-style url('../img/dino.png') outside; }",
			fixed: "a { list-style: custom-counter-style url('../img/dino.png') OUTSIDE; }",
			fix: {
				range: [60, 67],
				text: 'OUTSIDE',
			},
			message: messages.expected('outside', 'OUTSIDE'),
			line: 1,
			column: 61,
		},
		{
			code: "a { list-style: cUsToM-cOuNtEr-StYlE url('../img/dino.png') outside; }",
			fixed: "a { list-style: cUsToM-cOuNtEr-StYlE url('../img/dino.png') OUTSIDE; }",
			fix: {
				range: [60, 67],
				text: 'OUTSIDE',
			},
			message: messages.expected('outside', 'OUTSIDE'),
			line: 1,
			column: 61,
		},
		{
			code: "a { list-style: CUSTOM-COUNTER-STYLE url('../img/dino.png') outside; }",
			fixed: "a { list-style: CUSTOM-COUNTER-STYLE url('../img/dino.png') OUTSIDE; }",
			fix: {
				range: [60, 67],
				text: 'OUTSIDE',
			},
			message: messages.expected('outside', 'OUTSIDE'),
			line: 1,
			column: 61,
		},
		{
			code: "a { list-style: lower-roman url('../img/dino.png') OUTSIDE; }",
			fixed: "a { list-style: LOWER-ROMAN url('../img/dino.png') OUTSIDE; }",
			fix: {
				range: [16, 27],
				text: 'LOWER-ROMAN',
			},
			message: messages.expected('lower-roman', 'LOWER-ROMAN'),
			line: 1,
			column: 17,
		},
		{
			code: "a { list-style: LOWER-ROMAN url('../img/dino.png') outside; }",
			fixed: "a { list-style: LOWER-ROMAN url('../img/dino.png') OUTSIDE; }",
			fix: {
				range: [51, 58],
				text: 'OUTSIDE',
			},
			message: messages.expected('outside', 'OUTSIDE'),
			line: 1,
			column: 52,
		},
		{
			code: 'ol { list-style-type: upper-alpha; }',
			fixed: 'ol { list-style-type: UPPER-ALPHA; }',
			fix: {
				range: [22, 33],
				text: 'UPPER-ALPHA',
			},
			message: messages.expected('upper-alpha', 'UPPER-ALPHA'),
			line: 1,
			column: 23,
		},
	],
});

testRule({
	ruleName,
	customSyntax: 'postcss-scss',
	config: ['upper'],
	fix: true,
	computeEditInfo: true,

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
			fix: {
				range: [15, 19],
				text: 'LOCK',
			},
			message: messages.expected('Block', 'BLOCK'),
			line: 1,
			column: 15,
		},
		{
			code: 'a { $display: bLoCk; }',
			fixed: 'a { $display: BLOCK; }',
			fix: {
				range: [14, 19],
				text: 'BLOCK',
			},
			message: messages.expected('bLoCk', 'BLOCK'),
			line: 1,
			column: 15,
		},
		{
			code: 'a { $display: block; }',
			fixed: 'a { $display: BLOCK; }',
			fix: {
				range: [14, 19],
				text: 'BLOCK',
			},
			message: messages.expected('block', 'BLOCK'),
			line: 1,
			column: 15,
		},
		{
			code: 'a { font: (ITALIC Bold 10px/8PX) }',
			fixed: 'a { font: (ITALIC BOLD 10px/8PX) }',
			fix: {
				range: [19, 22],
				text: 'OLD',
			},
			message: messages.expected('Bold', 'BOLD'),
			line: 1,
			column: 19,
		},
		{
			code: '.content { .link { display: Block; } }',
			fixed: '.content { .link { display: BLOCK; } }',
			fix: {
				range: [29, 33],
				text: 'LOCK',
			},
			message: messages.expected('Block', 'BLOCK'),
			line: 1,
			column: 29,
		},
		{
			code: '.a { &-link { display: Block } }',
			fixed: '.a { &-link { display: BLOCK } }',
			fix: {
				range: [24, 28],
				text: 'LOCK',
			},
			message: messages.expected('Block', 'BLOCK'),
			line: 1,
			column: 24,
		},
		{
			code: '$map: (display-first: BLOCK, DISPLAY-SECOND: INLINE);',
			fixed: '$map: (DISPLAY-FIRST: BLOCK, DISPLAY-SECOND: INLINE);',
			fix: {
				range: [7, 20],
				text: 'DISPLAY-FIRST',
			},
			message: messages.expected('display-first', 'DISPLAY-FIRST'),
			line: 1,
			column: 8,
		},
		{
			code: '$map: (DISPLAY-FIRST: Block, DISPLAY-SECOND: INLINE);',
			fixed: '$map: (DISPLAY-FIRST: BLOCK, DISPLAY-SECOND: INLINE);',
			fix: {
				range: [23, 27],
				text: 'LOCK',
			},
			message: messages.expected('Block', 'BLOCK'),
			line: 1,
			column: 23,
		},
		{
			code: '$map: (DISPLAY-FIRST: BLOCK, DISPLAY-SECOND: Inline);',
			fixed: '$map: (DISPLAY-FIRST: BLOCK, DISPLAY-SECOND: INLINE);',
			fix: {
				range: [46, 51],
				text: 'NLINE',
			},
			message: messages.expected('Inline', 'INLINE'),
			line: 1,
			column: 46,
		},
	],
});

testRule({
	ruleName,
	customSyntax: 'postcss-less',
	config: ['upper'],
	fix: true,
	computeEditInfo: true,

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
			fix: {
				range: [28, 32],
				text: 'OLID',
			},
			description: 'inside mixin',
			message: messages.expected('Solid', 'SOLID'),
			line: 1,
			column: 28,
		},
		{
			code: '.bordered { border-bottom: SOLID 2px Black; }',
			fixed: '.bordered { border-bottom: SOLID 2px BLACK; }',
			fix: {
				range: [38, 42],
				text: 'LACK',
			},
			description: 'inside mixin',
			message: messages.expected('Black', 'BLACK'),
			line: 1,
			column: 38,
		},
		{
			code: '#header { .navigation { display: Block; } }',
			fixed: '#header { .navigation { display: BLOCK; } }',
			fix: {
				range: [34, 38],
				text: 'LOCK',
			},
			description: 'nested',
			message: messages.expected('Block', 'BLOCK'),
			line: 1,
			column: 34,
		},
		{
			code: '@detached-ruleset: { background: Red; };',
			fixed: '@detached-ruleset: { background: RED; };',
			fix: {
				range: [34, 36],
				text: 'ED',
			},
			message: messages.expected('Red', 'RED'),
			line: 1,
			column: 34,
		},
		{
			code: '.a { &-link { background: Red; } };',
			fixed: '.a { &-link { background: RED; } };',
			fix: {
				range: [27, 29],
				text: 'ED',
			},
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
	computeEditInfo: true,

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
			fix: {
				range: [14, 17],
				text: 'loc',
			},
			message: messages.expected('bLoCk', 'block'),
			line: 1,
			column: 14,
			description: "Rejected because doesn't match exact case-sensitive string that is ignored",
		},
		{
			code: 'a { display: BLOCK; }',
			fixed: 'a { display: block; }',
			fix: {
				range: [13, 18],
				text: 'block',
			},
			message: messages.expected('BLOCK', 'block'),
			line: 1,
			column: 14,
			description: "Rejected because doesn't match exact case-sensitive string that is ignored",
		},
		{
			code: 'a { display: Inline; }',
			fixed: 'a { display: inline; }',
			fix: {
				range: [13, 14],
				text: 'i',
			},
			message: messages.expected('Inline', 'inline'),
			line: 1,
			column: 14,
		},
		{
			code: 'a { display: iNlInE; }',
			fixed: 'a { display: inline; }',
			fix: {
				range: [14, 19],
				text: 'nline',
			},
			message: messages.expected('iNlInE', 'inline'),
			line: 1,
			column: 14,
		},
		{
			code: 'a { display: INLINE; }',
			fixed: 'a { display: inline; }',
			fix: {
				range: [13, 19],
				text: 'inline',
			},
			message: messages.expected('INLINE', 'inline'),
			line: 1,
			column: 14,
		},
		{
			code: 'a { display: fLeX; }',
			fixed: 'a { display: flex; }',
			fix: {
				range: [14, 17],
				text: 'lex',
			},
			message: messages.expected('fLeX', 'flex'),
			line: 1,
			column: 14,
		},
		{
			code: 'a { display: FLEX; }',
			fixed: 'a { display: flex; }',
			fix: {
				range: [13, 17],
				text: 'flex',
			},
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
	computeEditInfo: true,

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
			fix: {
				range: [14, 19],
				text: 'NLINE',
			},
			message: messages.expected('Inline', 'INLINE'),
			line: 1,
			column: 14,
		},
		{
			code: 'a { display: iNlInE; }',
			fixed: 'a { display: INLINE; }',
			fix: {
				range: [13, 18],
				text: 'INLIN',
			},
			message: messages.expected('iNlInE', 'INLINE'),
			line: 1,
			column: 14,
		},
		{
			code: 'a { display: inline; }',
			fixed: 'a { display: INLINE; }',
			fix: {
				range: [13, 19],
				text: 'INLINE',
			},
			message: messages.expected('inline', 'INLINE'),
			line: 1,
			column: 14,
		},
		{
			code: 'a { display: fLeX; }',
			fixed: 'a { display: FLEX; }',
			fix: {
				range: [13, 16],
				text: 'FLE',
			},
			message: messages.expected('fLeX', 'FLEX'),
			line: 1,
			column: 14,
		},
		{
			code: 'a { display: fLEX; }',
			fixed: 'a { display: FLEX; }',
			fix: {
				range: [13, 14],
				text: 'F',
			},
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
	computeEditInfo: true,

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
			fix: {
				range: [13, 19],
				text: 'INLINE',
			},
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
	computeEditInfo: true,

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
			fix: {
				range: [16, 20],
				text: 'left',
			},
			message: messages.expected('LEFT', 'left'),
			description: "Rejected because property doesn't match any property in ignoreProperties list",
		},
		{
			code: 'a { text-align: Left; }',
			fixed: 'a { text-align: left; }',
			fix: {
				range: [16, 17],
				text: 'l',
			},
			message: messages.expected('Left', 'left'),
			description: "Rejected because property doesn't match any property in ignoreProperties list",
		},
	],
});

testRule({
	ruleName,
	customSyntax: 'postcss-scss',
	config: ['lower', { ignoreProperties: ['$fontFamily'] }],
	fix: true,
	computeEditInfo: true,

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
			fix: {
				range: [8, 9],
				text: 'r',
			},
			message: messages.expected('Red', 'red'),
			description: "Rejected because property doesn't match any property in ignoreProperties list",
		},
	],
});

testRule({
	ruleName,
	config: ['lower', { ignoreProperties: [/^(b|B)ackground$/] }],
	fix: true,
	computeEditInfo: true,

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
			fix: {
				range: [16, 20],
				text: 'left',
			},
			message: messages.expected('LEFT', 'left'),
			description: "Rejected because property doesn't match any property in ignoreProperties list",
		},
	],
});

testRule({
	ruleName,
	config: ['lower', { ignoreProperties: ['BACKGROUND'] }],
	fix: true,
	computeEditInfo: true,

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
			fix: {
				range: [16, 20],
				text: 'left',
			},
			message: messages.expected('LEFT', 'left'),
			description: "Rejected because property doesn't match any property in ignoreProperties list",
		},
	],
});

testRule({
	ruleName,
	config: ['upper', { ignoreProperties: ['display', '/^(b|B)ackground$/'] }],
	fix: true,
	computeEditInfo: true,

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
			fix: {
				range: [16, 20],
				text: 'LEFT',
			},
			message: messages.expected('left', 'LEFT'),
			description: "Rejected because property doesn't match any property in ignoreProperties list",
		},
		{
			code: 'a { text-align: LeFt; }',
			fixed: 'a { text-align: LEFT; }',
			fix: {
				range: [17, 20],
				text: 'EFT',
			},
			message: messages.expected('LeFt', 'LEFT'),
			description: "Rejected because property doesn't match any property in ignoreProperties list",
		},
		{
			code: 'a { text-align: Left; }',
			fixed: 'a { text-align: LEFT; }',
			fix: {
				range: [17, 20],
				text: 'EFT',
			},
			message: messages.expected('Left', 'LEFT'),
			description: "Rejected because property doesn't match any property in ignoreProperties list",
		},
	],
});

testRule({
	ruleName,
	config: ['upper', { ignoreFunctions: ['t', 'camelCase', /^(f|F)oo$/] }],
	fix: true,
	computeEditInfo: true,

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
		{
			code: 'a { color: camelCase(value); }',
		},
	],

	reject: [
		{
			code: 'a { display: b(inline); }',
			fixed: 'a { display: b(INLINE); }',
			fix: {
				range: [15, 21],
				text: 'INLINE',
			},
			message: messages.expected('inline', 'INLINE'),
			line: 1,
			column: 16,
		},
		{
			code: 'a { display: bar(--camelCase); }',
			fixed: 'a { display: bar(--CAMELCASE); }',
			fix: {
				range: [19, 28],
				text: 'CAMELCASE',
			},
			message: messages.expected('--camelCase', '--CAMELCASE'),
			line: 1,
			column: 18,
		},
	],
});

testRule({
	ruleName,
	config: ['lower', { camelCaseSvgKeywords: true }],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: 'a { color: currentColor; }',
		},
		{
			code: 'a { color: lightseagreen; }',
		},
	],

	reject: [
		{
			code: 'a { color: currentcolor; }',
			fixed: 'a { color: currentColor; }',
			fix: {
				range: [18, 19],
				text: 'C',
			},
			message: messages.expected('currentcolor', 'currentColor'),
			line: 1,
			column: 12,
		},
	],
});

testRule({
	ruleName,
	config: ['lower', { camelCaseSvgKeywords: false }],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: 'a { color: currentcolor; }',
		},
		{
			code: 'a { color: lightseagreen; }',
		},
	],

	reject: [
		{
			code: 'a { color: currentColor; }',
			fixed: 'a { color: currentcolor; }',
			fix: {
				range: [18, 19],
				text: 'c',
			},
			message: messages.expected('currentColor', 'currentcolor'),
			line: 1,
			column: 12,
		},
	],
});

testRule({
	ruleName,
	config: ['upper', { camelCaseSvgKeywords: true }],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: 'a { color: CURRENTCOLOR; }',
		},
		{
			code: 'a { color: LIGHTSEAGREEN; }',
		},
	],

	reject: [
		{
			code: 'a { color: currentColor; }',
			fixed: 'a { color: CURRENTCOLOR; }',
			fix: {
				range: [11, 23],
				text: 'CURRENTCOLOR',
			},
			message: messages.expected('currentColor', 'CURRENTCOLOR'),
			line: 1,
			column: 12,
		},
	],
});
