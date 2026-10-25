import {
  tokenizeInline,
  parseBlocks,
} from './markdownParser';

describe('markdownParser unit tests', () => {
  describe('tokenizeInline', () => {
    it('returns a single text token for plain text', () => {
      const tokens = tokenizeInline('안녕하세요 반갑습니다.');
      expect(tokens).toEqual([
        { type: 'text', text: '안녕하세요 반갑습니다.' },
      ]);
    });

    it('parses bold text correctly', () => {
      const tokens = tokenizeInline('This is **bold** text');
      expect(tokens).toEqual([
        { type: 'text', text: 'This is ' },
        { type: 'bold', text: 'bold' },
        { type: 'text', text: ' text' },
      ]);
    });

    it('parses italic text correctly', () => {
      const tokens = tokenizeInline('This is *italic* text');
      expect(tokens).toEqual([
        { type: 'text', text: 'This is ' },
        { type: 'italic', text: 'italic' },
        { type: 'text', text: ' text' },
      ]);
    });

    it('parses bold italic text correctly', () => {
      const tokens = tokenizeInline('This is ***bold and italic*** text');
      expect(tokens).toEqual([
        { type: 'text', text: 'This is ' },
        { type: 'bold_italic', text: 'bold and italic' },
        { type: 'text', text: ' text' },
      ]);
    });

    it('parses inline code / Hangul particle badges', () => {
      const tokens = tokenizeInline('Use `은/는` for topic and `이/가` for subject.');
      expect(tokens).toEqual([
        { type: 'text', text: 'Use ' },
        { type: 'code', text: '은/는' },
        { type: 'text', text: ' for topic and ' },
        { type: 'code', text: '이/가' },
        { type: 'text', text: ' for subject.' },
      ]);
    });

    it('parses strikethrough text', () => {
      const tokens = tokenizeInline('This is ~~deleted~~ text.');
      expect(tokens).toEqual([
        { type: 'text', text: 'This is ' },
        { type: 'strikethrough', text: 'deleted' },
        { type: 'text', text: ' text.' },
      ]);
    });

    it('parses markdown links', () => {
      const tokens = tokenizeInline('Check [Klearn](https://klearn.app) here.');
      expect(tokens).toEqual([
        { type: 'text', text: 'Check ' },
        { type: 'link', text: 'Klearn', url: 'https://klearn.app' },
        { type: 'text', text: ' here.' },
      ]);
    });
  });

  describe('parseBlocks', () => {
    it('parses headings #, ##, ###, ####', () => {
      const md = '# Title\n## Section\n### Subheading\n#### Details';
      const blocks = parseBlocks(md);

      expect(blocks).toEqual([
        { type: 'h1', content: 'Title' },
        { type: 'h2', content: 'Section' },
        { type: 'h3', content: 'Subheading' },
        { type: 'h4', content: 'Details' },
      ]);
    });

    it('parses bullet lists with nested indentation', () => {
      const md = '- Item 1\n- Item 2\n  - Subitem 2.1';
      const blocks = parseBlocks(md);

      expect(blocks).toHaveLength(1);
      expect(blocks[0].type).toBe('bullet');
      expect(blocks[0].items).toEqual([
        { indent: 0, text: 'Item 1' },
        { indent: 0, text: 'Item 2' },
        { indent: 1, text: 'Subitem 2.1' },
      ]);
    });

    it('parses numbered lists', () => {
      const md = '1. First step\n2. Second step';
      const blocks = parseBlocks(md);

      expect(blocks).toHaveLength(1);
      expect(blocks[0].type).toBe('number');
      expect(blocks[0].items).toEqual([
        { prefix: '1.', indent: 0, text: 'First step' },
        { prefix: '2.', indent: 0, text: 'Second step' },
      ]);
    });

    it('parses blockquotes', () => {
      const md = '> Pro Tip: Remember that 은/는 indicates contrast.';
      const blocks = parseBlocks(md);

      expect(blocks).toEqual([
        {
          type: 'quote',
          content: 'Pro Tip: Remember that 은/는 indicates contrast.',
        },
      ]);
    });

    it('parses fenced code blocks', () => {
      const md = '```korean\n가다 -> 가요\n오다 -> 와요\n```';
      const blocks = parseBlocks(md);

      expect(blocks).toEqual([
        {
          type: 'codeblock',
          content: '가다 -> 가요\n오다 -> 와요',
          language: 'korean',
        },
      ]);
    });

    it('parses markdown tables', () => {
      const md = '| Particle | Role |\n| --- | --- |\n| 은/는 | Topic |\n| 이/가 | Subject |';
      const blocks = parseBlocks(md);

      expect(blocks).toHaveLength(1);
      expect(blocks[0].type).toBe('table');
      expect(blocks[0].headers).toEqual(['Particle', 'Role']);
      expect(blocks[0].rows).toEqual([
        ['은/는', 'Topic'],
        ['이/가', 'Subject'],
      ]);
    });

    it('parses horizontal rules', () => {
      const md = 'Above\n\n---\n\nBelow';
      const blocks = parseBlocks(md);

      expect(blocks).toEqual([
        { type: 'p', content: 'Above' },
        { type: 'hr' },
        { type: 'p', content: 'Below' },
      ]);
    });

    it('handles Korean mixed markdown without crashing', () => {
      const md = `### 📌 Topic (은/는) vs. Subject (이/가)

**1. Topic Particle: 은/는**
- Focuses on **what the topic is**, contrast, or setting general background information.
- Example: **저는 학생이에요.** (*As for me, I am a student.*)

| Particle | Usage |
| --- | --- |
| \`은\` | Consonant ending |
| \`는\` | Vowel ending |

> 💡 **Pro Tip**: Use \`은/는\` when introducing yourself!`;

      const blocks = parseBlocks(md);
      expect(blocks.length).toBeGreaterThan(3);
      expect(blocks[0].type).toBe('h3');
      expect(blocks[1].type).toBe('p');
      expect(blocks[2].type).toBe('bullet');
      expect(blocks[3].type).toBe('table');
      expect(blocks[4].type).toBe('quote');
    });
  });
});
