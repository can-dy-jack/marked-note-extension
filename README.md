# marked-note-extension
an note extension for marked.


use: 
```js
import { marked } from "marked";
import extensions from "./index.js";

marked.use(extensions);

const content = marked.parse(`!!! info Publish ESM and CJS in a single package
In the past decade, due to the lack of a standard module system of \`JavaScript\`, **CommonJS** (a.k.a the \`require('xxx')\` and \`module.exports\` syntax) has been the way how Node.js and NPM packages work. Until 2015, when ECMAScript modules finally show up as the standard solution, the community start migrating to native ESM gradually.
!!!`);

console.log(content);
```