# 규칙

린터가 규칙에 따라 흡족하는지 결정합니다. 모든 규칙은 기본적으로 해제되어 있으며 해당 옵션에 대한 기본값은 없습니다. 규칙은 일관된 이름 지정 규칙을 따르며 서로 연동되도록 설계되었습니다. ["About rules"](about-rules.md)섹션에서 이에 대한 자세한 내용을 읽을 수 있습니다 .

기본 내장 규칙은 표준 CSS 구문에 맞춰져 있습니다. `indentation`규칙을 제외하고 모든 규칙은 비표준 구문 (예: 변수 보간 및 믹스 인)이 포함 된 구조를 무시합니다.

이러한 규칙 외에도 [플러그인](plugins.md)이 있습니다, 이것은 방법론, 도구, *비표준*CSS 기능 또는 매우 구체적인 사례를 지원하는 커뮤니티에 의해서 구축 된 규칙입니다. 린트의 더 많은 방법에 대한 [플러그인](plugins.md)의 목록을 잊지 말고 확인하세요.

다른 언어로 읽기: [English](./rules.md)

## 규칙목록

다음은 stylelint 내의 모든 규칙 을 [범주](../../VISION.md) 별로 그룹화 한 다음 적용 대상별로 [*그룹화 한 것*](http://apps.workflower.fi/vocabs/css/en) 입니다.

-   [오류 가능성](#오류-가능성)
-   [언어 기능 제한](#언어-기능-제한)
-   [문체 이슈](#문체-이슈)

### 오류 가능성

#### 색상

-   [`color-no-invalid-hex`](../../lib/rules/color-no-invalid-hex/README.md): 잘못된 16진수 색상 허용 안함.

#### 폰트모음

-   [`font-family-no-duplicate-names`](../../lib/rules/font-family-no-duplicate-names/README.md): 글꼴 모음에서 이름 중복을 허용 안함.
-   [`font-family-no-missing-generic-family-keyword`](../../lib/rules/font-family-no-missing-generic-family-keyword/README.md): 글꼴 모음의 목록에서 일반 글꼴 누락금지.

#### 함수

-   [`function-calc-no-invalid`](../../lib/rules/function-calc-no-invalid/README.md): `calc` 함수 내에서 잘못된 식을 허용하지 않음.
-   [`function-calc-no-unspaced-operator`](../../lib/rules/function-calc-no-unspaced-operator/README.md): `calc` 함수 내에서 간격 없는 연산자 허용 안함.
-   [`function-linear-gradient-no-nonstandard-direction`](../../lib/rules/function-linear-gradient-no-nonstandard-direction/README.md): [표준 구문](https://developer.mozilla.org/en-US/docs/Web/CSS/linear-gradient#Syntax)에 따라 유효하지 않는 `linear-gradient()`호출의 방향 값을 허용하지 않음.

#### 글자

-   [`string-no-newline`](../../lib/rules/string-no-newline/README.md): string에 새줄을 허용하지 않음.

#### 단위

-   [`unit-no-unknown`](../../lib/rules/unit-no-unknown/README.md): 알 수 없는 단위 허용 안함.

#### 특성

-   [`property-no-unknown`](../../lib/rules/property-no-unknown/README.md): 알 수 없는 속성 허용 안함.

#### 키프레임 선언

-   [`keyframe-declaration-no-important`](../../lib/rules/keyframe-declaration-no-important/README.md): keyframe에서 `!important`를 허용하지 않음.

#### 선언 블록

-   [`declaration-block-no-duplicate-properties`](../../lib/rules/declaration-block-no-duplicate-properties/README.md): 선언 블록 내에서 중복 속성 허용 안함.
-   [`declaration-block-no-shorthand-property-overrides`](../../lib/rules/declaration-block-no-shorthand-property-overrides/README.md): 관련 Longhand 속성을 재정의하는 Shorthand 속성을 허용 금지.

#### 블록

-   [`block-no-empty`](../../lib/rules/block-no-empty/README.md): 빈 블록 허용 안함.

#### 선택자

-   [`selector-pseudo-class-no-unknown`](../../lib/rules/selector-pseudo-class-no-unknown/README.md): 알 수 없는 가상 클래스 선택자 허용 안함.
-   [`selector-pseudo-element-no-unknown`](../../lib/rules/selector-pseudo-element-no-unknown/README.md): 알 수 없는 가상 요소 선택자 허용 안함.
-   [`selector-type-no-unknown`](../../lib/rules/selector-type-no-unknown/README.md): 알 수 없는 유형 선택자 허용 안함.

#### 미디어 기능

-   [`media-feature-name-no-unknown`](../../lib/rules/media-feature-name-no-unknown/README.md): 알 수 없는 미디어 기능 이름 허용 안함.

#### @규칙

-   [`at-rule-no-unknown`](../../lib/rules/at-rule-no-unknown/README.md): 알 수 없는 @-규칙 허용 안함.

#### 주석

-   [`comment-no-empty`](../../lib/rules/comment-no-empty/README.md): 빈 주석 허용 안함.

#### 일반 / 시트

-   [`no-descending-specificity`](../../lib/rules/no-descending-specificity/README.md): 더 높은 특성의 선택자를 재정의한 후 낮은 특성의 선택자가 오는 것을 허용하지 않음.
-   [`no-duplicate-at-import-rules`](../../lib/rules/no-duplicate-at-import-rules/README.md): 스타일시트 내에 중복된 `@import` 규칙을 허용하지 않음.
-   [`no-duplicate-selectors`](../../lib/rules/no-duplicate-selectors/README.md): 스타일시트 내에서 중복 선택자 사용 안 함.
-   [`no-empty-source`](../../lib/rules/no-empty-source/README.md): 빈 소스를 허용하지 않습니다.
-   [`no-extra-semicolons`](../../lib/rules/no-extra-semicolons/README.md): 세미콜론 추가 허용 안함 (자동 수정 가능).
-   [`no-invalid-double-slash-comments`](../../lib/rules/no-invalid-double-slash-comments/README.md): CSS에서 지원하지 않는 이중 슬래시 주석 (`//...`) 허용 안함.

### 언어 기능 제한

#### 색상

-   [`color-named`](../../lib/rules/color-named/README.md): 적용이 가능한 곳에서 색상의 이름을 요구하거나 금지.
-   [`color-no-hex`](../../lib/rules/color-no-hex/README.md): 16 진수 색상 허용 안함.

#### 함수

-   [`function-blacklist`](../../lib/rules/function-blacklist/README.md): 허용되지 않는 기능의 블랙리스트 지정.
-   [`function-url-no-scheme-relative`](../../lib/rules/function-url-no-scheme-relative/README.md): scheme-relative url 허용 안함.
-   [`function-url-scheme-blacklist`](../../lib/rules/function-url-scheme-blacklist/README.md): 허용되지 않는 URL 스키마의 블랙리스트를 지정.
-   [`function-url-scheme-whitelist`](../../lib/rules/function-url-scheme-whitelist/README.md): 허용되는 URL 스키마의 화이트리스트를 지정.
-   [`function-whitelist`](../../lib/rules/function-whitelist/README.md): 허용되는 기능의 화이트리스트 지정.

#### 키프레임

-   [`keyframes-name-pattern`](../../lib/rules/keyframes-name-pattern/README.md): 키 프레임 이름의 패턴을 지정.

#### 숫자

-   [`number-max-precision`](../../lib/rules/number-max-precision/README.md): 숫자로 허용되는 소수점 이하 자릿수 제한.

#### 시간

-   [`time-min-milliseconds`](../../lib/rules/time-min-milliseconds/README.md): 시간 값의 최소 밀리 초 수를 지정.

#### 단위

-   [`unit-blacklist`](../../lib/rules/unit-blacklist/README.md): 허용되지 않는 단위의 블랙리스트를 지정.
-   [`unit-whitelist`](../../lib/rules/unit-whitelist/README.md): 허용되는 유닛의 화이트리스트를 지정.

#### 단축 특성

-   [`shorthand-property-no-redundant-values`](../../lib/rules/shorthand-property-no-redundant-values/README.md): Shorthand 속성에서 중복 값을 허용하지 않음 (자동 수정 가능).

#### 값

-   [`value-no-vendor-prefix`](../../lib/rules/value-no-vendor-prefix/README.md): 벤더(vendor) 접두사 값을 허용 안함.

#### 맟춤 특성

-   [`custom-property-pattern`](../../lib/rules/custom-property-pattern/README.md): 사용자 정의 특성의 패턴을 지정.

#### 특성

-   [`property-blacklist`](../../lib/rules/property-blacklist/README.md): 허용되지 않는 속성의 블랙리스트를 지정.
-   [`property-no-vendor-prefix`](../../lib/rules/property-no-vendor-prefix/README.md): 속성의 벤더(vendor) 접두사 허용 안 함.
-   [`property-whitelist`](../../lib/rules/property-whitelist/README.md): 허용 되는 속성의 화이트리스트를 지정.

#### 선언

-   [`declaration-block-no-redundant-longhand-properties`](../../lib/rules/declaration-block-no-redundant-longhand-properties/README.md): 1 개의 Longhand 속성에 결합 할 수 있는 Shorthand 속성들을 허용하지 않음.
-   [`declaration-no-important`](../../lib/rules/declaration-no-important/README.md): 선언에서 `!important`을 허용하지 않음.
-   [`declaration-property-unit-blacklist`](../../lib/rules/declaration-property-unit-blacklist/README.md): 선언에서 허용되지 않은 속성 및 유닛의 블랙리스트를 지정.
-   [`declaration-property-unit-whitelist`](../../lib/rules/declaration-property-unit-whitelist/README.md): 선언에서 허용되는 속성 및 유닛의 화이트리스트를 지정.
-   [`declaration-property-value-blacklist`](../../lib/rules/declaration-property-value-blacklist/README.md): 선언에서 허용되지 않은 속성 값의 블랙리스트를 지정.
-   [`declaration-property-value-whitelist`](../../lib/rules/declaration-property-value-whitelist/README.md): 선언에서 허용되는 속성과 값의 화이트리스트를 지정.

#### 선언 블록

-   [`declaration-block-single-line-max-declarations`](../../lib/rules/declaration-block-single-line-max-declarations/README.md): 한 줄 선언 블록 내 선언 수를 제한.

#### 선택자

-   [`selector-attribute-operator-blacklist`](../../lib/rules/selector-attribute-operator-blacklist/README.md): 허용되지 않는 속성 연산자의 블랙리스트를 지정.
-   [`selector-attribute-operator-whitelist`](../../lib/rules/selector-attribute-operator-whitelist/README.md): 허용되는 속성 연산자의 화이트리스트를 지정.
-   [`selector-class-pattern`](../../lib/rules/selector-class-pattern/README.md): 클래스 선택의 패턴을 지정.
-   [`selector-combinator-blacklist`](../../lib/rules/selector-combinator-blacklist/README.md): 허용되지 않는 인접 형제 선택자의 블랙리스트를 지정.
-   [`selector-combinator-whitelist`](../../lib/rules/selector-combinator-whitelist/README.md): 허용되는 인접 형제 선택자의 허용 목록을 지정.
-   [`selector-id-pattern`](../../lib/rules/selector-id-pattern/README.md): ID 선택자의 패턴을 지정.
-   [`selector-max-attribute`](../../lib/rules/selector-max-attribute/README.md): 선택자의 속성 선택자 수를 제한.
-   [`selector-max-class`](../../lib/rules/selector-max-class/README.md): 선택자의 클래스 수를 제한.
-   [`selector-max-combinators`](../../lib/rules/selector-max-combinators/README.md): 선택자의 인접/일반 형제 선택자 수를 제한합니다.
-   [`selector-max-compound-selectors`](../../lib/rules/selector-max-compound-selectors/README.md): 선택자에서 복합 선택자의 수를 제한.
-   [`selector-max-empty-lines`](../../lib/rules/selector-max-empty-lines/README.md): 선택자 내의 인접한 빈 줄 수를 제한 (자동 수정 가능).
-   [`selector-max-id`](../../lib/rules/selector-max-id/README.md): 선택자의 ID 선택자 수를 제한.
-   [`selector-max-pseudo-class`](../../lib/rules/selector-max-pseudo-class/README.md): 선택자의 유사 클래스 수를 제한.
-   [`selector-max-specificity`](../../lib/rules/selector-max-specificity/README.md): 선택자의 특이성을 제한.
-   [`selector-max-type`](../../lib/rules/selector-max-type/README.md): 선택자의 유형 수를 제한.
-   [`selector-max-universal`](../../lib/rules/selector-max-universal/README.md): 선택자의 범용 선택자 수를 제한.
-   [`selector-nested-pattern`](../../lib/rules/selector-nested-pattern/README.md): 규칙 내에 중첩 된 규칙 선택자의 패턴을 지정.
-   [`selector-no-qualifying-type`](../../lib/rules/selector-no-qualifying-type/README.md): 유형별로 선택자를 한정 할 수 없음.
-   [`selector-no-vendor-prefix`](../../lib/rules/selector-no-vendor-prefix/README.md): 선택자에 벤더(vendor) 접두사를 허용하지 않음.
-   [`selector-pseudo-class-blacklist`](../../lib/rules/selector-pseudo-class-blacklist/README.md): 허용되지 않는 가상 클래스 선택자의 블랙리스트를 지정.
-   [`selector-pseudo-class-whitelist`](../../lib/rules/selector-pseudo-class-whitelist/README.md): 허용되는 가상 클래스 선택자의 화이트리스트를 지정.
-   [`selector-pseudo-element-blacklist`](../../lib/rules/selector-pseudo-element-blacklist/README.md): 허용되지 않는 가상 요소 선택자의 블랙리스트를 지정.
-   [`selector-pseudo-element-whitelist`](../../lib/rules/selector-pseudo-element-whitelist/README.md): 허용되는 가상 요소 선택자의 화이트리스트를 지정.

#### 미디어 기능

-   [`media-feature-name-blacklist`](../../lib/rules/media-feature-name-blacklist/README.md): 허용되지 않는 미디어 기능 이름의 블랙리스트를 지정.
-   [`media-feature-name-no-vendor-prefix`](../../lib/rules/media-feature-name-no-vendor-prefix/README.md): 미디어 기능 이름에 대한 벤더(vendor) 접두사를 허용하지 않음.
-   [`media-feature-name-value-whitelist`](../../lib/rules/media-feature-name-value-whitelist/README.md): 허용되는 미디어 기능 이름 및 값의 화이트리스트를 지정.
-   [`media-feature-name-whitelist`](../../lib/rules/media-feature-name-whitelist/README.md): 허용되는 미디어 기능 이름의 화이트리스트를 지정.

#### 맞춤 미디어

-   [`custom-media-pattern`](../../lib/rules/custom-media-pattern/README.md): 사용자 정의 매체 조회 이름의 패턴을 지정.

#### @규칙

-   [`at-rule-blacklist`](../../lib/rules/at-rule-blacklist/README.md): 허용되지 않는 @-규칙의 블랙리스트를 지정.
-   [`at-rule-no-vendor-prefix`](../../lib/rules/at-rule-no-vendor-prefix/README.md): @-규칙에 대한 공급 업체 접두사를 허용하지 않음.
-   [`at-rule-property-requirelist`](../../lib/rules/at-rule-property-requirelist/README.md): @-규칙에 대한 특성의 필수 목록을 지정.
-   [`at-rule-whitelist`](../../lib/rules/at-rule-whitelist/README.md): 허용 된 @-규칙의 허용 목록을 지정.

#### 주석

-   [`comment-word-blacklist`](../../lib/rules/comment-word-blacklist/README.md): 주석 내에 허용되지 않는 단어의 블랙리스트를 지정.

#### 일반 / 시트

-   [`max-nesting-depth`](../../lib/rules/max-nesting-depth/README.md): 중첩 깊이를 제한.
-   [`no-unknown-animations`](../../lib/rules/no-unknown-animations/README.md): 알 수없는 애니메이션을 허용하지 않음.

### 문체 이슈

#### 색상

-   [`color-hex-case`](../../lib/rules/color-hex-case/README.md): 16 진수 색상에 소문자 또는 대문자를 지정 (자동 수정 가능).
-   [`color-hex-length`](../../lib/rules/color-hex-length/README.md): 16 진수 색상에 대해 짧거나 긴 표기법을 지정 (자동 수정 가능).

#### 폰트 모음

-   [`font-family-name-quotes`](../../lib/rules/font-family-name-quotes/README.md): 글꼴 모음 이름 주위에 따옴표를 사용해야하는지 여부를 지정.

#### 폰트 굵기

-   [`font-weight-notation`](../../lib/rules/font-weight-notation/README.md): 숫자 또는 이름(가능한 경우) `font-weight` 값이 필요합니다. 또한 이름값이 필요한 경우에는 유효한 이름만 필요.

#### 함수

-   [`function-comma-newline-after`](../../lib/rules/function-comma-newline-after/README.md): 함수 쉼표 뒤에 줄바꿈 문자를 입력하거나 공백을 허용하지 않음 (자동 수정 가능).
-   [`function-comma-newline-before`](../../lib/rules/function-comma-newline-before/README.md): 함수의 쉼표 앞에 줄바꿈 문자를 입력하거나 공백을 허용하지 않음 (자동 수정 가능).
-   [`function-comma-space-after`](../../lib/rules/function-comma-space-after/README.md): 함수 쉼표 뒤에 공백이 하나만 있거나 공백이 허용되지 않음 (자동 수정 가능).
-   [`function-comma-space-before`](../../lib/rules/function-comma-space-before/README.md): 함수 쉼표 앞에 공백이 하나만 있거나 공백이 없어야 함 (자동 수정 가능).
-   [`function-max-empty-lines`](../../lib/rules/function-max-empty-lines/README.md): 함수 내에서 인접한 빈 줄 수를 제한 (자동 수정 가능).
-   [`function-name-case`](../../lib/rules/function-name-case/README.md): 기능 이름에 소문자 또는 대문자를 지정 (자동 수정 가능).
-   [`function-parentheses-newline-inside`](../../lib/rules/function-parentheses-newline-inside/README.md): 함수 괄호 내부에 줄 바꿈이 필요하거나 공백을 허용하지 않음 (자동 수정 가능).
-   [`function-parentheses-space-inside`](../../lib/rules/function-parentheses-space-inside/README.md): 함수 괄호 안에 공백이 하나만 있거나 공백이 없어야 함 (자동 수정 가능).
-   [`function-url-quotes`](../../lib/rules/function-url-quotes/README.md): URL에 대한 따옴표가 필요하거나 허용하지 않음.
-   [`function-whitespace-after`](../../lib/rules/function-whitespace-after/README.md): 기능 다음에 공백이 필요하거나 허용되지 않음 (자동 수정 가능).

#### 슷지

-   [`number-leading-zero`](../../lib/rules/number-leading-zero/README.md): 1보다 작은 소수의 경우 앞에 0을 요구하거나 허용하지 않음 (자동 수정 가능).
-   [`number-no-trailing-zeros`](../../lib/rules/number-no-trailing-zeros/README.md): 숫자의 후행 0을 허용하지 않음 (자동 수정 가능).

#### 글자

-   [`string-quotes`](../../lib/rules/string-quotes/README.md): 문자열 주위에 작은 따옴표 혹은 큰 따옴표를 지정 (자동 수정 가능).

#### 길이

-   [`length-zero-no-unit`](../../lib/rules/length-zero-no-unit/README.md): 길이가 0 인 단위를 허용하지 않음 (자동 수정 가능).

#### 단위

-   [`unit-case`](../../lib/rules/unit-case/README.md): 단위에 소문자 또는 대문자를 지정 (자동 수정 가능).

#### 값

-   [`value-keyword-case`](../../lib/rules/value-keyword-case/README.md): 키워드 값에 소문자 또는 대문자를 지정 (자동 수정 가능).

#### 값 리스트

-   [`value-list-comma-newline-after`](../../lib/rules/value-list-comma-newline-after/README.md): 값 목록의 쉼표 뒤에 줄바꿈 문자를 입력하거나 공백을 허용하지 않음 (자동 수정 가능).
-   [`value-list-comma-newline-before`](../../lib/rules/value-list-comma-newline-before/README.md): 값 목록의 쉼표 앞에 줄바꿈 문자를 입력하거나 공백을 허용하지 않음.
-   [`value-list-comma-space-after`](../../lib/rules/value-list-comma-space-after/README.md): 값 목록의 쉼표 뒤에 단일 공백이 필요하거나 공백이 허용되지 않음 (자동 수정 가능).
-   [`value-list-comma-space-before`](../../lib/rules/value-list-comma-space-before/README.md): 값 목록의 쉼표 앞에 단일 공백이 필요하거나 공백이 허용되지 않음 (자동 수정 가능).
-   [`value-list-max-empty-lines`](../../lib/rules/value-list-max-empty-lines/README.md): 값 목록에서 인접한 빈 줄 수를 제한 (자동 수정 가능).

#### 맞춤 특성

-   [`custom-property-empty-line-before`](../../lib/rules/custom-property-empty-line-before/README.md): 사용자 지정 속성 앞에 빈 줄을 요구하거나 허용하지 않음 (자동 수정 가능).

#### 특성

-   [`property-case`](../../lib/rules/property-case/README.md): 특성에 소문자 또는 대문자를 지정 (자동 수정 가능).

#### 선언

-   [`declaration-bang-space-after`](../../lib/rules/declaration-bang-space-after/README.md): 선언 후 공백이 필요하지 않거나 공백을 허용하지 않음 (자동 수정 가능).
-   [`declaration-bang-space-before`](../../lib/rules/declaration-bang-space-before/README.md): 선언하기 전에 단일 공백이 필요하거나 공백을 허용하지 않음 (자동 수정 가능).
-   [`declaration-colon-newline-after`](../../lib/rules/declaration-colon-newline-after/README.md): 선언 콜론 다음에 줄 바꿈이 필요하거나 공백을 허용하지 않음 (자동 수정 가능).
-   [`declaration-colon-space-after`](../../lib/rules/declaration-colon-space-after/README.md): 선언 콜론 뒤에 단일 공백이 필요하거나 공백을 허용하지 않음 (자동 수정 가능).
-   [`declaration-colon-space-before`](../../lib/rules/declaration-colon-space-before/README.md): 선언 콜론 앞에 단일 공백이 필요하거나 공백을 허용하지 않음 (자동 수정 가능).
-   [`declaration-empty-line-before`](../../lib/rules/declaration-empty-line-before/README.md): 선언하기 전에 빈 줄을 요구하거나 허용하지 않음 (자동 수정 가능).

#### 선언 블록

-   [`declaration-block-semicolon-newline-after`](../../lib/rules/declaration-block-semicolon-newline-after/README.md): 선언 블록의 세미콜론 다음에 줄 바꿈이 필요하거나 공백이 허용되지 않음 (자동 수정 가능).
-   [`declaration-block-semicolon-newline-before`](../../lib/rules/declaration-block-semicolon-newline-before/README.md): 선언 블록의 세미콜론 앞에 개행 문자를 입력하거나 공백을 허용하지 않음.
-   [`declaration-block-semicolon-space-after`](../../lib/rules/declaration-block-semicolon-space-after/README.md): 선언 블록의 세미콜론 다음에 단일 공백이 필요하거나 공백이 허용되지 않음 (자동 수정 가능).
-   [`declaration-block-semicolon-space-before`](../../lib/rules/declaration-block-semicolon-space-before/README.md): 선언 블록의 세미콜론 앞에 단일 공백이 필요하거나 공백이 허용되지 않음 (자동 수정 가능).
-   [`declaration-block-trailing-semicolon`](../../lib/rules/declaration-block-trailing-semicolon/README.md): 선언 블록 내에서 후미 세미콜론을 요구하거나 허용하지 않음 (자동 수정 가능).

#### 블록

-   [`block-closing-brace-empty-line-before`](../../lib/rules/block-closing-brace-empty-line-before/README.md): 블록의 닫는 버팀대 앞에 빈 줄을 요구하거나 허용하지 않음 (자동 수정 가능).
-   [`block-closing-brace-newline-after`](../../lib/rules/block-closing-brace-newline-after/README.md): 블록을 닫는 중괄호 뒤에 줄 바꿈이 필요하거나 공백을 허용하지 않음 (자동 수정 가능).
-   [`block-closing-brace-newline-before`](../../lib/rules/block-closing-brace-newline-before/README.md): 블록을 닫는 중괄호 앞에 줄 바꿈 문자를 입력하거나 공백을 허용하지 않음 (자동 수정 가능).
-   [`block-closing-brace-space-after`](../../lib/rules/block-closing-brace-space-after/README.md): 블록을 닫는 후 단일 공백이 필요하거나 공백을 허용하지 않음.
-   [`block-closing-brace-space-before`](../../lib/rules/block-closing-brace-space-before/README.md): 블록의 닫는 괄호 앞에 단일 공백이 필요하거나 공백을 허용하지 않음 (자동 수정 가능).
-   [`block-opening-brace-newline-after`](../../lib/rules/block-opening-brace-newline-after/README.md): 블록의 여는 중괄호 다음에 줄 바꿈이 필요 (자동 수정 가능).
-   [`block-opening-brace-newline-before`](../../lib/rules/block-opening-brace-newline-before/README.md): 블록의 열기 괄호 앞에 줄 바꿈이 필요하거나 공백이 없어야 함 (자동 수정 가능).
-   [`block-opening-brace-space-after`](../../lib/rules/block-opening-brace-space-after/README.md): 블록을 여는 중괄호 뒤에 공백이 하나만 있거나 공백이 없어야 함 (자동 수정 가능).
-   [`block-opening-brace-space-before`](../../lib/rules/block-opening-brace-space-before/README.md): 블록의 열기 괄호 앞에 단일 공백이 필요하거나 공백을 허용하지 않음 (자동 수정 가능).

#### 선택자

-   [`selector-attribute-brackets-space-inside`](../../lib/rules/selector-attribute-brackets-space-inside/README.md): 속성 선택자 내에서 괄호 내부에 공백이 하나만 있거나 공백이 없어야 함 (자동 수정 가능).
-   [`selector-attribute-operator-space-after`](../../lib/rules/selector-attribute-operator-space-after/README.md): 속성 선택자 내에서 연산자 뒤에 단일 공백이 필요하거나 공백이 허용되지 않음 (자동 수정 가능).
-   [`selector-attribute-operator-space-before`](../../lib/rules/selector-attribute-operator-space-before/README.md): 속성 선택자 내에서 연산자 앞에 자동 공백을 허용하거나 공백을 허용하지 않음 (자동 수정 가능).
-   [`selector-attribute-quotes`](../../lib/rules/selector-attribute-quotes/README.md): 속성 값에 따옴표가 필요하거나 허용되지 않음.
-   [`selector-combinator-space-after`](../../lib/rules/selector-combinator-space-after/README.md): 선택자 조합 후 자동 공백이 허용되거나 공백이 허용되지 않음 (자동 수정 가능).
-   [`selector-combinator-space-before`](../../lib/rules/selector-combinator-space-before/README.md): 선택자 조합 후 공백이 하나만 있거나 공백이 없어야 함 (자동 수정 가능).
-   [`selector-descendant-combinator-no-non-space`](../../lib/rules/selector-descendant-combinator-no-non-space/README.md): 선택자의 하위 선택자에 공백이 아닌 문자를 허용하지 않음 (자동 수정 가능).
-   [`selector-pseudo-class-case`](../../lib/rules/selector-pseudo-class-case/README.md): 가상 클래스 선택자에 소문자 또는 대문자를 지정 (자동 수정 가능).
-   [`selector-pseudo-class-parentheses-space-inside`](../../lib/rules/selector-pseudo-class-parentheses-space-inside/README.md): 가상 클래스 선택자 내에서 괄호 안에 공백이 하나만 있거나 공백이 없어야 함 (자동 수정 가능).
-   [`selector-pseudo-element-case`](../../lib/rules/selector-pseudo-element-case/README.md): 가상 요소 선택자에 소문자 또는 대문자를 지정 (자동 수정 가능).
-   [`selector-pseudo-element-colon-notation`](../../lib/rules/selector-pseudo-element-colon-notation/README.md): 해당 가상 요소에 대해 단일 또는 이중 콜론 표기법을 지정 (자동 수정 가능).
-   [`selector-type-case`](../../lib/rules/selector-type-case/README.md): 유형 선택자에 소문자 또는 대문자를 지정 (자동 수정 가능).

#### 선택자 리스트

-   [`selector-list-comma-newline-after`](../../lib/rules/selector-list-comma-newline-after/README.md): 선택자 목록의 쉼표 뒤에 줄바꿈 문자를 입력하거나 공백을 허용하지 않음 (자동 수정 가능).
-   [`selector-list-comma-newline-before`](../../lib/rules/selector-list-comma-newline-before/README.md): 선택자 목록의 쉼표 앞에 줄바꿈 문자를 입력하거나 공백을 허용하지 않음 (자동 수정 가능).
-   [`selector-list-comma-space-after`](../../lib/rules/selector-list-comma-space-after/README.md): 선택자 목록의 쉼표 뒤에 단일 공백이 필요하거나 공백이 허용되지 않음 (자동 수정 가능).
-   [`selector-list-comma-space-before`](../../lib/rules/selector-list-comma-space-before/README.md): 선택자 목록의 쉼표 앞에 단일 공백이 필요하거나 공백이 허용되지 않음 (자동 수정 가능).

#### 규칙

-   [`rule-empty-line-before`](../../lib/rules/rule-empty-line-before/README.md): 규칙 앞에 빈 줄을 요구하거나 허용하지 않음 (자동 수정 가능).

#### 미디어 기능

-   [`media-feature-colon-space-after`](../../lib/rules/media-feature-colon-space-after/README.md): 미디어 기능에서 콜론 뒤에 단일 공백이 필요하거나 공백이 허용되지 않음 (자동 수정 가능).
-   [`media-feature-colon-space-before`](../../lib/rules/media-feature-colon-space-before/README.md): 미디어 기능에서 콜론 앞에 단일 공백이 필요하거나 공백을 허용하지 않음 (자동 수정 가능).
-   [`media-feature-name-case`](../../lib/rules/media-feature-name-case/README.md): 미디어 기능 이름에 소문자 또는 대문자를 지정 (자동 수정 가능).
-   [`media-feature-parentheses-space-inside`](../../lib/rules/media-feature-parentheses-space-inside/README.md): 미디어 기능 내에서 괄호 안에 공백이 하나만 있거나 공백이 없어야 함 (자동 수정 가능).
-   [`media-feature-range-operator-space-after`](../../lib/rules/media-feature-range-operator-space-after/README.md): 미디어 기능에서 범위 연산자 다음에 공백이 하나만 필요하거나 공백이 허용되지 않음 (자동 수정 가능).
-   [`media-feature-range-operator-space-before`](../../lib/rules/media-feature-range-operator-space-before/README.md): 미디어 기능에서 범위 연산자 앞에 공백이 하나만 있거나 공백이 없어야 함 (자동 수정 가능).

#### 미디어 쿼리 리스트

-   [`media-query-list-comma-newline-after`](../../lib/rules/media-query-list-comma-newline-after/README.md): 미디어 쿼리 목록의 쉼표 뒤에 줄바꿈 문자를 입력하거나 공백을 허용하지 않음 (자동 수정 가능).
-   [`media-query-list-comma-newline-before`](../../lib/rules/media-query-list-comma-newline-before/README.md): 미디어 쿼리 목록의 쉼표 앞에 줄바꿈 문자를 입력하거나 공백을 허용하지 않음.
-   [`media-query-list-comma-space-after`](../../lib/rules/media-query-list-comma-space-after/README.md): 미디어 쿼리 목록의 쉼표 뒤에 단일 공백이 필요하거나 공백이 허용되지 않음 (자동 수정 가능).
-   [`media-query-list-comma-space-before`](../../lib/rules/media-query-list-comma-space-before/README.md): 미디어 쿼리 목록의 쉼표 앞에 단일 공백이 필요하거나 공백이 허용되지 않음 (자동 수정 가능).

#### @규칙

-   [`at-rule-empty-line-before`](../../lib/rules/at-rule-empty-line-before/README.md): @-규칙 전에 빈 줄을 요구하거나 허용하지 않음 (자동 수정 가능).
-   [`at-rule-name-case`](../../lib/rules/at-rule-name-case/README.md): @-규칙 이름에 소문자 또는 대문자를 지정 (자동 수정 가능).
-   [`at-rule-name-newline-after`](../../lib/rules/at-rule-name-newline-after/README.md): @-규칙 이름 다음에 줄 바꿈이 필요.
-   [`at-rule-name-space-after`](../../lib/rules/at-rule-name-space-after/README.md): @-규칙 이름 뒤에 단일 공백이 필요 (자동 수정 가능).
-   [`at-rule-semicolon-newline-after`](../../lib/rules/at-rule-semicolon-newline-after/README.md): @-규칙 세미콜론 다음에 줄 바꿈이 필요 (자동 수정 가능).
-   [`at-rule-semicolon-space-before`](../../lib/rules/at-rule-semicolon-space-before/README.md): @-규칙 세미콜론 앞에 단일 공백이 필요하거나 공백이 허용되지 않음.

#### 주석

-   [`comment-empty-line-before`](../../lib/rules/comment-empty-line-before/README.md): 주석 앞에 빈 줄을 요구하거나 허용하지 않음 (자동 수정 가능).
-   [`comment-whitespace-inside`](../../lib/rules/comment-whitespace-inside/README.md): 주석 마커 내부에 공백이 필요하거나 허용되지 않음 (자동 수정 가능).

#### 일반 / 시트

-   [`indentation`](../../lib/rules/indentation/README.md): 들여 쓰기를 지정 (자동 수정 가능).
-   [`linebreaks`](../../lib/rules/linebreaks/README.md): 유닉스 또는 윈도우 줄 바꿈을 지정 (자동 수정 가능).
-   [`max-empty-lines`](../../lib/rules/max-empty-lines/README.md): 인접한 빈 줄 수를 제한 (자동 수정 가능).
-   [`max-line-length`](../../lib/rules/max-line-length/README.md): 줄의 길이를 제한.
-   [`no-eol-whitespace`](../../lib/rules/no-eol-whitespace/README.md): 줄 끝 공백을 허용하지 않음 (자동 수정 가능).
-   [`no-missing-end-of-source-newline`](../../lib/rules/no-missing-end-of-source-newline/README.md): 소스 끝줄 바꿈 누락 (자동 수정 가능) 을 허용하지 않음.
-   [`no-empty-first-line`](../../lib/rules/no-empty-first-line/README.md): 첫 번째 빈 줄을 허용하지 않음 (자동 수정 가능).
-   [`unicode-bom`](../../lib/rules/unicode-bom/README.md): 유니 코드 BOM이 필요하거나 허용되지 않음.
