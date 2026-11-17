const fs = require('node:fs');
const path = require('node:path');

function markdownFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) return markdownFiles(file);
    return entry.isFile() && entry.name.endsWith('.md') ? [file] : [];
  });
}

function proseLines(text) {
  let fence = null;
  return text.split(/\r?\n/).flatMap((text, index) => {
    const marker = text.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
    if (marker) {
      if (!fence) fence = marker[1];
      else if (
        marker[1][0] === fence[0] &&
        marker[1].length >= fence.length &&
        !marker[2].trim()
      ) fence = null;
      return [];
    }
    return fence ? [] : [{ text, line: index + 1 }];
  });
}

function headingAnchors(text) {
  const anchors = new Set();
  for (const { text: line } of proseLines(text)) {
    const heading = line.match(/^ {0,3}#{1,6}\s+(.+?)(?:\s+#+)?\s*$/);
    if (!heading) continue;
    const base = heading[1]
      .replace(/<[^>]*>/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\p{M}_\- ]/gu, '')
      .replace(/ /g, '-');
    let anchor = base;
    let suffix = 0;
    while (anchors.has(anchor)) anchor = `${base}-${++suffix}`;
    anchors.add(anchor);
  }
  return anchors;
}

function checkDocumentation(root) {
  root = path.resolve(root);
  const files = [
    ...['README.md', 'AGENTS.md'].map((file) => path.join(root, file)),
    ...markdownFiles(path.join(root, 'docs')),
    ...markdownFiles(path.join(root, '.agents', 'skills')),
  ].filter((file) => fs.existsSync(file));
  const errors = [];
  const headings = new Map();
  let links = 0;

  for (const file of files) {
    for (const { text, line } of proseLines(fs.readFileSync(file, 'utf8'))) {
      // Ignore literal examples; inline code in a label does not hide its link.
      const prose = text.replace(/(`+)(.*?)\1/g, '');
      const pattern = /!?\[[^\]\n]*\]\(\s*(?:<([^>\n]+)>|((?:\\.|[^()\s]|\([^()\n]*\))+))(?:\s+"[^"\n]*")?\s*\)/g;
      for (const match of prose.matchAll(pattern)) {
        const target = match[1] ?? match[2];
        const report = (message) => errors.push({
          file: path.relative(root, file), line, message: `${target}: ${message}`,
        });
        if (/^(?:\/|[a-z]:[\\/])/i.test(target) && !target.startsWith('//')) {
          report('use a relative repository path');
          continue;
        }
        if (/^(?:[a-z][\w+.-]*:|\/\/)/i.test(target)) continue;
        links += 1;
        let localPath;
        let anchor;
        try {
          const hash = target.indexOf('#');
          localPath = decodeURIComponent((hash < 0 ? target : target.slice(0, hash)).split('?')[0]);
          anchor = hash < 0 ? '' : decodeURIComponent(target.slice(hash + 1));
        } catch {
          report('invalid URL encoding');
          continue;
        }
        const destination = localPath ? path.resolve(path.dirname(file), localPath) : file;
        const relative = path.relative(root, destination);
        if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
          report('target is outside the repository');
        } else if (!fs.existsSync(destination)) {
          report('target does not exist');
        } else if (anchor && path.extname(destination) === '.md') {
          if (!headings.has(destination)) {
            headings.set(destination, headingAnchors(fs.readFileSync(destination, 'utf8')));
          }
          if (!headings.get(destination).has(anchor)) report('heading does not exist');
        }
      }
    }
  }
  return { files: files.length, links, errors };
}

if (require.main === module) {
  const result = checkDocumentation(path.resolve(__dirname, '..'));
  for (const { file, line, message } of result.errors) {
    console.error(`${file}:${line}: ${message}`);
  }
  if (result.errors.length) {
    console.error(`Documentation link check failed: ${result.errors.length} error(s).`);
    process.exitCode = 1;
  } else {
    console.log(`Documentation link check passed: ${result.links} local links in ${result.files} Markdown files.`);
  }
}

module.exports = { checkDocumentation };
