import { Root } from "hast";
import { Plugin } from "unified";
import { transform } from "./transformer";

export const rehypeTableMerge: Plugin<void[], Root> = () => {
  return (tree) => transform(tree);
};

export { transform } from "./transformer";
