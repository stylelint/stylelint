'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: [0],
	fix: true,

	accept: [
		{
			code: 'a {}\n',
		},
	],
	reject: [
		{
			code: '\na {}',
			fixed: 'a {}',
			message: messages.expected(0),
			line: 1,
			column: 1,
		},
	],
});

testRule({
	ruleName,
	config: [1],
	fix: true,

	accept: [
		{
			code: '\na {}',
		},
		{
			code: '\r\na {}',
		},
		{
			code: 'a {}\n',
		},
		{
			code: 'a {}\r\n',
		},
		{
			code: 'a {}\nb {}',
		},
		{
			code: 'a {}\r\nb {}',
		},
		{
			code: 'a {}\n\nb {}',
		},
		{
			code: 'a {}\r\n\r\nb {}',
		},
		{
			code: '/** horse */\n\nb {}',
		},
		{
			code: '/** horse */\r\n\r\nb {}',
		},
		{
			code: 'a {}\n\n/** horse */\n\nb {}',
		},
		{
			code: 'a {}\r\n\r\n/** horse */\r\n\r\nb {}',
		},
	],

	reject: [
		{
			code: '\n\na {}',
			fixed: '\na {}',
			message: messages.expected(1),
			line: 2,
			column: 1,
		},
		{
			code: '\r\n\r\na {}',
			fixed: '\r\na {}',
			message: messages.expected(1),
			line: 2,
			column: 1,
		},
		{
			code: 'a {}\n\n',
			fixed: 'a {}\n',
			message: messages.expected(1),
			line: 3,
			column: 1,
		},
		{
			code: 'a {}\r\n\r\n',
			fixed: 'a {}\r\n',
			message: messages.expected(1),
			line: 3,
			column: 1,
		},
		{
			code: 'a {}\n\n\nb {}',
			fixed: 'a {}\n\nb {}',
			message: messages.expected(1),
			line: 3,
			column: 1,
		},
		{
			code: 'a {}\r\n\r\n\r\nb {}',
			fixed: 'a {}\r\n\r\nb {}',
			message: messages.expected(1),
			line: 3,
			column: 1,
		},
		{
			code: 'a {}\n\n/** horse */\n\n\nb {}',
			fixed: 'a {}\n\n/** horse */\n\nb {}',
			message: messages.expected(1),
			line: 5,
			column: 1,
		},
		{
			code: 'a {}\r\n\r\n/** horse */\r\n\r\n\r\nb {}',
			fixed: 'a {}\r\n\r\n/** horse */\r\n\r\nb {}',
			message: messages.expected(1),
			line: 5,
			column: 1,
		},
		{
			code: '/* horse\n\n\n */\na {}',
			fixed: '/* horse\n\n */\na {}',
			message: messages.expected(1),
			line: 3,
			column: 1,
		},
		{
			code: '/* horse\r\n\r\n\r\n */\r\na {}',
			fixed: '/* horse\r\n\r\n */\r\na {}',
			message: messages.expected(1),
			line: 3,
			column: 1,
		},
	],
});

testRule({
	ruleName,
	config: [1],
	syntax: 'html',
	fix: true,

	accept: [
		{
			code: `<div>




<style>
/* horse */
</style>



</div>`,
		},
		{
			code: `<div>
<style>
/* horse */

</style>
</div>`,
		},
		{
			code: `<div style="
color: pink;

">
<style>
/* style1 */

</style>
<style>
/* style2 */

</style>
</div>`,
		},
		{
			code: `<html><!-- when there is no end tag -->
<style>
a {color: pink;}

`,
			description: 'when there is no end tag',
		},
	],

	reject: [
		{
			code: `<div>
<style>
/* horse */


</style>
</div>`,
			fixed: `<div>
<style>
/* horse */

</style>
</div>`,
			message: messages.expected(1),
			line: 5,
			column: 1,
		},

		{
			code: `<div style="color: pink;


">
</div>`,
			fixed: `<div style="color: pink;

">
</div>`,
			message: messages.expected(1),
			line: 3,
			column: 1,
		},
		{
			code: `<div style="color: pink;">
<style>
a {}

</style>
<style>
a {}


</style>
</div>`,
			fixed: `<div style="color: pink;">
<style>
a {}

</style>
<style>
a {}

</style>
</div>`,
			message: messages.expected(1),
			line: 9,
			column: 1,
		},
	],
});

testRule({
	ruleName,
	config: [1],
	syntax: 'css-in-js',
	fix: true,

	accept: [
		{
			code: `
import styled from 'styled-components';





export default styled.div\`
  color: #00
\`;




`,
		},
		{
			code: `
import styled from 'styled-components';
export default styled.div\`
  color: #00

\`;`,
		},
		{
			code: `
import styled from 'styled-components';
// styled style1
export const style1 = styled.div\`
  color: #00

\`;
// styled style2
export const style2 = styled.div\`
  color: #00

\`;`,
		},
	],

	reject: [
		{
			code: `
import styled from 'styled-components';
export default styled.div\`
  /* horse */


  color: #00
\`;
`,
			fixed: `
import styled from 'styled-components';
export default styled.div\`
  /* horse */

  color: #00
\`;
`,
			message: messages.expected(1),
			line: 6,
			column: 1,
		},
		{
			code: `
import styled from 'styled-components';
// styled style1
export const style1 = styled.div\`
  color: #00

\`;
// styled style2
export const style2 = styled.div\`
  color: #00


\`;`,
			fixed: `
import styled from 'styled-components';
// styled style1
export const style1 = styled.div\`
  color: #00

\`;
// styled style2
export const style2 = styled.div\`
  color: #00

\`;`,
			message: messages.expected(1),
			line: 12,
			column: 1,
		},
	],
});

testRule({
	ruleName,
	config: [2],
	fix: true,

	accept: [
		{
			code: 'a {}\nb {}',
		},
		{
			code: 'a {}\n\nb {}',
		},
		{
			code: 'a {}\n\n\nb {}',
		},
		{
			code: 'a {}\r\n\r\n\r\nb {}',
		},
		{
			code: 'a {}\n\n\n/** horse */\n\n\nb {}',
		},
		{
			code: 'a {}\r\n\r\n\r\n/** horse */\r\n\r\n\r\nb {}',
		},
	],

	reject: [
		{
			code: 'a {}\n\n\n\nb {}',
			fixed: 'a {}\n\n\nb {}',
			message: messages.expected(2),
			line: 4,
			column: 1,
		},
		{
			code: 'a {}\r\n\r\n\r\n\r\nb {}',
			fixed: 'a {}\r\n\r\n\r\nb {}',
			message: messages.expected(2),
			line: 4,
			column: 1,
		},
		{
			code: 'a {}\n\n/** horse */\n\n\n\nb {}',
			fixed: 'a {}\n\n/** horse */\n\n\nb {}',
			message: messages.expected(2),
			line: 6,
			column: 1,
		},
		{
			code: 'a {}\r\n\r\n/** horse */\r\n\r\n\r\n\r\nb {}',
			fixed: 'a {}\r\n\r\n/** horse */\r\n\r\n\r\nb {}',
			message: messages.expected(2),
			line: 6,
			column: 1,
		},
		{
			code: '/* horse\n\n\n\n */\na {}',
			fixed: '/* horse\n\n\n */\na {}',
			message: messages.expected(2),
			line: 4,
			column: 1,
		},
		{
			code: '/* horse\r\n\r\n\r\n\r\n */\r\na {}',
			fixed: '/* horse\r\n\r\n\r\n */\r\na {}',
			message: messages.expected(2),
			line: 4,
			column: 1,
		},
	],
});

testRule({
	ruleName,
	config: [2],
	skipBasicChecks: true,
	syntax: 'scss',
	fix: true,

	accept: [
		{
			code: '\n\n// one',
		},
		{
			code: '// one\n\n',
		},
		{
			code: '// one\n\n\n// two\n',
		},
	],

	reject: [
		{
			code: '\n\n\n// one',
			fixed: '\n\n// one',
			message: messages.expected(2),
			line: 3,
			column: 1,
		},
		{
			code: '// one\n\n\n',
			fixed: '// one\n\n',
			message: messages.expected(2),
			line: 4,
			column: 1,
		},
		{
			code: '// one\n\n\n\n// two\n',
			fixed: '// one\n\n\n// two\n',
			message: messages.expected(2),
			line: 4,
			column: 1,
		},
	],
});

testRule({
	ruleName,
	config: [2],
	skipBasicChecks: true,
	syntax: 'sugarss',
	fix: true,

	accept: [
		{
			code: '\n\n// one',
		},
		{
			code: '// one\n\n',
		},
		{
			code: '// one\n\n\n// two\n',
		},
	],

	reject: [
		{
			code: '\n\n\n// one',
			fixed: '\n\n// one',
			message: messages.expected(2),
			line: 3,
			column: 1,
		},
		{
			code: '// one\n\n\n',
			fixed: '// one\n\n',
			message: messages.expected(2),
			line: 4,
			column: 1,
		},
		{
			code: '// one\n\n\n\n// two\n',
			fixed: '// one\n\n\n// two\n',
			message: messages.expected(2),
			line: 4,
			column: 1,
		},
	],
});

testRule({
	ruleName,
	config: [2, { ignore: 'comments' }],
	fix: true,

	accept: [
		{
			code: 'a {}\n\n/*\n\n\n\n*/\n\nb {}',
		},
		{
			code: 'a {}\r\n\r\n/*\r\n\r\n\r\n\r\n*/\r\n\r\nb {}',
		},
		{
			code: 'a {}\n\n/**\n\n\n\n\n\n\n*/\n\nb {}',
		},
		{
			code: 'a {}\r\n\r\n/**\r\n\r\n\r\n\r\n\r\n\r\n\r\n*/\r\n\r\nb {}',
		},
		{
			code: 'a {\n display: block;\n /*\n\n\n\n */\n}\n\n',
		},
		{
			code: 'a {\r\n display: block;\r\n /*\r\n\r\n\r\n\r\n */\r\n}\r\n\r\n',
		},
	],

	reject: [
		{
			code: 'a {}\n\n/*\n\n\n\n\n*/\n\n\n\nb {}',
			fixed: 'a {}\n\n/*\n\n\n\n\n*/\n\n\nb {}',
			message: messages.expected(2),
			line: 11,
			column: 1,
		},
		{
			code: 'a {}\r\n\r\n/**\r\n\r\n\r\n\r\n\r\n*/\r\n\r\n\r\n\r\nb {}',
			fixed: 'a {}\r\n\r\n/**\r\n\r\n\r\n\r\n\r\n*/\r\n\r\n\r\nb {}',
			message: messages.expected(2),
			line: 11,
			column: 1,
		},
	],
});
