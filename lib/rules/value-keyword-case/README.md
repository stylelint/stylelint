# value-keyword-case

Specify lowercase or uppercase for keywords values.

<!-- prettier-ignore -->
```css
    a { display: block; }
/**              ↑
 *    These values */
```

This rule ignores [`<custom-idents>`](https://developer.mozilla.org/en/docs/Web/CSS/custom-ident) of known properties. Keyword values which are paired with non-properties (e.g. `$vars` and custom properties), and do not conform to the primary option, can be ignored using the `ignoreKeywords: []` secondary option.

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix all of the problems reported by this rule.

## Options

### `"lower"`

```json
{
  "value-keyword-case": "lower"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a {
  display: Block;
}
```

<!-- prettier-ignore -->
```css
a {
  display: bLoCk;
}
```

<!-- prettier-ignore -->
```css
a {
  display: BLOCK;
}
```

<!-- prettier-ignore -->
```css
a {
  transition: -WEBKIT-TRANSFORM 2s;
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {
  display: block;
}
```

<!-- prettier-ignore -->
```css
a {
  transition: -webkit-transform 2s;
}
```

### `"upper"`

```json
{
  "value-keyword-case": "upper"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a {
  display: Block;
}
```

<!-- prettier-ignore -->
```css
a {
  display: bLoCk;
}
```

<!-- prettier-ignore -->
```css
a {
  display: block;
}
```

<!-- prettier-ignore -->
```css
a {
  transition: -webkit-transform 2s;
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {
  display: BLOCK;
}
```

<!-- prettier-ignore -->
```css
a {
  transition: -WEBKIT-TRANSFORM 2s;
}
```

## Optional secondary options

### `ignoreKeywords`

```json
{ "ignoreKeywords": ["array", "of", "keywords", "/regex/"] }
```

Ignore case of keywords values.

Given:

```json
{
  "value-keyword-case": [
    "lower",
    { "ignoreKeywords": ["Block", "/^(f|F)lex$/"] }
  ]
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a {
  display: bLoCk;
}
```

<!-- prettier-ignore -->
```css
a {
  display: BLOCK;
}
```

<!-- prettier-ignore -->
```css
a {
  display: fLeX;
}
```

<!-- prettier-ignore -->
```css
a {
  display: FLEX;
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {
  display: block;
}
```

<!-- prettier-ignore -->
```css
a {
  display: Block;
}
```

<!-- prettier-ignore -->
```css
a {
  display: flex;
}
```

<!-- prettier-ignore -->
```css
a {
  display: Flex;
}
```

### `ignoreProperties`

```json
{ "ignoreProperties": ["array", "of", "properties", "/regex/"] }
```

Ignore case of the values of the listed properties.

Given:

```json
{
  "value-keyword-case": [
    "lower",
    { "ignoreProperties": ["/^(b|B)ackground$/", "display"] }
  ]
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a {
  text-align: LEFT;
}
```

<!-- prettier-ignore -->
```css
a {
  text-align: Left;
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {
  display: bloCk;
}
```

<!-- prettier-ignore -->
```css
a {
  display: BloCk;
}
```

<!-- prettier-ignore -->
```css
a {
  display: BLOCK;
}
```

<!-- prettier-ignore -->
```css
a {
  display: block;
}
```

<!-- prettier-ignore -->
```css
a {
  background: Red;
}
```

<!-- prettier-ignore -->
```css
a {
  Background: deepPink;
}
```

### `ignoreFunctions`

```json
{ "ignoreFunctions": ["array", "of", "functions", "/regex/"] }
```

Ignore case of the values inside the listed functions.

Given:

```json
{
  "value-keyword-case": ["upper", { "ignoreFunctions": ["/^(f|F)oo$/", "t"] }]
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a {
  display: b(inline);
}
```

```css
a {
  color: bar(--camelCase);
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {
  display: t(flex);
}
```

<!-- prettier-ignore -->
```css
a {
  display: t(fLeX);
}
```

<!-- prettier-ignore -->
```css
a {
  color: t(--camelCase);
}
```

<!-- prettier-ignore -->
```css
a {
  color: foo(--camelCase);
}
```

<!-- prettier-ignore -->
```css
a {
  color: Foo(--camelCase);
}
```

### `camelCaseSvgKeywords`

If `true`, this rule expects SVG keywords to be camel case when the primary option is `"lower"`. Defaults to `false`.

Given:

```json
{
  "value-keyword-case": ["lower", { "camelCaseSvgKeywords": true }]
}
```

The following pattern is _not_ considered a problem:

<!-- prettier-ignore -->
```css
a {
  color: currentColor;
}
```

The following pattern is considered a problem:

<!-- prettier-ignore -->
```css
a {
  color: currentcolor;
}
```
