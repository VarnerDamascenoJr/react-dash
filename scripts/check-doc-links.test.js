import { afterEach, describe, expect, it } from 'vitest';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import checker from './check-doc-links.cjs';

const roots = [];

function fixture(files) {
  const root = mkdtempSync(path.join(tmpdir(), 'react-dash-doc-links-'));
  roots.push(root);
  for (const [name, text] of Object.entries(files)) {
    const file = path.join(root, name);
    mkdirSync(path.dirname(file), { recursive: true });
    writeFileSync(file, text);
  }
  return root;
}

afterEach(() => roots.splice(0).forEach((root) => rmSync(root, { recursive: true })));

describe('documentation links', () => {
  it('resolves links from the containing file, including nested skills and encoded filenames', () => {
    const root = fixture({
      'README.md': '[Guide](docs/guide.md#api--storage)',
      'docs/guide.md': '# API & Storage\n[File](../src/My%20File.ts)\n[Image](<diagram (1).svg>)',
      'docs/diagram (1).svg': '<svg/>',
      'src/My File.ts': 'export {};',
      '.agents/skills/example/SKILL.md': '[Guide](../../../docs/guide.md#api--storage)',
    });
    expect(checker.checkDocumentation(root)).toEqual({ files: 3, links: 4, errors: [] });
  });

  it('reports missing files and headings with the document and line number', () => {
    const root = fixture({
      'README.md': '[Removed](docs/removed.md)\n[Old section](docs/guide.md#old-section)',
      'docs/guide.md': '# Current section',
    });
    expect(checker.checkDocumentation(root).errors).toEqual([
      { file: 'README.md', line: 1, message: 'docs/removed.md: target does not exist' },
      { file: 'README.md', line: 2, message: 'docs/guide.md#old-section: heading does not exist' },
    ]);
  });

  it('rejects personal paths and links outside the repository even when the target exists', () => {
    const root = fixture({
      'README.md': `[Personal](${path.join(tmpdir(), 'private.md')})\n[Parent](../)`,
    });
    expect(checker.checkDocumentation(root).errors.map(({ message }) => message)).toEqual([
      `${path.join(tmpdir(), 'private.md')}: use a relative repository path`,
      '../: target is outside the repository',
    ]);
  });

  it('ignores network links and code examples without ignoring links with code labels', () => {
    const root = fixture({
      'README.md': [
        '[Website](https://example.com/missing)',
        '[Mail](mailto:test@example.com)',
        '`[Example](missing.md)`',
        '````markdown',
        '```',
        '[Example](missing.md)',
        '````',
        '~~~markdown',
        '[Example](missing.md)',
        '~~~',
        '[`Actual link`](docs/guide.md)',
      ].join('\n'),
      'docs/guide.md': '# Guide',
    });
    expect(checker.checkDocumentation(root)).toEqual({ files: 2, links: 1, errors: [] });
  });

  it('supports duplicate heading fragments and excludes fenced headings', () => {
    const root = fixture({
      'README.md': '[First](#guide)\n[Second](#guide-1)\n[Third](#guide-1-1)\n# Guide\n# Guide\n# Guide-1\n```md\n# Example\n```\n[Missing](#example)',
    });
    expect(checker.checkDocumentation(root).errors).toEqual([
      { file: 'README.md', line: 10, message: '#example: heading does not exist' },
    ]);
  });

  it('reports malformed URL encoding without crashing', () => {
    const root = fixture({ 'README.md': '[Broken](docs/%broken.md)' });
    expect(checker.checkDocumentation(root).errors).toEqual([
      { file: 'README.md', line: 1, message: 'docs/%broken.md: invalid URL encoding' },
    ]);
  });
});
