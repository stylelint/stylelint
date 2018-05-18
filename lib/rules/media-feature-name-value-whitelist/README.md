# media-feature-name-value-whitelist

Specify a whitelist of allowed media feature and value pairs.

```css
@media screen and (min-width: 768px) {}
/**                    ↑        ↑
 *         These features and these values */
```

**Caveat:** Media feature names within range or boolean context are ignored.

## Options

```json
{
  "max-width": ["Array", "of", "values"],
  "/regex/": ["/regex/", "non-regex"]
}
```

If a media feature is found, only its whitelisted property values are allowed. The rule reports all
non-matching values.

If a property or value is surrounded with `/` (e.g. `"/width$/"`), it is interpreted as a regular
expression. For example, `/width$/` will match `max-width` and `min-width`.

## Examples

Given
```json
{
  "min-width": ["768px"],
  "/resolution/": ["/dpcm$/"]
}
```

The following pattern are considered violations:

```css
@media screen and (min-width: 1000px) {}
```

```css
@media screen and (min-resolution: 2dpi) {}
```

The following patterns are *not* considered violations:

```css
@media screen and (min-width: 768px) {}
```

```css
@media screen and (orientation: portrait) {}
```

```css
@media screen and (min-resolution: 2dpcm) {}
```

```css
@media screen and (resolution: 10dpcm) {}
```
