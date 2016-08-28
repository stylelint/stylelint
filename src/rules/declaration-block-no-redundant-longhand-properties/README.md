# declaration-block-no-redundant-longhand-properties

Disallow longhand properties that can be combined into one shorthand property.

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

```css
a {
  padding: 1px 2px 3px 4px;
}
```

This rule will only warn if you've used the longhand equivalent of *all* the properties that the shorthand will set.

This rule warns when the following shorthand properties can be used:

-   `padding`
-   `margin`
-   `background`
-   `font`
-   `border`
-   `border-top`
-   `border-bottom`
-   `border-left`
-   `border-right`
-   `border-width`
-   `border-style`
-   `border-color`
-   `border-radius`
-   `transition`

## Options

### `true`

The following patterns are considered warnings:

```css
a {
  margin-top: 1px;
  margin-right: 2px;
  margin-bottom: 3px;
  margin-left: 4px;
}
```

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

```css
a {
  -webkit-transition-property: top;
  -webkit-transition-duration: 2s;  
  -webkit-transition-timing-function: ease;
  -webkit-transition-delay: 0.5s;
}
```

The following patterns are *not* considered warnings:

```css
a {
  margin: 1px 2px 3px 4px;
}
```

```css
a {
  font: italic normal bold normal 14px/1.2 serif;
}
```

```css
a {
  -webkit-transition: top 2s ease 0.5s;
}
```

```css
a {
  margin-top: 1px;
  margin-right: 2px;
}
```

```css
a {
  margin-top: 1px;
  margin-right: 2px;
  margin-bottom: 3px;
}
```

## Optional secondary options

### `ignoreShorthands: ["/regex/", "string"]`

Given:

```js
["padding", "/border/"]
```

The following patterns are *not* considered warnings:

```css
a {
  padding-top: 20px;
  padding-right: 10px;
  padding-bottom: 30px;
  padding-left: 10px;
}
```

```css
a {
  border-top-width: 1px;
  border-bottom-width: 1px;
  border-left-width: 1px;
  border-right-width: 1px;
}
```

```css
a {
  border-top-width: 1px;
  border-bottom-width: 1px;
  border-left-width: 1px;
  border-right-width: 1px;
}
```

```css
a {
  border-top-color: green;
  border-top-style: double;
  border-top-width: 7px;
}
```
