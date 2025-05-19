import { parseDocument } from "htmlparser2";
import { default as renderHTML } from "dom-serializer";

export function highlightVisibleTextOnly(html: string, query: string): string {
  if (!query.trim()) return html;

  const regex = new RegExp(
    `(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi"
  );
  const root = parseDocument(html);

  const walkNodes = (nodes: any[]) => {
    for (const node of nodes) {
      if (node.type === "text") {
        const parts = node.data.split(regex);
        if (parts.length > 1) {
          const newChildren = parts.map((part: string) => {
            if (regex.test(part)) {
              return {
                type: "tag",
                name: "span",
                attribs: {
                  style: "background-color: yellow; color: black;",
                },
                children: [{ type: "text", data: part }],
              };
            }
            return { type: "text", data: part };
          });
          Object.assign(node, {
            type: "tag",
            name: "span",
            children: newChildren,
            attribs: {},
          });
        }
      } else if (node.children) {
        walkNodes(node.children);
      }
    }
  };

  walkNodes(root.children);
  return renderHTML(root);
}
