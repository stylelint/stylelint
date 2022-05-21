# import-notation

Specify string or url notation for imports.

<!-- prettier-ignore -->
```css
@import url("x.jpg");
/**     ↑
 *      Url */
```

<!-- prettier-ignore -->
```css
@import "x.jpg";
/**     ↑
 *      String */
```

## Options

`string`: `"string"|"url"`

### `"string"`

Imports _must_ be a _string_.

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
@import url(foo.css);
```

<!-- prettier-ignore -->
```css
@import url('foo.css');
```

<!-- prettier-ignore -->
```css
@import url("foo.css");
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@import foo.css;
```

<!-- prettier-ignore -->
```css
@import 'foo.css';
```

<!-- prettier-ignore -->
```css
@import "foo.css";
```

### `"url"`

Imports _must_ use the `url` function.

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
@import foo.css;
```

<!-- prettier-ignore -->
```css
@import 'foo.css';
```

<!-- prettier-ignore -->
```css
@import "foo.css";
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@import url(foo.css);
```

<!-- prettier-ignore -->
```css
@import url('foo.css');
```

<!-- prettier-ignore -->
```css
@import url("foo.css");
```
