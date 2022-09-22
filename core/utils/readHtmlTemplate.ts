import { readFileSync } from "fs";

export const readHtmlTemplateToPath = async function (relativePath: string) {
  const dataHtmlStr = await readFileSync(relativePath, "utf-8");
  console.log(dataHtmlStr);
};
