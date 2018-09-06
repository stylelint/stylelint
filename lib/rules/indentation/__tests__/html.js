"use strict";

const rule = require("..");
const { messages, ruleName } = rule;

testRule(rule, {
  ruleName,
  config: ["tab"],
  syntax: "html",
  fix: true,

  accept: [
    {
      code: `
<style>
\ta {
\t\tdisplay:block;
\t}
</style>`
    },
    {
      code: `
<style>
a {
\tdisplay:block;
}
</style>`
    },
    {
      code: `
<style>a {
\tdisplay:block;
}
</style>`
    },
    {
      code: '<a style="display:block; color:red;"></a>'
    }
  ],

  reject: [
    {
      code: `
<style>
\ta {
\tdisplay:block;
\t}
</style>`,
      fixed: `
<style>
\ta {
\t\tdisplay:block;
\t}
</style>`,
      message: messages.expected("2 tabs"),
      line: 4,
      column: 2
    },
    {
      code: `
<style>
  a {
      display:block;
    }
</style>`,
      fixed: `
<style>
\ta {
\t\tdisplay:block;
\t}
</style>`,
      message: messages.expected("1 tab"),
      line: 3,
      column: 3
    },
    {
      code: `
<style>
a {
display:block;
}
</style>`,
      fixed: `
<style>
a {
\tdisplay:block;
}
</style>`,
      message: messages.expected("1 tab"),
      line: 4,
      column: 1
    },
    {
      code: `
<style>
  a {
  display:block;
  }
</style>`,
      fixed: `
<style>
\ta {
\t\tdisplay:block;
\t}
</style>`,
      message: messages.expected("1 tab"),
      line: 3,
      column: 3
    },
    {
      code: `
\t<style>
    a {
        display:block;
    }
    b {
      display:block;
    }
\t</style>`,
      fixed: `
\t<style>
\ta {
\t\tdisplay:block;
\t}
\tb {
\t\tdisplay:block;
\t}
\t</style>`,
      message: messages.expected("1 tab"),
      line: 3,
      column: 5
    }
  ]
});

testRule(rule, {
  ruleName,
  config: [2],
  syntax: "html",
  fix: true,

  accept: [
    {
      code: `
<style>
  a {
    display:block;
  }
</style>`
    },
    {
      code: `
<style>
a {
  display:block;
}
</style>`
    },
    {
      code: `
<style>a {
  display:block;
}
</style>`
    }
  ],
  reject: [
    {
      code: `
<style>a {
 display:block;
}
</style>`,
      fixed: `
<style>a {
  display:block;
}
</style>`,
      message: messages.expected("2 spaces"),
      line: 3,
      column: 2
    }
  ]
});

testRule(rule, {
  ruleName,
  config: [
    "tab",
    {
      baseIndentLevel: 1
    }
  ],
  syntax: "html",
  fix: true,

  accept: [
    {
      code: `
<style>
\ta {
\t\tdisplay:block;
\t}
</style>`
    },
    {
      code: `
\t<style>
\t\ta {
\t\t\tdisplay:block;
\t\t}
\t</style>`
    }
  ],
  reject: [
    {
      code: `
<style>
a {
\tdisplay:block;
}
</style>`,
      fixed: `
<style>
\ta {
\t\tdisplay:block;
\t}
</style>`,
      message: messages.expected("1 tab"),
      line: 3,
      column: 1
    },
    {
      code: `
\t<style>
\ta {
\t\tdisplay:block;
\t}
\t</style>`,
      fixed: `
\t<style>
\t\ta {
\t\t\tdisplay:block;
\t\t}
\t</style>`,
      message: messages.expected("2 tabs"),
      line: 3,
      column: 2
    }
  ]
});

testRule(rule, {
  ruleName,
  config: [
    "tab",
    {
      baseIndentLevel: 0
    }
  ],
  syntax: "html",
  fix: true,

  accept: [
    {
      code: `
<style>
a {
\tdisplay:block;
}
</style>`
    },
    {
      code: `
\t<style>
\ta {
\t\tdisplay:block;
\t}
\t</style>`
    }
  ],
  reject: [
    {
      code: `
<style>
\ta {
\t\tdisplay:block;
\t}
</style>`,
      fixed: `
<style>
a {
\tdisplay:block;
}
</style>`,
      message: messages.expected("0 tabs"),
      line: 3,
      column: 2
    },
    {
      code: `
\t<style>
\t\ta {
\t\t\tdisplay:block;
\t\t}
\t</style>`,
      fixed: `
\t<style>
\ta {
\t\tdisplay:block;
\t}
\t</style>`,
      message: messages.expected("1 tab"),
      line: 3,
      column: 3
    }
  ]
});
