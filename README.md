# rehype-table-merge

`rehype-table-merge` is a [rehype](https://github.com/rehypejs/rehype) plugin for merging cells of table elements.

It is especially intended to be used for transforming output by [remark](https://github.com/remarkjs/remark).

## Usage

Install plugin with:

```bash
npm install rehype-table-merge
```

### Example

```javascript
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGFM from "remark-gfm";
import remarkRehype from "remark-rehype";
import { rehypeTableMerge } from "rehype-table-merge";
import rehypeStringify from "rehype-stringify";

const markdown = `
# This is a sample markdown

| Head 1       | Head 2       | Head 3       | Head 4       |
| ------------ | ------------ | ------------ | ------------ |
| >            | Merged (2x1) | Cell         | Cell         |
| Merged (1x3) | >            | Merged (2x2) | Cell         |
| ^            | >            | ^            | Cell         |
| ^            | >            | >            | Merged (3x1) |
`;

unified()
  .use(remarkParse)
  .use(remarkGFM)
  .use(remarkRehype)
  .use(rehypeTableMerge)
  .use(rehypeStringify)
  .process(markdown)
  .then((file) => {
    console.log(file.toString());
  });
```

Yields: 

```html
<h1>This is a sample markdown</h1>
<table>
    <thead>
        <tr>
            <th align="none">Head 1</th>
            <th align="none">Head 2</th>
            <th align="none">Head 3</th>
            <th align="none">Head 4</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td align="none" colspan="2">Merged (2x1)</td>
            <td align="none">Cell</td>
            <td align="none">Cell</td>
        </tr>
        <tr>
            <td align="none" rowspan="3">Merged (1x3)</td>
            <td align="none" colspan="2" rowspan="2">Merged (2x2)</td>
            <td align="none">Cell</td>
        </tr>
        <tr>
            <td align="none">Cell</td>
        </tr>
        <tr>
            <td align="none" colspan="3">Merged (3x1)</td>
        </tr>
    </tbody>
</table>
```

In the above example, the following plugins are used together:

- [`remark-parse`](https://github.com/remarkjs/remark/tree/main/packages/remark-parse) ... parses string to [`mdast`](https://github.com/syntax-tree/mdast) (Markdown AST)
- [`remark-gfm`](https://github.com/remarkjs/remark-gfm) ... transforms `mdast` tree to support [GFM](https://github.github.com/gfm/) (GitHub Flavored Markdown)
- [`remark-rehype`](https://github.com/remarkjs/remark-rehype) ... parses `mdast` to [`hast`](https://github.com/syntax-tree/hast) (Hypertext AST)
- [`rehype-stringify`](https://github.com/rehypejs/rehype/tree/main/packages/rehype-stringify) ... parses `hast` to HTML string



## Integrating with CommonJS tools

This plugin also supports CommonJS format.

```javascript
const rehypeTableMerge = require("rehype-table-merge").rehypeTableMerge;
```

### with Docusaurus

For example, current version [Docusaurus](https://docusaurus.io/) does not support ESM module natively.

So you can use this plugin as CommonJS format in its rehype plugin config like following:

```javascript
const rehypeTableMerge = require("rehype-table-merge").rehypeTableMerge;

const config = {
  // ... your settings
  presets: [
    [
      "classic",
      {
        docs: {
          // ... your settings
          rehypePlugins: [rehypeTableMerge],
        },
      },
    ],
  ],
}
```

