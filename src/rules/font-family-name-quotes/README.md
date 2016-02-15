# font-family-name-quotes

Specify whether or not quotation marks should be used around font family names, and whether single or double.

```css
a { font-family: "Times New Roman", 'Ancient Runes', serif; }
/**              ↑               ↑  ↑             ↑
 *               These quotation marks and this one */
```

This rule ignores `$sass`, `@less`, and `var(--custom-property)` variable syntaxes.

## Options

`string`: `"single-where-required"|"single-where-recommended"|"single-unless-keyword"|"double-where-required"|"double-where-recommended|"double-unless-keyword"`

*Please read the following to understand these options*:

- The `font-family` property accepts a short list of special **keywords**: `inherit`, `serif`, `sans-serif`, `cursive`, `fantasy`, and `monospace`. If you wrap these words in quotes, the browser will not interpret them as keywords, but will instead look for a font by that name (e.g. will look for a `"sans-serif"` font) -- which is almost *never* what you want. Instead, you use these keywords to point to the built-in, generic fallbacks (right?). Therefore, *all of the options below enforce no quotes around these keywords*. (If you actually want to use a font named `"sans-serif"`, turn this rule off.)
- Quotes are **recommended** [in the spec](https://www.w3.org/TR/CSS2/fonts.html#font-family-prop) with "font family names that contain white space, digits, or punctuation characters other than hyphens".
- Quotes are **required** around font-family names when they are not [valid CSS identifiers](https://www.w3.org/TR/CSS2/syndata.html#value-def-identifier). For example, a font family name requires quotes around it if it contains `$`, `!`, or `/`, but does not require quotes just because it contains spaces or a (non-initial) number or underscore. *You can probably bet that almost every font family name you use **will** be a valid CSS identifier*.

For more on these subtleties, read ["Unquoted font family names in CSS"](https://mathiasbynens.be/notes/unquoted-font-family), by Mathias Bynens.

**Caveat:** This rule does not currently understand escape sequences such as those described by Mathias. If you want to use the font family name "Hawaii 5-0" you will need to wrap it in quotes, instead of escaping it as `Hawaii \35 -0` or `Hawaii\ 5-0`.

### `"single-unless-keyword"` and `"double-unless-keyword"`

Expect quotes around every font family name that is not a keyword.

For example, with `"single-unless-keyword"`, the following patterns are considered warnings:

```css
a { font-family: Arial, sans-serif; }
```

```css
a { font-family: Times New Roman, Times, serif; }
```

And the following patterns are *not* considered warnings:

```css
a { font-family: 'Arial', sans-serif; }
```

```css
a { font-family: 'Times New Roman', 'Times', serif; }
```

The same examples apply to `"double-unless-keyword"`, but with `"` quotes.

### `"single-where-required"` and `"double-where-required"`

Expect quotes only when quotes are *required* according to the criteria above, and disallow quotes in all other cases.

For example, with `"double-where-required"`, the following patterns are considered warnings:

```css
a { font-family: "Arial", sans-serif; }
```

```css
a { font-family: "Times New Roman", Times, serif; }
```

And the following patterns are *not* considered warnings:

```css
a { font-family: Arial, sans-serif; }
```

```css
a { font-family: Times New Roman, Times, serif; }
```

```css
a { font-family: "Hawaii 5-0"; }
```

The same examples apply to `"single-where-required"`, but with `'` quotes.

### `"single-where-recommended"` and `"double-where-recommended"`

Expect quotes only when quotes are *recommended* according to the criteria above, and disallow quotes in all other cases. (This includes all cases where quotes are *required*, as well.)

For example, with `"single-where-recommended"`, the following patterns are considered warnings:

```css
a { font-family: Times New Roman, Times, serif; }
```

```css
a { font-family: MyFontVersion6, sake_case_font; }
```

```css
a { font-family: 'Arial', sans-serif; }
```

And the following patterns are *not* considered warnings:

```css
a { font-family: 'Times New Roman', Times, serif; }
```

```css
a { font-family: 'MyFontVersion6', 'sake_case_font'; }
```

```css
a { font-family: Arial, sans-serif; }
```

The same examples apply to `"double-where-recommended"`, but with `"` quotes.
