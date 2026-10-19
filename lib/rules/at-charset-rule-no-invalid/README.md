# at-charset-rule-no-invalid

Disallow invalid `@charset` rules.

<!-- prettier-ignore -->
```css
    @charset "utf-8";
/** ↑
 * This @charset rule */
```

The `@charset` rule is not an at-rule. It's a byte sequence that browsers look for at the very start of a stylesheet, as defined in the [CSS Syntax Level 3](https://drafts.csswg.org/css-syntax/#determine-the-fallback-encoding) specification.

It must be written as `@charset`, followed by a single space, followed by the encoding label in double quotes, followed by a semicolon. Anything else is ignored by browsers, which then fall back to another encoding.

It must also be the first thing in the stylesheet, and it has no effect when the file starts with a byte order mark, as the mark takes precedence over it.

> [!WARNING]
> This rule is only appropriate for CSS files. You should not turn it on for CSS-like languages, such as SCSS or Less, or for CSS embedded in another language, such as HTML.

This rule supports 1 [message argument](../../../docs/user-guide/configure.md#message): the reason the `@charset` rule is invalid.

## Options

### `true`

```json
{
  "at-charset-rule-no-invalid": true
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
@charset 'utf-8';
```

<!-- prettier-ignore -->
```css
@CHARSET "utf-8";
```

<!-- prettier-ignore -->
```css
@charset  "utf-8";
```

<!-- prettier-ignore -->
```css
@charset "utf-8" ;
```

<!-- prettier-ignore -->
```css
/* foo */
@charset "utf-8";
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@charset "utf-8";
```

<!-- prettier-ignore -->
```css
@charset "utf-8";
/* foo */
```
