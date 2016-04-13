#!/usr/bin/env bash


read -r -d '' CSS <<'EOF'
.baz {
  top:0px;
}
.foo {
   background: orange;
}
.bar {
  color:pink;
  padding: 0em;
}

EOF

echo "Normal:"

echo "$CSS" | node dist/cli.js --config=visual-config.json

echo -e "\n\nVerbose:"

echo "$CSS" | node dist/cli.js --config=visual-config.json --verbose
