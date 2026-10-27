# no-invalid-double-slash-comments

Disallow invalid double-slash comments.

<!-- prettier-ignore -->
```css
a {
  //color: pink;
}
/** ↑
 *  This comment */
```

You can use this rule to avoid declarations that browsers ignore. CSS doesn't support `//` comments, so a comment [becomes part of the next declaration or selector](https://stackoverflow.com/a/20192639/130652) and invalidates it.

If you are using a preprocessor that allows `//` single-line comments (e.g. Sass, Less, Stylus), this rule will not complain about those. They are compiled into standard CSS comments by your preprocessor, so Stylelint will consider them valid. This rule only complains about the lesser-known method of using `//` to "comment out" a single-line of code in regular CSS. (If you didn't know this was possible, have a look at ["Single Line Comments (//) in CSS"](http://www.xanthir.com/b4U10)).

This rule doesn't have any [message arguments](../../../docs/user-guide/configure.md#message).

## Options

### `true`

```json
{
  "no-invalid-double-slash-comments": true
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a {
  //color: pink;
}
```

<!-- prettier-ignore -->
```css
//a { color: pink; }
```

<!-- prettier-ignore -->
```css
// Comment {}
a {
  color: pink;
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {
  /* color: pink; */
}
```

<!-- prettier-ignore -->
```css
/* a { color: pink;  } */
```
