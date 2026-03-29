import type { ReactNode } from "react";

type PseoRichTextProps = {
  body: string;
};

type Block =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[]; ordered: boolean }
  | { type: "table"; rows: string[][] };

function parseTableLine(line: string): string[] {
  return line
    .split("|")
    .slice(1, -1)
    .map((cell) => cell.trim());
}

function isTableDivider(line: string): boolean {
  return /^(\|\s*:?-{3,}:?\s*)+\|$/.test(line.trim());
}

function renderInlineText(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const tokenPattern = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let lastIndex = 0;

  for (const match of text.matchAll(tokenPattern)) {
    const token = match[0];
    const start = match.index ?? 0;

    if (start > lastIndex) {
      nodes.push(text.slice(lastIndex, start));
    }

    if (token.startsWith("**") && token.endsWith("**")) {
      nodes.push(<strong key={`${start}-strong`}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("`") && token.endsWith("`")) {
      nodes.push(
        <code
          key={`${start}-code`}
          className="rounded-sm bg-ds-backgroundSecondary px-1.5 py-0.5 text-[0.95em] text-ds-text-primary dark:bg-ds-dark-backgroundTertiary dark:text-ds-dark-text-primary"
        >
          {token.slice(1, -1)}
        </code>,
      );
    } else {
      nodes.push(token);
    }

    lastIndex = start + token.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes.length ? nodes : [text];
}

function parseBlocks(body: string): Block[] {
  const blocks: Block[] = [];
  const lines = body.split("\n");
  let index = 0;

  const pushParagraph = (buffer: string[]) => {
    const text = buffer.join(" ").replace(/\s+/g, " ").trim();
    if (text) {
      blocks.push({ type: "paragraph", text });
      buffer.length = 0;
    }
  };

  while (index < lines.length) {
    const line = lines[index].trimEnd();
    const trimmed = line.trim();

    if (!trimmed) {
      index += 1;
      continue;
    }

    if (/^#{2,3}\s+/.test(trimmed)) {
      blocks.push({ type: "heading", text: trimmed.replace(/^#{2,3}\s+/, "") });
      index += 1;
      continue;
    }

    if (trimmed.startsWith("|")) {
      const tableLines: string[] = [];
      while (index < lines.length && lines[index].trim().startsWith("|")) {
        tableLines.push(lines[index].trim());
        index += 1;
      }

      const rowLines = tableLines.filter((tableLine) => !isTableDivider(tableLine));
      blocks.push({
        type: "table",
        rows: rowLines.map(parseTableLine),
      });
      continue;
    }

    if (/^-\s+/.test(trimmed) || /^\d+\.\s+/.test(trimmed)) {
      const ordered = /^\d+\.\s+/.test(trimmed);
      const items: string[] = [];

      while (index < lines.length) {
        const current = lines[index].trim();
        if (
          ordered
            ? /^\d+\.\s+/.test(current)
            : /^-\s+/.test(current)
        ) {
          items.push(current.replace(ordered ? /^\d+\.\s+/ : /^-\s+/, ""));
          index += 1;
          continue;
        }
        break;
      }

      blocks.push({ type: "list", items, ordered });
      continue;
    }

    const paragraph: string[] = [];
    while (index < lines.length) {
      const current = lines[index].trim();
      if (
        !current ||
        /^#{2,3}\s+/.test(current) ||
        current.startsWith("|") ||
        /^-\s+/.test(current) ||
        /^\d+\.\s+/.test(current)
      ) {
        break;
      }
      paragraph.push(current);
      index += 1;
    }

    pushParagraph(paragraph);
  }

  return blocks;
}

export function PseoRichText({ body }: PseoRichTextProps) {
  const blocks = parseBlocks(body);
  const fallbackParagraphs = body
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  return (
    <div className="space-y-5 text-sm leading-7 text-ds-textSecondary dark:text-ds-dark-textTertiary md:text-base">
      {!blocks.length && fallbackParagraphs.length
        ? fallbackParagraphs.map((paragraph, index) => (
            <p key={`fallback-${index}`}>{renderInlineText(paragraph)}</p>
          ))
        : null}
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          return (
            <h4
              key={`heading-${index}`}
              className="font-f37stout text-lg text-ds-text-primary dark:text-ds-dark-text-primary"
            >
              {block.text}
            </h4>
          );
        }

        if (block.type === "list") {
          const ListTag = block.ordered ? "ol" : "ul";
          return (
            <ListTag
              key={`list-${index}`}
              className={`space-y-3 pl-5 ${block.ordered ? "list-decimal" : "list-disc"}`}
            >
              {block.items.map((item, itemIndex) => (
                <li key={`item-${itemIndex}`} className="pl-1">
                  {renderInlineText(item)}
                </li>
              ))}
            </ListTag>
          );
        }

        if (block.type === "table") {
          const [header, ...rows] = block.rows;
          return (
            <div
              key={`table-${index}`}
              className="overflow-x-auto rounded-sm border border-ds-border dark:border-ds-dark-border"
            >
              <table className="min-w-full border-collapse text-left text-sm">
                <thead className="bg-ds-backgroundSecondary dark:bg-ds-dark-backgroundTertiary">
                  <tr>
                    {header.map((cell, cellIndex) => (
                      <th
                        key={`head-${cellIndex}`}
                        className="border-b border-ds-border px-4 py-3 font-medium text-ds-text-primary dark:border-ds-dark-border dark:text-ds-dark-text-primary"
                      >
                        {cell}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, rowIndex) => (
                    <tr
                      key={`row-${rowIndex}`}
                      className="border-b border-dashed border-ds-border last:border-b-0 dark:border-ds-dark-border"
                    >
                      {row.map((cell, cellIndex) => (
                        <td
                          key={`cell-${rowIndex}-${cellIndex}`}
                          className="px-4 py-3 align-top text-ds-textSecondary dark:text-ds-dark-textTertiary"
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        return (
          <p key={`paragraph-${index}`}>{renderInlineText(block.text)}</p>
        );
      })}
    </div>
  );
}
