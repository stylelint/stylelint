"use strict";

const rule = require("..");
const { messages, ruleName } = rule;

testRule(rule, {
  ruleName,
  config: [true],

  accept: [
    {
      code: "@media all and (monochrome) { }"
    },
    {
      code: "@media all and (MONOCHROME) { }"
    },
    {
      code: "@media (min-width: 700px) { }"
    },
    {
      code: "@media (MIN-WIDTH: 700px) { }"
    },
    {
      code: "@media (min-width: 700px) and (orientation: landscape) { }"
    },
    {
      code: "@media (MIN-WIDTH: 700px) and (ORIENTATION: landscape) { }"
    },
    {
      code: "@media (-webkit-min-device-pixel-ratio: 2) { }"
    },
    {
      code: "@media (--viewport-medium) { }",
      description: "ignore css variables"
    },
    {
      code: "@media (width < 100px) { }",
      description: "ignore range context"
    },
    {
      code: "@media (width = 100px) { }",
      description: "ignore range context"
    },
    {
      code: "@media (width <= 100px) { }",
      description: "ignore range context"
    },
    {
      code: "@media (10px >= width <= 100px) { }",
      description: "ignore complex range context"
    }
  ],

  reject: [
    {
      code: "@media screen and (unknown) { }",
      message: messages.rejected("unknown"),
      line: 1,
      column: 20
    },
    {
      code: "@media screen and (UNKNOWN) { }",
      message: messages.rejected("UNKNOWN"),
      line: 1,
      column: 20
    },
    {
      code: "@media screen and (unknown: 2) { }",
      message: messages.rejected("unknown"),
      line: 1,
      column: 20
    },
    {
      code: "@media screen and (UNKNOWN: 2) { }",
      message: messages.rejected("UNKNOWN"),
      line: 1,
      column: 20
    },
    {
      code: "@media (min-width: 700px) and (unknown: landscape) { }",
      message: messages.rejected("unknown"),
      line: 1,
      column: 32
    },
    {
      code: "@media (min-width: 700px) and (UNKNOWN: landscape) { }",
      message: messages.rejected("UNKNOWN"),
      line: 1,
      column: 32
    }
  ]
});

testRule(rule, {
  ruleName,
  config: [true],
  syntax: "less",

  accept: [
    {
      code: "@media (min-width: @tablet) { }"
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
      code: "@media (unknown: @tablet) { }",
      message: messages.rejected("unknown"),
      line: 1,
      column: 9
    }
  ]
});

testRule(rule, {
  ruleName,
  config: [true],
  syntax: "scss",

  accept: [
    {
      code: "@media not all and ($monochrome) { }"
    },
    {
      code: "@media not all and (#{$monochrome}) { }"
    },
    {
      code: "@media (min-width: $var) { }"
    },
    {
      code: "@media ($feature-name: $value) { }"
    },
    {
      code: "@media (#{$feature-name}: $value) { }"
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
      code: "@media (unknown: $var) { }",
      message: messages.rejected("unknown"),
      line: 1,
      column: 9
    }
  ]
});

testRule(rule, {
  ruleName,
  config: [
    true,
    { ignoreMediaFeatureNames: ["/^my-/", "custom", "/^YOUR-/i"] }
  ],

  accept: [
    {
      code: "@media screen and (my-media-feature-name) { }"
    },
    {
      code: "@media screen and (custom: 10px) { }"
    },
    {
      code: "@media screen and (YOUR-custom: 10px) { }"
    },
    {
      code: "@media screen and (your-custom: 10px) { }"
    }
  ],

  reject: [
    {
      code: "@media screen and (unknown) { }",
      message: messages.rejected("unknown"),
      line: 1,
      column: 20
    },
    {
      code: "@media screen and (MY-MEDIA-FEATURE-NAME) { }",
      message: messages.rejected("MY-MEDIA-FEATURE-NAME"),
      line: 1,
      column: 20
    },
    {
      code: "@media screen and (CUSTOM: 10px) { }",
      message: messages.rejected("CUSTOM"),
      line: 1,
      column: 20
    },
    {
      code: "@media screen and (UNKNOWN) { }",
      message: messages.rejected("UNKNOWN"),
      line: 1,
      column: 20
    }
  ]
});

testRule(rule, {
  ruleName,
  config: [true, { ignoreMediaFeatureNames: [/^my-/] }],

  accept: [
    {
      code: "@media screen and (my-media-feature-name) { }"
    }
  ],

  reject: [
    {
      code: "@media screen and (unknown) { }",
      message: messages.rejected("unknown"),
      line: 1,
      column: 20
    }
  ]
});
