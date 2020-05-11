'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: [2],
	syntax: 'css-in-js',
	fix: true,

	accept: [
		{
			code: `
export default <img style={{ transform: 'translate(1, 1)', display: 'block' }} />;
`,
		},
		{
			code: `
export default <img style={{
  transform: 'translate(1, 1)'
}} />;
`,
		},
		{
			code: `
export default <img style=
  {
    {
      transform: 'translate(1, 1)'
    }
  }
/>;
`,
		},
		{
			code: `
import styled, { css } from "styled-components";
const Message = styled.p\`
  padding: 10px;
  \${(props) => css\`
    color: #b02d00;
  \`}
\`;
`,
		},
		{
			code: `
import styled, { css } from "styled-components";
const Message = styled.p\`
  padding: 10px;
  \${(props) => css\`
  color: #b02d00;
  \`}
\`;
`,
		},
	],
	reject: [
		{
			code: `
export default <img style={{
    transform: 'translate(1, 1)'
}} />;
`,
			fixed: `
export default <img style={{
  transform: 'translate(1, 1)'
}} />;
`,
			message: messages.expected('2 spaces'),
			line: 3,
			column: 4,
		},
		{
			code: `
import styled, { css } from "styled-components";
const Message = styled.p\`
  padding: 10px;
  \${(props) => css\`
   color: #b02d00;
  \`}
\`;
`,
			fixed: `
import styled, { css } from "styled-components";
const Message = styled.p\`
  padding: 10px;
  \${(props) => css\`
    color: #b02d00;
  \`}
\`;
`,
			message: messages.expected('4 spaces'),
			line: 6,
			column: 4,
		},
		{
			code: `
import styled, { css } from "styled-components";
const Message = styled.p\`
  padding: 10px;
  \${(props) => css\`
color: #b02d00;
  \`}
\`;
`,
			fixed: `
import styled, { css } from "styled-components";
const Message = styled.p\`
padding: 10px;
\${(props) => css\`
color: #b02d00;
  \`}
\`;
`,
			warnings: [
				{
					message: messages.expected('0 spaces'),
					line: 4,
					column: 3,
				},
				{
					message: messages.expected('0 spaces'),
					line: 5,
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
			baseIndentLevel: 1,
		},
	],
	syntax: 'css-in-js',
	fix: true,

	accept: [
		{
			code: `
import styled from "styled-components";
export default styled.div\`
\tcolor: #00;
\`;`,
		},
		{
			code: `
\timport styled from "styled-components";
\texport default styled.div\`
\t\tcolor: #00;
\t\`;`,
		},
	],
	reject: [
		{
			code: `
import styled from "styled-components";
export default styled.div\`
color: #00;
\`;`,
			fixed: `
import styled from "styled-components";
export default styled.div\`
\tcolor: #00;
\`;`,
			message: messages.expected('1 tab'),
			line: 4,
			column: 1,
		},
		{
			code: `
\timport styled from "styled-components";
\texport default styled.div\`
\tcolor: #00;
\t\`;`,
			fixed: `
\timport styled from "styled-components";
\texport default styled.div\`
\t\tcolor: #00;
\t\`;`,
			message: messages.expected('2 tabs'),
			line: 4,
			column: 2,
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
	syntax: 'css-in-js',
	fix: true,

	accept: [
		{
			code: `
import styled from "styled-components";
export default styled.div\`
color: #00;
\`;`,
		},
		{
			code: `
\timport styled from "styled-components";
\texport default styled.div\`
\tcolor: #00;
\t\`;`,
		},
	],
	reject: [
		{
			code: `
import styled from "styled-components";
export default styled.div\`
\tcolor: #00;
\`;`,
			fixed: `
import styled from "styled-components";
export default styled.div\`
color: #00;
\`;`,
			message: messages.expected('0 tabs'),
			line: 4,
			column: 2,
		},
		{
			code: `
\timport styled from "styled-components";
\texport default styled.div\`
\t\tcolor: #00;
\t\`;`,
			fixed: `
\timport styled from "styled-components";
\texport default styled.div\`
\tcolor: #00;
\t\`;`,
			message: messages.expected('1 tab'),
			line: 4,
			column: 3,
		},
	],
});
