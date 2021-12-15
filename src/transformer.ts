import { Element, Root } from "hast";
import { select, selectAll } from "hast-util-select";

const MERGE_TO_UPPER = "^";
const MERGE_TO_RIGHT = ">";

/**
 * Transform all tables in the tree
 *
 * @param tree The root node of the hast tree
 */
export function transform(tree: Root): void {
  selectAll("table", tree).forEach((table) => {
    const thead = select("thead", table);
    thead && transformTable(thead);
    const tbody = select("tbody", table);
    tbody && transformTable(tbody);
  });
}

/**
 * Returns whether the element indicates "merge right" or not.
 *
 * @param cell TD or TR element node
 * @returns {@code true} if the element indicates "merge right", otherwise {@code false}
 */
function isRightMergeCell(cell?: Element): boolean {
  return (
    cell !== undefined &&
    (cell.tagName === "td" || cell.tagName === "th") &&
    cell.children.length === 1 &&
    cell.children[0].type === "text" &&
    cell.children[0].value.trim() === MERGE_TO_RIGHT
  );
}

/**
 * Returns whether the element indicates "merge upper" or not.
 *
 * @param cell TD or TR element node
 * @returns {@code true} if the element indicates "merge upper", otherwise {@code false}
 */
function isUpperMergeCell(cell?: Element): boolean {
  return (
    cell !== undefined &&
    (cell.tagName === "td" || cell.tagName === "th") &&
    cell.children.length === 1 &&
    cell.children[0].type === "text" &&
    cell.children[0].value.trim() === MERGE_TO_UPPER
  );
}

/**
 * Merge cells in the given table body
 *
 * @param tableBody The table body (tbody or thead)
 */
function transformTable(tableBody: Element): void {
  const matrix: Element[][] = selectAll("tr", tableBody).map((row) => selectAll("th,td", row));
  const transformedMatrix: Element[][] = [];
  const tableHeight = matrix.length;
  const tableWidth = Math.max(...matrix.map((row) => row.length));

  for (const row of matrix) {
    let colspan = 1;
    const transformedRow: Element[] = [];
    for (const cell of row) {
      if (isRightMergeCell(cell)) {
        colspan++;
        continue;
      }
      transformedRow.push({
        ...cell,
        properties:
          colspan > 1
            ? {
                ...cell.properties,
                colspan: colspan,
              }
            : cell.properties,
      });
      colspan = 1;
    }
    transformedMatrix.push(transformedRow);
  }

  for (let columnIndex = tableWidth - 1; columnIndex >= 0; columnIndex--) {
    let rowspan = 1;
    for (let rowIndex = tableHeight - 1; rowIndex >= 0; rowIndex--) {
      const cell = transformedMatrix[rowIndex][columnIndex];
      if (isUpperMergeCell(cell)) {
        rowspan++;
        transformedMatrix[rowIndex].splice(columnIndex, 1);
        continue;
      }
      if (cell !== undefined) {
        cell.properties =
          rowspan > 1
            ? {
                ...cell.properties,
                rowspan: rowspan,
              }
            : cell.properties;
      }
      rowspan = 1;
    }
  }

  selectAll("tr", tableBody).forEach((row, rowIndex) => {
    row.children = transformedMatrix[rowIndex] || [];
  });
}
