# font-family-name-quotes

Require or disallow quotes for font family names.

<!-- prettier-ignore -->
```css
a { font-family: "Times New Roman", 'Ancient Runes', serif; }
/**              ↑               ↑  ↑             ↑
 *               These quotation marks and this one */
```

Use this rule to enforce a convention. The specification [requires](https://drafts.csswg.org/css-fonts-4/#font-family-prop) quotes around a font family name that isn't a valid identifier, e.g. one containing `$`. A name made of several identifiers, such as `Times New Roman`, needs none. It recommends them around a name that contains whitespace, digits or punctuation other than hyphens. Quotes around a [generic family](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/generic-family) keyword such as `sans-serif` or a system font such as `-apple-system` turn it into a font name, so every option disallows them.

Choose:

- `"always-unless-keyword"` for one simple convention that is always safe
- `"always-where-required"` for brevity
- `"always-where-recommended"` to follow the specification's recommendation

For more on these subtleties, read ["Unquoted font family names in CSS"](https://mathiasbynens.be/notes/unquoted-font-family), by Mathias Bynens.

> [!WARNING]
> This rule does not currently understand escape sequences such as those described by Mathias. If you want to use the font family name "Hawaii 5-0" you will need to wrap it in quotes, instead of escaping it as `Hawaii \35 -0` or `Hawaii\ 5-0`.

This rule checks the `font` and `font-family` properties.

This rule ignores `$sass`, `@less`, and `var(--custom-property)` variable syntaxes.

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix most of the problems reported by this rule.

This rule supports 1 [message argument](../../../docs/user-guide/configure.md#message): the font family name.

## Options

### `"always-unless-keyword"`

Expect quotes around every font family name that is not a keyword.

```json
{
  "font-family-name-quotes": "always-unless-keyword"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { font-family: Arial, sans-serif; }
```

<!-- prettier-ignore -->
```css
a { font-family: Times New Roman, Times, serif; }
```

<!-- prettier-ignore -->
```css
a { font: 1em Arial, sans-serif; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { font-family: 'Arial', sans-serif; }
```

<!-- prettier-ignore -->
```css
a { font-family: "Times New Roman", "Times", serif; }
```

<!-- prettier-ignore -->
```css
a { font: 1em 'Arial', sans-serif; }
```

### `"always-where-required"`

Expect quotes only when quotes are _required_ according to the criteria above, and disallow quotes in all other cases.

```json
{
  "font-family-name-quotes": "always-where-required"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { font-family: "Arial", sans-serif; }
```

<!-- prettier-ignore -->
```css
a { font-family: 'Times New Roman', Times, serif; }
```

<!-- prettier-ignore -->
```css
a { font: 1em "Arial", sans-serif; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { font-family: Arial, sans-serif; }
```

<!-- prettier-ignore -->
```css
a { font-family: Times New Roman, Times, serif; }
```

<!-- prettier-ignore -->
```css
a { font-family: "Hawaii 5-0"; }
```

<!-- prettier-ignore -->
```css
a { font: 1em Arial, sans-serif; }
```

### `"always-where-recommended"`

Expect quotes only when quotes are _recommended_ according to the criteria above, and disallow quotes in all other cases. (This includes all cases where quotes are _required_, as well.)

```json
{
  "font-family-name-quotes": "always-where-recommended"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { font-family: Times New Roman, Times, serif; }
```

<!-- prettier-ignore -->
```css
a { font-family: MyFontVersion6, sake_case_font; }
```

<!-- prettier-ignore -->
```css
a { font-family: 'Arial', sans-serif; }
```

<!-- prettier-ignore -->
```css
a { font: 1em Times New Roman, Times, serif; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { font-family: 'Times New Roman', Times, serif; }
```

<!-- prettier-ignore -->
```css
a { font-family: "MyFontVersion6", "sake_case_font"; }
```

<!-- prettier-ignore -->
```css
a { font-family: Arial, sans-serif; }
```

<!-- prettier-ignore -->
```css
a { font: 1em 'Times New Roman', Times, serif; }
```
