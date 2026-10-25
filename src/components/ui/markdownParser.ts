export interface InlineToken {
  type: 'text' | 'bold' | 'italic' | 'bold_italic' | 'code' | 'strikethrough' | 'link';
  text: string;
  url?: string;
}

/**
 * Tokenizes an inline markdown string into styled fragments.
 */
export function tokenizeInline(text: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  // Regex to match: ***bold_italic***, **bold**, *italic*, `code`, ~~strike~~, [link](url)
  const regex = /(\*\*\*[\s\S]+?\*\*\*|\*\*[\s\S]+?\*\*|\*[\s\S]+?\*|`[^`]+?`|~~[\s\S]+?~~|\[[^\]]+\]\([^)]+\))/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({
        type: 'text',
        text: text.slice(lastIndex, match.index),
      });
    }

    const matchedStr = match[0];
    if (matchedStr.startsWith('***') && matchedStr.endsWith('***') && matchedStr.length >= 6) {
      tokens.push({
        type: 'bold_italic',
        text: matchedStr.slice(3, -3),
      });
    } else if (matchedStr.startsWith('**') && matchedStr.endsWith('**') && matchedStr.length >= 4) {
      tokens.push({
        type: 'bold',
        text: matchedStr.slice(2, -2),
      });
    } else if (matchedStr.startsWith('*') && matchedStr.endsWith('*') && matchedStr.length >= 2) {
      tokens.push({
        type: 'italic',
        text: matchedStr.slice(1, -1),
      });
    } else if (matchedStr.startsWith('`') && matchedStr.endsWith('`') && matchedStr.length >= 2) {
      tokens.push({
        type: 'code',
        text: matchedStr.slice(1, -1),
      });
    } else if (matchedStr.startsWith('~~') && matchedStr.endsWith('~~') && matchedStr.length >= 4) {
      tokens.push({
        type: 'strikethrough',
        text: matchedStr.slice(2, -2),
      });
    } else if (matchedStr.startsWith('[') && matchedStr.includes('](') && matchedStr.endsWith(')')) {
      const closeBracket = matchedStr.indexOf('](');
      const linkText = matchedStr.slice(1, closeBracket);
      const url = matchedStr.slice(closeBracket + 2, -1);
      tokens.push({
        type: 'link',
        text: linkText,
        url,
      });
    } else {
      tokens.push({
        type: 'text',
        text: matchedStr,
      });
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    tokens.push({
      type: 'text',
      text: text.slice(lastIndex),
    });
  }

  return tokens;
}

export interface Block {
  type:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'p'
    | 'bullet'
    | 'number'
    | 'quote'
    | 'codeblock'
    | 'table'
    | 'hr';
  content?: string;
  items?: { prefix?: string; text: string; indent?: number }[];
  headers?: string[];
  rows?: string[][];
  language?: string;
}

/**
 * Parses markdown document into structured block nodes.
 */
export function parseBlocks(markdown: string): Block[] {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // 1. Fenced Code Blocks (```)
    if (trimmed.startsWith('```')) {
      const language = trimmed.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      if (i < lines.length) i++; // skip closing ```
      blocks.push({
        type: 'codeblock',
        content: codeLines.join('\n'),
        language,
      });
      continue;
    }

    // 2. Horizontal Rules (--- or *** or ___)
    if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      blocks.push({ type: 'hr' });
      i++;
      continue;
    }

    // 3. Headings
    if (trimmed.startsWith('# ') || trimmed.startsWith('## ') || trimmed.startsWith('### ') || trimmed.startsWith('#### ')) {
      if (trimmed.startsWith('#### ')) {
        blocks.push({ type: 'h4', content: trimmed.slice(5).trim() });
      } else if (trimmed.startsWith('### ')) {
        blocks.push({ type: 'h3', content: trimmed.slice(4).trim() });
      } else if (trimmed.startsWith('## ')) {
        blocks.push({ type: 'h2', content: trimmed.slice(3).trim() });
      } else {
        blocks.push({ type: 'h1', content: trimmed.slice(2).trim() });
      }
      i++;
      continue;
    }

    // 4. Blockquotes (> ...)
    if (trimmed.startsWith('> ') || trimmed === '>') {
      const quoteLines: string[] = [];
      while (i < lines.length && (lines[i].trim().startsWith('> ') || lines[i].trim() === '>')) {
        const line = lines[i].trim();
        quoteLines.push(line.startsWith('> ') ? line.slice(2) : line.slice(1));
        i++;
      }
      blocks.push({
        type: 'quote',
        content: quoteLines.join('\n'),
      });
      continue;
    }

    // 5. Tables (| col1 | col2 |)
    if (trimmed.startsWith('|') && trimmed.endsWith('|') && trimmed.length > 2) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }

      if (tableLines.length >= 2) {
        const parseRow = (line: string) =>
          line
            .slice(1, -1)
            .split('|')
            .map((c) => c.trim());

        const headers = parseRow(tableLines[0]);
        const isSeparator = /^\|?[\s:-|-]+\|?$/.test(tableLines[1]);
        const dataStart = isSeparator ? 2 : 1;
        const rows = tableLines.slice(dataStart).map(parseRow);

        blocks.push({
          type: 'table',
          headers,
          rows,
        });
        continue;
      }
    }

    // 6. Bullet lists (- or * or •)
    const bulletMatch = rawLine.match(/^(\s*)([-*•])\s+(.+)$/);
    if (bulletMatch) {
      const items: { prefix?: string; text: string; indent?: number }[] = [];
      while (i < lines.length) {
        const match = lines[i].match(/^(\s*)([-*•])\s+(.+)$/);
        if (!match) break;
        items.push({
          indent: Math.floor(match[1].length / 2),
          text: match[3],
        });
        i++;
      }
      blocks.push({
        type: 'bullet',
        items,
      });
      continue;
    }

    // 7. Numbered lists (1. or 2.)
    const numberMatch = rawLine.match(/^(\s*)(\d+)\.\s+(.+)$/);
    if (numberMatch) {
      const items: { prefix?: string; text: string; indent?: number }[] = [];
      while (i < lines.length) {
        const match = lines[i].match(/^(\s*)(\d+)\.\s+(.+)$/);
        if (!match) break;
        items.push({
          prefix: `${match[2]}.`,
          indent: Math.floor(match[1].length / 2),
          text: match[3],
        });
        i++;
      }
      blocks.push({
        type: 'number',
        items,
      });
      continue;
    }

    // 8. Normal Paragraph (skip blank lines or empty text)
    if (trimmed.length > 0) {
      const paragraphLines: string[] = [];
      while (
        i < lines.length &&
        lines[i].trim().length > 0 &&
        !lines[i].trim().startsWith('#') &&
        !lines[i].trim().startsWith('```') &&
        !lines[i].trim().startsWith('> ') &&
        !lines[i].trim().startsWith('|') &&
        !lines[i].match(/^(\s*)([-*•]|\d+\.)\s+/) &&
        lines[i].trim() !== '---' &&
        lines[i].trim() !== '***'
      ) {
        paragraphLines.push(lines[i].trim());
        i++;
      }
      blocks.push({
        type: 'p',
        content: paragraphLines.join(' '),
      });
      continue;
    }

    i++;
  }

  return blocks;
}
