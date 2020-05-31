'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: ['tab'],
	syntax: 'html',
	fix: true,

	accept: [
		{
			code: `
<style>
\ta {
\t\tdisplay:block;
\t}
</style>`,
		},
		{
			code: `
<style>
a {
\tdisplay:block;
}
</style>`,
		},
		{
			code: `
<style>a {
\tdisplay:block;
}
</style>`,
		},
		{
			code: '<a style="display:block; color:red;"></a>',
		},
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
			message: messages.expected('2 tabs'),
			line: 4,
			column: 2,
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
			warnings: [
				{
					message: messages.expected('1 tab'),
					line: 3,
					column: 3,
				},
				{
					message: messages.expected('1 tab'),
					line: 5,
					column: 5,
				},
				{
					message: messages.expected('2 tabs'),
					line: 4,
					column: 7,
				},
			],
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
			message: messages.expected('1 tab'),
			line: 4,
			column: 1,
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
			warnings: [
				{
					message: messages.expected('1 tab'),
					line: 3,
					column: 3,
				},
				{
					message: messages.expected('1 tab'),
					line: 5,
					column: 3,
				},
				{
					message: messages.expected('2 tabs'),
					line: 4,
					column: 3,
				},
			],
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
			warnings: [
				{
					message: messages.expected('1 tab'),
					line: 3,
					column: 5,
				},
				{
					message: messages.expected('1 tab'),
					line: 5,
					column: 5,
				},
				{
					message: messages.expected('2 tabs'),
					line: 4,
					column: 9,
				},
				{
					message: messages.expected('1 tab'),
					line: 6,
					column: 5,
				},
				{
					message: messages.expected('1 tab'),
					line: 8,
					column: 5,
				},
				{
					message: messages.expected('2 tabs'),
					line: 7,
					column: 7,
				},
			],
		},
	],
});

testRule({
	ruleName,
	config: [2],
	syntax: 'html',
	fix: true,

	accept: [
		{
			code: `
<style>
  a {
    display:block;
  }
</style>`,
		},
		{
			code: `
<style>
a {
  display:block;
}
</style>`,
		},
		{
			code: `
<style>a {
  display:block;
}
</style>`,
		},
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
			message: messages.expected('2 spaces'),
			line: 3,
			column: 2,
		},
	],
});

testRule({
	ruleName,
	config: [
		'tab',
		{
			baseIndentLevel: 1,
		},
	],
	syntax: 'html',
	fix: true,

	accept: [
		{
			code: `
<style>
\ta {
\t\tdisplay:block;
\t}
</style>`,
		},
		{
			code: `
\t<style>
\t\ta {
\t\t\tdisplay:block;
\t\t}
\t</style>`,
		},
		{
			code: `
<style lang="less" nonce="1">
\ta {
\t\tdisplay:block;
\t}
</style>`,
		},
		{
			code: `
<style
\tlang="less"
\tnonce="1">
\ta {
\t\tdisplay:block;
\t}
</style>`,
		},
		{
			code: `
<style
\t\tlang="less"
\t\tnonce="1"
>
\ta {
\t\tdisplay:block;
\t}
</style>`,
		},
		{
			code: `
\t<style
\t\tlang="less"
\t\tnonce="1"
\t>
\t\ta {
\t\t\tdisplay:block;
\t\t}
</style>`,
		},
		{
			code: `
<style
\tlang="less"
\t\tnonce="1">
\ta {
\t\tdisplay:block;
\t}
</style>`,
		},
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
			warnings: [
				{
					message: messages.expected('1 tab'),
					line: 3,
					column: 1,
				},
				{
					message: messages.expected('1 tab'),
					line: 5,
					column: 1,
				},
				{
					message: messages.expected('2 tabs'),
					line: 4,
					column: 2,
				},
			],
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
			warnings: [
				{
					message: messages.expected('2 tabs'),
					line: 3,
					column: 2,
				},
				{
					message: messages.expected('2 tabs'),
					line: 5,
					column: 2,
				},
				{
					message: messages.expected('3 tabs'),
					line: 4,
					column: 3,
				},
			],
		},
	],
});

testRule({
	ruleName,
	config: [
		'tab',
		{
			baseIndentLevel: 0,
		},
	],
	syntax: 'html',
	fix: true,

	accept: [
		{
			code: `
<style>
a {
\tdisplay:block;
}
</style>`,
		},
		{
			code: `
\t<style>
\ta {
\t\tdisplay:block;
\t}
\t</style>`,
		},
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
			warnings: [
				{
					message: messages.expected('0 tabs'),
					line: 3,
					column: 2,
				},
				{
					message: messages.expected('0 tabs'),
					line: 5,
					column: 2,
				},
				{
					message: messages.expected('1 tab'),
					line: 4,
					column: 3,
				},
			],
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
			warnings: [
				{
					message: messages.expected('1 tab'),
					line: 3,
					column: 3,
				},
				{
					message: messages.expected('1 tab'),
					line: 5,
					column: 3,
				},
				{
					message: messages.expected('2 tabs'),
					line: 4,
					column: 4,
				},
			],
		},
	],
});

testRule({
	ruleName,
	config: [
		2,
		{
			baseIndentLevel: 1,
		},
	],
	syntax: 'html',
	fix: true,

	accept: [
		{
			code: `
<style>
  a {
    display:block;
  }
</style>`,
		},
		{
			code: `
  <style>
    a {
      display:block;
    }
  </style>`,
		},
		{
			code: `
<style lang="less" nonce="1">
  a {
    display:block;
  }
</style>`,
		},
		{
			code: `
<style
  lang="less"
  nonce="1">
  a {
    display:block;
  }
</style>`,
		},
		{
			code: `
<style
    lang="less"
    nonce="1"
>
  a {
    display:block;
  }
</style>`,
		},
		{
			code: `
  <style
    lang="less"
    nonce="1"
  >
    a {
      display:block;
    }
</style>`,
		},
		{
			code: `
<style
  lang="less"
    nonce="1">
  a {
    display:block;
  }
</style>`,
		},
	],
	reject: [
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
    display:block;
  }
</style>`,
			warnings: [
				{
					message: messages.expected('2 spaces'),
					line: 3,
					column: 1,
				},
				{
					message: messages.expected('2 spaces'),
					line: 5,
					column: 1,
				},
				{
					message: messages.expected('4 spaces'),
					line: 4,
					column: 3,
				},
			],
		},
		{
			code: `
  <style
    lang="less">
      a {
        display:block;
      }
  </style>`,
			fixed: `
  <style
    lang="less">
    a {
      display:block;
    }
  </style>`,
			warnings: [
				{
					message: messages.expected('4 spaces'),
					line: 4,
					column: 7,
				},
				{
					message: messages.expected('4 spaces'),
					line: 6,
					column: 7,
				},
				{
					message: messages.expected('6 spaces'),
					line: 5,
					column: 9,
				},
			],
		},
	],
});
