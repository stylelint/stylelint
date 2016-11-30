# string-quotes

Specify single or double quotes around strings.

```css
a[id="foo"] { content: "x"; }
/**  ↑   ↑             ↑ ↑
 * These quotes and these quotes */
```

Quotes within comments are ignored.

```css
/* "This is fine" */
/* 'And this is also fine' */
```

## Options

`string`: `"single"|"double"`

### `"single"`

Strings *must always* be wrapped with single quotes.

The following patterns are considered warnings:

```css
a { content: "x"; }
```

```css
a[id="foo"] {}
```

The following patterns are *not* considered warnings:

```css
a { content: 'x'; }
```

```css
a[id='foo'] {}
```

### `"double"`

Strings *must always* be wrapped with double quotes.

The following patterns are considered warnings:

```css
a { content: 'x'; }
```

```css
a[id='foo'] {}
```

The following patterns are *not* considered warnings:

```css
a { content: "x"; }
```

```css
a[id="foo"] {}
```
