const { execFileSync } = require('node:child_process');
const { readFileSync } = require('node:fs');

const DEFAULT_BASE_REF = 'origin/main';
const baseRef = process.env.STYLE_UNITS_BASE || DEFAULT_BASE_REF;
const frontFilePattern = /^src\/.*\.(css|scss|sass|less|tsx|jsx|ts|js)$/;
const pxPattern = /(^|[^\w.-])-?\d*\.?\d+px\b/i;
const allowedMarker = 'px-ok';

const violations = [
  ...collectCommittedDiffViolations(),
  ...collectDiffViolations(['diff', '--cached', '--unified=0', '--', 'src']),
  ...collectDiffViolations(['diff', '--unified=0', '--', 'src']),
  ...collectUntrackedFileViolations(),
];

if (violations.length > 0) {
  console.error('Frontend style unit check failed.');
  console.error('Use rem for new frontend spacing, sizing, borders, radii and breakpoints.');
  console.error(`If a browser or library API requires pixels, add ${allowedMarker} with a short reason.`);
  console.error('');

  for (const violation of violations) {
    console.error(`${violation.file}:${violation.line}: ${violation.content.trim()}`);
  }

  process.exit(1);
}

console.log('Frontend style unit check passed.');

function collectCommittedDiffViolations() {
  const mergeBase = getMergeBase(baseRef);

  if (!mergeBase) {
    console.warn(`Could not resolve ${baseRef}; checking local staged and unstaged changes only.`);
    return [];
  }

  return collectDiffViolations([
    'diff',
    '--unified=0',
    `${mergeBase}..HEAD`,
    '--',
    'src',
  ]);
}

function collectDiffViolations(args) {
  const diff = runGit(args);
  const violations = [];
  let currentFile = '';
  let currentLine = 0;

  for (const rawLine of diff.split('\n')) {
    if (rawLine.startsWith('+++ b/')) {
      currentFile = rawLine.slice('+++ b/'.length);
      continue;
    }

    const hunkMatch = rawLine.match(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
    if (hunkMatch) {
      currentLine = Number(hunkMatch[1]);
      continue;
    }

    if (!currentFile || !frontFilePattern.test(currentFile)) {
      continue;
    }

    if (rawLine.startsWith('+') && !rawLine.startsWith('+++')) {
      const content = rawLine.slice(1);

      if (pxPattern.test(content) && !content.includes(allowedMarker)) {
        violations.push({
          content,
          file: currentFile,
          line: currentLine,
        });
      }

      currentLine += 1;
      continue;
    }

    if (!rawLine.startsWith('-')) {
      currentLine += 1;
    }
  }

  return violations;
}

function getMergeBase(ref) {
  try {
    return runGit(['merge-base', ref, 'HEAD']).trim();
  } catch {
    return '';
  }
}

function collectUntrackedFileViolations() {
  return runGit(['ls-files', '--others', '--exclude-standard', '--', 'src'])
    .split('\n')
    .filter((file) => frontFilePattern.test(file))
    .flatMap((file) => collectFileViolations(file));
}

function collectFileViolations(file) {
  try {
    return readFileSync(file, 'utf8')
      .split('\n')
      .flatMap((content, index) => {
        if (!pxPattern.test(content) || content.includes(allowedMarker)) {
          return [];
        }

        return [
          {
            content,
            file,
            line: index + 1,
          },
        ];
      });
  } catch {
    return [];
  }
}

function runGit(args) {
  return execFileSync('git', args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}
