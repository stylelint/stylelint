# no-irregular-whitespace

Disallow irregular whitespace

<!-- prettier-ignore -->
```css
    .firstClass .secondClass {}
/************* ↑
 * Irregular whitespace. Selector would fail to match '.firstClass' */
```

## Options

### `true`

The following patterns are considered violations:

<!-- prettier-ignore -->
```css
  .firstClass .secondClass {}
```

The following patterns are _not_ considered violations:

<!-- prettier-ignore -->
```css
  .firstClass .secondClass { /* Writing comments with irregular whitespaces */ }
```

## Optional secondary options

### `allow: ["\u0085"]`

The members of the array will be ignored by the rule

For example with `"/u180E"`

Given:

```
["/u180E"]
```

The following pattern are considered violation:

<!-- prettier-ignore -->
```css
a[title="irregular' + '\u00A0' + 'whitespace"] { color: pink; }
```

The following pattern is _not_ considered violation:

<!-- prettier-ignore -->
```css
a[title="irregular' + '\u180E' + 'whitespace"] { color: pink; }
```

### `only: ["\00A0"]`

Only the members of the array will detected by the rule (see `Unicode reference of irregular whitespaces`)

For example with `"/00A0"`

Given:

```
["/00A0"]
```

The following pattern are considered violation:

<!-- prettier-ignore -->
```css
a[title="irregular' + '\u00A0' + 'whitespace"] { color: pink; }
```

The following patterns is _not_ considered violation:

<!-- prettier-ignore -->
```css
a[title="irregular' + '\u180E' + 'whitespace"] { color: pink; }
```

<!-- prettier-ignore -->
```css
a[title="irregular' + '\u2002' + 'whitespace"] { color: pink; }
```

## Unicode reference of irregular whitespaces

\u000B - Line Tabulation (\v) - <VT>
\u000C - Form Feed (\f) - <FF>
\u00A0 - No-Break Space - <NBSP>
\u0085 - Next Line
\u1680 - Ogham Space Mark
\u180E - Mongolian Vowel Separator - <MVS>
\ufeff - Zero Width No-Break Space - <BOM>
\u2000 - En Quad
\u2001 - Em Quad
\u2002 - En Space - <ENSP>
\u2003 - Em Space - <EMSP>
\u2004 - Tree-Per-Em
\u2005 - Four-Per-Em
\u2006 - Six-Per-Em
\u2007 - Figure Space
\u2008 - Punctuation Space - <PUNCSP>
\u2009 - Thin Space
\u200A - Hair Space
\u200B - Zero Width Space - <ZWSP>
\u2028 - Line Separator
\u2029 - Paragraph Separator
\u202F - Narrow No-Break Space
\u205f - Medium Mathematical Space
\u3000 - Ideographic Space
