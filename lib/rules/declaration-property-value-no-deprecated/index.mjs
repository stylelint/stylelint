import { declarationValueIndex } from '../../utils/nodeFieldIndices.mjs';
import { isPlainObject } from '../../utils/validateTypes.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import { singleValueColorProperties } from '../../reference/properties.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'declaration-property-value-no-deprecated';

const messages = ruleMessages(ruleName, {
	rejected: (value, property) =>
		`Unexpected deprecated value "${value}" for property "${property}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/declaration-property-value-no-deprecated',
	fixable: true,
};

const DEPRECATED_COLORS = {
	activecaption: 'canvas',
	appworkspace: 'canvas',
	background: 'canvas',
	inactivecaption: 'canvas',
	infobackground: 'canvas',
	menu: 'canvas',
	scrollbar: 'canvas',
	window: 'canvas',
	activeborder: 'ButtonBorder',
	inactiveborder: 'ButtonBorder',
	threeddarkshadow: 'ButtonBorder',
	threedhighlight: 'ButtonBorder',
	threedlightshadow: 'ButtonBorder',
	threedshadow: 'ButtonBorder',
	windowframe: 'ButtonBorder',
	captiontext: 'CanvasText',
	infotext: 'CanvasText',
	menutext: 'CanvasText',
	windowtext: 'CanvasText',
	buttonhighlight: 'ButtonFace',
	buttonshadow: 'ButtonFace',
	threedface: 'ButtonFace',
	inactivecaptiontext: 'GrayText',
};
const COLOR_PROPERTIES = [...singleValueColorProperties.values()].map(
	(value) => /** @type {[string, Record<String, string>]} */ ([value, DEPRECATED_COLORS]),
);
const NAME_TO_VALUE = new Map([
	[
		'appearance',
		/** @type {string | string[] | Record<string, string>} */ ({
			button: 'auto',
			checkbox: 'auto',
			listbox: 'auto',
			menulist: 'auto',
			meter: 'auto',
			'progress-bar': 'auto',
			'push-button': 'auto',
			radio: 'auto',
			searchfield: 'auto',
			'slider-horizontal': 'auto',
			'square-button': 'auto',
			textarea: 'auto',
		}),
	],
	[
		'image-rendering',
		{
			optimizeQuality: 'smooth',
			optimizeSpeed: 'pixelated',
		},
	],
	['overflow', { overlay: 'auto' }],
	['text-justify', { distribute: 'inter-character' }],
	['text-orientation', { 'sideways-right': 'sideways' }],
	['user-select', { element: 'contain' }],
	['zoom', { reset: '1' }],
	['text-decoration-line', 'blink'],
	['box-sizing', 'padding-box'],
	['image-orientation', 'flip'],
	['min-height', ['intrinsic', 'min-intrinsic']],
	['min-width', ['intrinsic', 'min-intrinsic']],
	['max-height', ['intrinsic', 'min-intrinsic']],
	['max-width', ['intrinsic', 'min-intrinsic']],
	['height', ['intrinsic', 'min-intrinsic']],
	['width', ['intrinsic', 'min-intrinsic']],
	['word-break', 'break-word'],
	...COLOR_PROPERTIES,
]);

/** @type {import('stylelint').CoreRules[ruleName]} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, { actual: primary });

		if (!validOptions) return;

		root.walkDecls((decl) => {
			const value = NAME_TO_VALUE.get(decl.prop);

			if (!value) return;

			const declarationValue = decl.value;
			const keyword = declarationValue.toLowerCase();
			let fix;

			if (typeof value === 'string' && value !== keyword) return;

			if (Array.isArray(value) && !value.includes(keyword)) return;

			if (isPlainObject(value)) {
				const fixedValue = value[keyword];

				if (!fixedValue) return;

				fix = () => {
					decl.value = fixedValue;
				};
			}

			const index = declarationValueIndex(decl);
			const endIndex = index + declarationValue.length;

			report({
				message: messages.rejected,
				messageArgs: [declarationValue, decl.prop],
				node: decl,
				result,
				ruleName,
				index,
				endIndex,
				fix,
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
