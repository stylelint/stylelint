"use strict";

const rule = require("..");
const { messages, ruleName } = rule;

testRule(rule, {
  ruleName,
  config: ["lower"],

  accept: [
    {
      code: "@media not all and (monochrome) { }"
    },
    {
      code: "@media (min-width: 700px) { }"
    },
    {
      code: "@media (min-width: 700PX) { }"
    },
    {
      code: "@media (min-width: 700px) and (orientation: landscape) { }"
    },
    {
      code: "@media (min-width: 700px), print and (orientation: landscape) { }"
    },
    {
      code: "@media (min-width: 700px), PRINT and (orientation: landscape) { }"
    },
    {
      code: "@media (-webkit-min-device-pixel-ratio: 2) { }"
    },
    {
      code: "@not-media (MIN-WIDTH: 700px) { }",
      description: "ignore non media at-rule"
    },
    {
      code: "@media (--viewport-medium) { }",
      description: "ignore css variables"
    },
    {
      code: "@media (--VIEWPORT-MEDIUM) { }",
      description: "ignore css variables"
    },
    {
      code: "@media (WIDTH < 100px) { }",
      description: "ignore range context"
    },
    {
      code: "@media (WIDTH = 100px) { }",
      description: "ignore range context"
    },
    {
      code: "@media (WIDTH <= 100px) { }",
      description: "ignore range context"
    },
    {
      code: "@media (10px >= WIDTH <= 100px) { }",
      description: "ignore complex range context"
    }
  ],

  reject: [
    {
      code: "@media not all and (MONOCHROME) { }",
      message: messages.expected("MONOCHROME", "monochrome"),
      line: 1,
      column: 21
    },
    {
      code: "@media not all and (mOnOcHrOmE) { }",
      message: messages.expected("mOnOcHrOmE", "monochrome"),
      line: 1,
      column: 21
    },
    {
      code: "@media (MIN-WIDTH: 700px) { }",
      message: messages.expected("MIN-WIDTH", "min-width"),
      line: 1,
      column: 9
    },
    {
      code: "@media (mIn-WiDtH: 700px) { }",
      message: messages.expected("mIn-WiDtH", "min-width"),
      line: 1,
      column: 9
    },
    {
      code: "@media (MIN-WIDTH: 700px) and (orientation: landscape) { }",
      message: messages.expected("MIN-WIDTH", "min-width"),
      line: 1,
      column: 9
    },
    {
      code: "@media (min-width: 700px) and (ORIENTATION: landscape) { }",
      message: messages.expected("ORIENTATION", "orientation"),
      line: 1,
      column: 32
    },
    {
      code: "@media (-WEBKIT-MIN-DEVICE-PIXEL-RATION: 2) { }",
      message: messages.expected(
        "-WEBKIT-MIN-DEVICE-PIXEL-RATION",
        "-webkit-min-device-pixel-ration"
      ),
      line: 1,
      column: 9
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["lower"],
  syntax: "less",

  accept: [
    {
      code: "@media (min-width: @tablet) { }"
    },
    {
      code: "@media (min-width: (@value + 10px)) { }"
    },
    {
      code: "@media @smartphones and (orientation: landscape) { }"
    },
    {
      code: "@media @smartphones { }"
    }
  ],

  reject: [
    {
      code: "@media (MIN-WIDTH: @tablet) { }",
      message: messages.expected("MIN-WIDTH", "min-width"),
      line: 1,
      column: 9
    },
    {
      code: "@media (MIN-WIDTH: (@value + 10px)) { }",
      message: messages.expected("MIN-WIDTH", "min-width"),
      line: 1,
      column: 9
    },
    {
      code: "@media @smartphones and (ORIENTATION: landscape) { }",
      message: messages.expected("ORIENTATION", "orientation"),
      line: 1,
      column: 26
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["lower"],
  syntax: "scss",

  accept: [
    {
      code: "@media not all and ($monochrome) { }"
    },
    {
      code: "@media not all and ($MONOCHROME) { }"
    },
    {
      code: "@media not all and (#{$monochrome}) { }"
    },
    {
      code: "@media not all and (#{$MONOCHROME}) { }"
    },
    {
      code: "@media (min-width: $var) { }"
    },
    {
      code: "@media (min-width: $var + 10px) { }"
    },
    {
      code: "@media (min-width: ($var + 10px)) { }"
    },
    {
      code: "@media ($feature-name: $value) { }"
    },
    {
      code: "@media ($FEATURE-NAME: $value) { }"
    },
    {
      code: "@media (#{$feature-name}: $value) { }"
    },
    {
      code: "@media (#{$FEATURE-NAME}: $value) { }"
    },
    {
      code: "@media ('min-' + $width: $value) { }"
    },
    {
      code: "@media ('MIN-' + $WIDTH: $value) { }"
    },
    {
      code: "@media ($value + 'width': $value) { }"
    },
    {
      code: "@media ($VALUE + 'WIDTH': $value) { }"
    },
    {
      code: "@media (#{$width}: $value) { }"
    },
    {
      code: "@media (#{$WIDTH}: $value) { }"
    },
    {
      code: "@media #{$feature-name} { }"
    }
  ],

  reject: [
    {
      code: "@media (MIN-WIDTH: $var) { }",
      message: messages.expected("MIN-WIDTH", "min-width"),
      line: 1,
      column: 9
    },
    {
      code: "@media (MIN-WIDTH: $var + 10px) { }",
      message: messages.expected("MIN-WIDTH", "min-width"),
      line: 1,
      column: 9
    },
    {
      code: "@media (MIN-WIDTH: ($var + 10px)) { }",
      message: messages.expected("MIN-WIDTH", "min-width"),
      line: 1,
      column: 9
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["upper"],

  accept: [
    {
      code: "@media not all and (MONOCHROME) { }"
    },
    {
      code: "@media (MIN-WIDTH: 700px) { }"
    },
    {
      code: "@media (MIN-WIDTH: 700PX) { }"
    },
    {
      code: "@media (MIN-WIDTH: 700px) and (ORIENTATION: landscape) { }"
    },
    {
      code: "@media (MIN-WIDTH: 700px), print and (ORIENTATION: landscape) { }"
    },
    {
      code: "@media (MIN-WIDTH: 700px), PRINT and (ORIENTATION: landscape) { }"
    },
    {
      code: "@media (-WEBKIT-MIN-DEVICE-PIXEL-RATION: 2) { }"
    },
    {
      code: "@not-media (min-width: 700px) { }",
      description: "ignore non media at-rule"
    },
    {
      code: "@media (--viewport-medium) { }",
      description: "ignore css variables"
    },
    {
      code: "@media (--VIEWPORT-MEDIUM) { }",
      description: "ignore css variables"
    }
  ],

  reject: [
    {
      code: "@media not all and (monochrome) { }",
      message: messages.expected("monochrome", "MONOCHROME"),
      line: 1,
      column: 21
    },
    {
      code: "@media not all and (mOnOcHrOmE) { }",
      message: messages.expected("mOnOcHrOmE", "MONOCHROME"),
      line: 1,
      column: 21
    },
    {
      code: "@media (min-width: 700px) { }",
      message: messages.expected("min-width", "MIN-WIDTH"),
      line: 1,
      column: 9
    },
    {
      code: "@media (mIn-WiDtH: 700px) { }",
      message: messages.expected("mIn-WiDtH", "MIN-WIDTH"),
      line: 1,
      column: 9
    },
    {
      code: "@media (min-width: 700px) and (ORIENTATION: landscape) { }",
      message: messages.expected("min-width", "MIN-WIDTH"),
      line: 1,
      column: 9
    },
    {
      code: "@media (MIN-WIDTH: 700px) and (orientation: landscape) { }",
      message: messages.expected("orientation", "ORIENTATION"),
      line: 1,
      column: 32
    },
    {
      code: "@media (-webkit-min-device-pixel-ration: 2) { }",
      message: messages.expected(
        "-webkit-min-device-pixel-ration",
        "-WEBKIT-MIN-DEVICE-PIXEL-RATION"
      ),
      line: 1,
      column: 9
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["upper"],
  syntax: "less",

  accept: [
    {
      code: "@media (MIN-WIDTH: @tablet) { }"
    },
    {
      code: "@media (MIN-WIDTH: (@value + 10px)) { }"
    },
    {
      code: "@media @smartphones and (ORIENTATION: landscape) { }"
    },
    {
      code: "@media @smartphones { }"
    }
  ],

  reject: [
    {
      code: "@media (min-width: @tablet) { }",
      message: messages.expected("min-width", "MIN-WIDTH"),
      line: 1,
      column: 9
    },
    {
      code: "@media (min-width: (@value + 10px)) { }",
      message: messages.expected("min-width", "MIN-WIDTH"),
      line: 1,
      column: 9
    },
    {
      code: "@media @smartphones and (orientation: landscape) { }",
      message: messages.expected("orientation", "ORIENTATION"),
      line: 1,
      column: 26
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["upper"],
  syntax: "scss",

  accept: [
    {
      code: "@media not all and ($monochrome) { }"
    },
    {
      code: "@media not all and ($MONOCHROME) { }"
    },
    {
      code: "@media not all and (#{$monochrome}) { }"
    },
    {
      code: "@media not all and (#{$MONOCHROME}) { }"
    },
    {
      code: "@media (MIN-WIDTH: $var) { }"
    },
    {
      code: "@media (MIN-WIDTH: $var + 10px) { }"
    },
    {
      code: "@media (MIN-WIDTH: ($var + 10px)) { }"
    },
    {
      code: "@media ($feature-name: $value) { }"
    },
    {
      code: "@media ($FEATURE-NAME: $value) { }"
    },
    {
      code: "@media (#{$feature-name}: $value) { }"
    },
    {
      code: "@media (#{$FEATURE-NAME}: $value) { }"
    },
    {
      code: "@media ('min-' + $width: $value) { }"
    },
    {
      code: "@media ('MIN-' + $WIDTH: $value) { }"
    },
    {
      code: "@media ($value + 'width': $value) { }"
    },
    {
      code: "@media ($VALUE + 'WIDTH': $value) { }"
    },
    {
      code: "@media (#{$width}: $value) { }"
    },
    {
      code: "@media (#{$WIDTH}: $value) { }"
    },
    {
      code: "@media #{$feature-name} { }"
    }
  ],

  reject: [
    {
      code: "@media (min-width: $var) { }",
      message: messages.expected("min-width", "MIN-WIDTH"),
      line: 1,
      column: 9
    },
    {
      code: "@media (min-width: $var + 10px) { }",
      message: messages.expected("min-width", "MIN-WIDTH"),
      line: 1,
      column: 9
    },
    {
      code: "@media (min-width: ($var + 10px)) { }",
      message: messages.expected("min-width", "MIN-WIDTH"),
      line: 1,
      column: 9
    }
  ]
});
