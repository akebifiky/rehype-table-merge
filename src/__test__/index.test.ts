import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeStringify from "rehype-stringify";
import { rehypeTableMerge } from "../index";
import path from "path";
import fs from "fs";
import prettier from "prettier";

function formatted(code: string): string {
  return prettier.format(code, { parser: "babel" });
}

test("to merge cells in hast nodes", async () => {
  const htmlFragment = fs.readFileSync(path.resolve(__dirname, "sample-fragment.html")).toString();
  const expectedHTML = fs.readFileSync(path.resolve(__dirname, "expected.html")).toString();
  unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeTableMerge)
    .use(rehypeStringify)
    .process(htmlFragment, (error, file) => {
      if (!file) {
        fail();
      }
      expect(formatted(file.toString())).toBe(formatted(expectedHTML));
    });
});
