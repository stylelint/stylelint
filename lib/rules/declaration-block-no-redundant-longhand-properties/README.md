# declaration-block-no-redundant-longhand-properties

Disallow redundant longhand properties within declaration-block.

<!-- prettier-ignore -->
```css
  a {
    padding-top: 1px;
    padding-right: 2px;
    padding-bottom: 3px;
    padding-left: 4px; }
/** ↑
 *  These longhand properties */
```

The longhand properties in the example above can be more concisely written as:

<!-- prettier-ignore -->
```css
a {
  padding: 1px 2px 3px 4px;
}
```

This rule will only complain if you've used the longhand equivalent of _all_ the properties that the shorthand will set and if their values are not [CSS-wide keywords](https://www.w3.org/TR/css-values/#common-keywords) like `initial`, `inherit` etc.

This rule complains when the following shorthand properties can be used:

- `animation`
- `background`
- `border`
- `border-block`
- `border-block-end`
- `border-block-start`
- `border-bottom`
- `border-color`
- `border-image`
- `border-inline`
- `border-inline-end`
- `border-inline-start`
- `border-left`
- `border-radius`
- `border-right`
- `border-style`
- `border-top`
- `border-width`
- `column-rule`
- `columns`
- `flex`
- `flex-flow`
- `font`
- `font-synthesis`
- `font-variant`
- `gap`
- `grid`
- `grid-area`
- `grid-column`
- `grid-gap`
- `grid-row`
- `grid-template`
- `inset`
- `inset-block`
- `inset-inline`
- `list-style`
- `margin`
- `margin-block`
- `margin-inline`
- `mask`
- `outline`
- `overflow`
- `overscroll-behavior`
- `padding`
- `padding-block`
- `padding-inline`
- `place-content`
- `place-items`
- `place-self`
- `scroll-margin`
- `scroll-margin-block`
- `scroll-margin-inline`
- `scroll-padding`
- `scroll-padding-block`
- `scroll-padding-inline`
- `text-decoration`
- `text-emphasis`
- `transition`

> [!WARNING]
> Please note that properties are considered to be redundant if they may be written shorthand according to the specification, **regardless of the behavior of any individual browser**. For example, due to Internet Explorer's implementation of Flexbox, [it may not be possible to use the shorthand property `flex`](https://github.com/philipwalton/flexbugs#flexbug-8), but the longhand form is still considered a problem.

Flexbox-related properties can be ignored using `ignoreShorthands: ["/flex/"]` (see below).

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix most of the problems reported by this rule.

## Options

### `true`

```json
{
  "declaration-block-no-redundant-longhand-properties": true
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a {
  margin-top: 1px;
  margin-right: 2px;
  margin-bottom: 3px;
  margin-left: 4px;
}
```

<!-- prettier-ignore -->
```css
a {
  font-style: italic;
  font-variant: normal;
  font-weight: bold;
  font-stretch: normal;
  font-size: 14px;
  line-height: 1.2;
  font-family: serif;
}
```

<!-- prettier-ignore -->
```css
a {
  -webkit-transition-property: top;
  -webkit-transition-duration: 2s;
  -webkit-transition-timing-function: ease;
  -webkit-transition-delay: 0.5s;
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {
  margin: 1px 2px 3px 4px;
}
```

<!-- prettier-ignore -->
```css
a {
  font: italic normal bold normal 14px/1.2 serif;
}
```

<!-- prettier-ignore -->
```css
a {
  -webkit-transition: top 2s ease 0.5s;
}
```

<!-- prettier-ignore -->
```css
a {
  margin-top: 1px;
  margin-right: 2px;
}
```

<!-- prettier-ignore -->
```css
a {
  margin-top: 1px;
  margin-right: 2px;
  margin-bottom: 3px;
}
```

## Optional secondary options

### `ignoreLonghands`

```json
{ "ignoreLonghands": ["array", "of", "properties"] }
```

Ignore the specified longhand properties.

Given:

```json
{
  "declaration-block-no-redundant-longhand-properties": [
    true,
    {
      "ignoreLonghands": [
        "text-decoration-thickness",
        "background-size",
        "background-origin",
        "background-clip"
      ]
    }
  ]
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a {
  text-decoration-line: underline;
  text-decoration-style: solid;
  text-decoration-color: purple;
}
```

<!-- prettier-ignore -->
```css
a {
  background-repeat: repeat;
  background-attachment: scroll;
  background-position: 0% 0%;
  background-color: transparent;
  background-image: none;
  background-size: contain;
  background-origin: border-box;
  background-clip: text;
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {
  text-decoration: underline solid purple;
  text-decoration-thickness: 1px;
}
```

<!-- prettier-ignore -->
```css
a {
  background: none 0% 0% repeat scroll transparent;
  background-size: contain;
  background-origin: border-box;
  background-clip: text;
}
```

### `ignoreShorthands`

```json
{ "ignoreShorthands": ["array", "of", "shorthands", "/regex/"] }
```

Ignore the specified shorthand properties.

Given:

```json
{
  "declaration-block-no-redundant-longhand-properties": [
    true,
    { "ignoreShorthands": ["padding", "/border/"] }
  ]
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {
  padding-top: 20px;
  padding-right: 10px;
  padding-bottom: 30px;
  padding-left: 10px;
}
```

<!-- prettier-ignore -->
```css
a {
  border-top-width: 1px;
  border-bottom-width: 1px;
  border-left-width: 1px;
  border-right-width: 1px;
}
```

<!-- prettier-ignore -->
```css
a {
  border-top-color: green;
  border-top-style: double;
  border-top-width: 7px;
}
```
