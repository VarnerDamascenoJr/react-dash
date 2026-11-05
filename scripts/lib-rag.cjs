#!/usr/bin/env node

const crypto = require("node:crypto");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const sourceConfigPath = path.join(
  projectRoot,
  "docs",
  "agentic",
  "external-doc-sources.json",
);
const packageJsonPath = path.join(projectRoot, "package.json");
const packageLockPath = path.join(projectRoot, "package-lock.json");
const cacheRoot =
  process.env.REACT_DASH_LIB_RAG_CACHE ||
  path.join(os.homedir(), ".cache", "react-dash-lib-rag");
const manifestPath = path.join(cacheRoot, "manifest.json");

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "as",
  "by",
  "com",
  "da",
  "de",
  "do",
  "does",
  "e",
  "em",
  "for",
  "from",
  "how",
  "in",
  "is",
  "it",
  "no",
  "o",
  "of",
  "on",
  "or",
  "para",
  "que",
  "the",
  "to",
  "um",
  "uma",
  "use",
  "with",
]);

function printUsage() {
  console.log(`
Usage:
  npm run rag:sources -- [filter]
  npm run rag:fetch -- [--all | --library <name>] [--url <official-url>]
  npm run rag:query -- <query> [--library <name>] [--limit <n>] [--refresh] [--json]

Examples:
  npm run rag:sources -- react
  npm run rag:fetch -- --library React --url https://react.dev/reference/react/useMemo
  npm run rag:query -- "React useMemo dependencies" --library React
`);
}

function parseArgs(argv) {
  const args = { positional: [] };

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];

    if (value === "--all") {
      args.all = true;
    } else if (value === "--json") {
      args.json = true;
    } else if (value === "--refresh") {
      args.refresh = true;
    } else if (value === "--library") {
      args.library = argv[index + 1];
      index += 1;
    } else if (value === "--limit") {
      args.limit = Number.parseInt(argv[index + 1], 10);
      index += 1;
    } else if (value === "--url") {
      args.urls = args.urls || [];
      args.urls.push(argv[index + 1]);
      index += 1;
    } else {
      args.positional.push(value);
    }
  }

  return args;
}

async function readSources() {
  const raw = await fs.readFile(sourceConfigPath, "utf8");
  const parsed = JSON.parse(raw);

  if (!Array.isArray(parsed.libraries)) {
    throw new Error(`Invalid source config: missing libraries in ${sourceConfigPath}`);
  }

  return hydrateLibraryVersions(parsed.libraries, await readPackageVersions());
}

async function readPackageVersions() {
  const [packageJsonRaw, packageLockRaw] = await Promise.all([
    fs.readFile(packageJsonPath, "utf8"),
    fs.readFile(packageLockPath, "utf8"),
  ]);
  const packageJson = JSON.parse(packageJsonRaw);
  const packageLock = JSON.parse(packageLockRaw);
  const declaredRanges = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };

  return {
    declaredRanges,
    installedVersions: Object.fromEntries(
      Object.entries(packageLock.packages || {})
        .filter(([packagePath, value]) => packagePath.startsWith("node_modules/") && value.version)
        .map(([packagePath, value]) => [
          packagePath.replace(/^node_modules\//, ""),
          value.version,
        ]),
    ),
  };
}

function hydrateLibraryVersions(libraries, versions) {
  return libraries.map((library) => {
    if (!library.package || library.package === "web-platform") {
      return library;
    }

    return {
      ...library,
      declaredRange: versions.declaredRanges[library.package] || null,
      installedVersion: versions.installedVersions[library.package] || null,
      versionSource: versions.installedVersions[library.package]
        ? "package-lock.json"
        : "not installed",
    };
  });
}

function normalize(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function slugify(value) {
  return normalize(value).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function tokenize(value) {
  return normalize(value)
    .split(/[^a-z0-9@./_-]+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));
}

function hash(value) {
  return crypto.createHash("sha256").update(value).digest("hex").slice(0, 16);
}

function findLibrary(libraries, requestedName) {
  if (!requestedName) {
    return undefined;
  }

  const requested = normalize(requestedName);
  return libraries.find((library) => {
    return (
      normalize(library.name) === requested ||
      normalize(library.package || "") === requested ||
      slugify(library.name) === slugify(requestedName)
    );
  });
}

function originAllowedForLibrary(library, urlValue) {
  const target = new URL(urlValue);

  return library.officialDocs.some((officialDoc) => {
    const source = new URL(officialDoc);
    return target.origin === source.origin;
  });
}

async function readManifest() {
  try {
    const raw = await fs.readFile(manifestPath, "utf8");
    const manifest = JSON.parse(raw);
    return Array.isArray(manifest.entries) ? manifest : { entries: [] };
  } catch (error) {
    if (error.code === "ENOENT") {
      return { entries: [] };
    }

    throw error;
  }
}

async function writeManifest(manifest) {
  await fs.mkdir(cacheRoot, { recursive: true });
  await fs.writeFile(
    manifestPath,
    `${JSON.stringify({ ...manifest, updatedAt: new Date().toISOString() }, null, 2)}\n`,
  );
}

async function fetchText(urlValue) {
  const response = await fetch(urlValue, {
    headers: {
      "user-agent": "react-dash-lib-rag/0.1 (+local developer documentation cache)",
      accept: "text/html,text/plain,application/xhtml+xml",
    },
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(`GET ${urlValue} failed with HTTP ${response.status}`);
  }

  const contentType = response.headers.get("content-type") || "";
  const body = await response.text();

  return { body, contentType };
}

function decodeEntities(value) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'");
}

function extractTitle(body, urlValue) {
  const titleMatch = body.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const headingMatch = body.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const rawTitle = headingMatch?.[1] || titleMatch?.[1] || urlValue;

  return htmlToText(rawTitle).slice(0, 160);
}

function htmlToText(body) {
  return decodeEntities(
    body
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
      .replace(/<\/(p|div|section|article|main|li|h[1-6]|tr|pre|code)>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+\n/g, "\n")
      .replace(/\n\s+/g, "\n")
      .replace(/[ \t]+/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim(),
  );
}

function bodyToText(body, contentType) {
  if (contentType.includes("text/plain")) {
    return body.replace(/\s+/g, " ").trim();
  }

  return htmlToText(body);
}

function chunkText(text) {
  const paragraphs = text.split(/\n{2,}/).map((part) => part.trim()).filter(Boolean);
  const chunks = [];
  let current = "";

  for (const paragraph of paragraphs) {
    if ((current.length + paragraph.length + 2 > 1200) && current) {
      chunks.push(current);
      current = "";
    }

    current = current ? `${current}\n\n${paragraph}` : paragraph;
  }

  if (current) {
    chunks.push(current);
  }

  return chunks.flatMap((chunk) => {
    if (chunk.length <= 1400) {
      return [chunk];
    }

    const parts = [];
    for (let start = 0; start < chunk.length; start += 1000) {
      parts.push(chunk.slice(start, start + 1200).trim());
    }
    return parts.filter(Boolean);
  });
}

async function cacheDocument(library, urlValue, options = {}) {
  if (!originAllowedForLibrary(library, urlValue)) {
    throw new Error(
      `Refusing ${urlValue}. Add its origin to ${library.name}.officialDocs first if it is trusted.`,
    );
  }

  const manifest = await readManifest();
  const entryId = `${slugify(library.name)}-${hash(urlValue)}`;
  const existing = manifest.entries.find((entry) => entry.id === entryId);

  if (existing && !options.refresh) {
    return { entry: existing, skipped: true };
  }

  const { body, contentType } = await fetchText(urlValue);
  const title = extractTitle(body, urlValue);
  const text = bodyToText(body, contentType);

  if (text.length < 80) {
    throw new Error(`Fetched ${urlValue}, but extracted text was too short to index.`);
  }

  const fileName = `${entryId}.json`;
  const filePath = path.join(cacheRoot, "documents", fileName);
  const document = {
    id: entryId,
    library: library.name,
    package: library.package,
    declaredRange: library.declaredRange || library.currentRange || null,
    installedVersion: library.installedVersion || null,
    versionSource: library.versionSource || null,
    url: urlValue,
    title,
    fetchedAt: new Date().toISOString(),
    text,
  };

  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(document, null, 2)}\n`);

  const nextEntry = {
    id: entryId,
    library: library.name,
    package: library.package,
    declaredRange: document.declaredRange,
    installedVersion: document.installedVersion,
    versionSource: document.versionSource,
    url: urlValue,
    title,
    path: filePath,
    fetchedAt: document.fetchedAt,
  };
  const nextEntries = manifest.entries.filter((entry) => entry.id !== entryId);
  nextEntries.push(nextEntry);
  await writeManifest({ entries: nextEntries.sort((a, b) => a.id.localeCompare(b.id)) });

  return { entry: nextEntry, skipped: false };
}

async function listSources(filter) {
  const libraries = await readSources();
  const normalizedFilter = filter ? normalize(filter) : "";
  const selected = normalizedFilter
    ? libraries.filter((library) => {
        return [
          library.name,
          library.package,
          ...(library.useFor || []),
        ].some((value) => normalize(String(value)).includes(normalizedFilter));
      })
    : libraries;

  for (const library of selected) {
    console.log(`${library.name} (${library.package || "no package"})`);
    console.log(`  installed: ${library.installedVersion || library.currentRange || "n/a"}`);
    if (library.declaredRange && library.declaredRange !== library.installedVersion) {
      console.log(`  declared: ${library.declaredRange}`);
    }
    console.log(`  docs: ${library.officialDocs.join(", ")}`);
    console.log(`  use for: ${(library.useFor || []).join(", ")}`);
  }
}

async function fetchSources(args) {
  const libraries = await readSources();
  const library = findLibrary(libraries, args.library);

  if (args.library && !library) {
    throw new Error(`Unknown library: ${args.library}`);
  }

  if (args.urls?.length && !library) {
    throw new Error("--url requires --library so the URL can be checked against trusted origins.");
  }

  const targets = [];

  if (args.urls?.length) {
    for (const urlValue of args.urls) {
      targets.push({ library, url: urlValue });
    }
  } else {
    const selectedLibraries = library ? [library] : libraries;
    for (const selectedLibrary of selectedLibraries) {
      for (const url of selectedLibrary.officialDocs) {
        targets.push({ library: selectedLibrary, url });
      }
    }
  }

  if (!targets.length) {
    throw new Error("No fetch targets found.");
  }

  for (const target of targets) {
    const result = await cacheDocument(target.library, target.url, {
      refresh: args.refresh,
    });
    if (!args.silent) {
      const action = result.skipped ? "cached" : "fetched";
      console.log(`${action}: ${target.library.name} - ${result.entry.title}`);
      console.log(`  ${result.entry.url}`);
    }
  }

  if (!args.silent) {
    console.log(`cache: ${cacheRoot}`);
  }
}

async function loadCachedDocuments(args, libraries) {
  const manifest = await readManifest();
  const library = findLibrary(libraries, args.library);

  if (args.library && !library) {
    throw new Error(`Unknown library: ${args.library}`);
  }

  if (!manifest.entries.length || args.refresh) {
    await fetchSources({
      library: library?.name,
      refresh: args.refresh,
      silent: true,
    });
  } else if (library) {
    const hasLibraryCache = manifest.entries.some((entry) => entry.library === library.name);
    if (!hasLibraryCache) {
      await fetchSources({ library: library.name, silent: true });
    }
  }

  const updatedManifest = await readManifest();
  const entries = updatedManifest.entries.filter((entry) => {
    return library ? entry.library === library.name : true;
  });

  const documents = [];
  for (const entry of entries) {
    const raw = await fs.readFile(entry.path, "utf8");
    const document = JSON.parse(raw);
    const sourceLibrary = libraries.find((candidate) => candidate.name === entry.library);
    documents.push({
      ...document,
      package: document.package || sourceLibrary?.package || entry.package,
      declaredRange:
        document.declaredRange ||
        sourceLibrary?.declaredRange ||
        sourceLibrary?.currentRange ||
        entry.declaredRange,
      installedVersion:
        document.installedVersion ||
        sourceLibrary?.installedVersion ||
        entry.installedVersion,
      versionSource:
        document.versionSource ||
        sourceLibrary?.versionSource ||
        entry.versionSource,
    });
  }

  return documents;
}

function scoreChunk(queryTokens, document, chunk, index) {
  const chunkTokens = tokenize(chunk);
  const tokenCounts = new Map();
  for (const token of chunkTokens) {
    tokenCounts.set(token, (tokenCounts.get(token) || 0) + 1);
  }

  let score = 0;
  for (const token of queryTokens) {
    const count = tokenCounts.get(token) || 0;
    if (count > 0) {
      score += 2 + Math.log2(count + 1);
    }

    if (normalize(document.title).includes(token)) {
      score += 2;
    }

    if (normalize(document.url).includes(token)) {
      score += 1.5;
    }
  }

  if (index === 0) {
    score += 0.5;
  }

  return score;
}

function highlightSnippet(chunk, queryTokens) {
  const normalizedChunk = normalize(chunk);
  const firstHit = queryTokens
    .map((token) => normalizedChunk.indexOf(token))
    .filter((index) => index >= 0)
    .sort((a, b) => a - b)[0];

  const start = Math.max(0, (firstHit || 0) - 180);
  const snippet = chunk.slice(start, start + 520).replace(/\s+/g, " ").trim();

  return `${start > 0 ? "... " : ""}${snippet}${start + 520 < chunk.length ? " ..." : ""}`;
}

async function query(args) {
  const queryText = args.positional.join(" ").trim();
  if (!queryText) {
    printUsage();
    throw new Error("Missing query text.");
  }

  const limit = Number.isFinite(args.limit) ? args.limit : 6;
  const libraries = await readSources();
  const documents = await loadCachedDocuments(args, libraries);
  const queryTokens = tokenize(queryText);

  if (!queryTokens.length) {
    throw new Error("Query has no searchable terms.");
  }

  const results = [];
  for (const document of documents) {
    const chunks = chunkText(document.text);
    chunks.forEach((chunk, index) => {
      const score = scoreChunk(queryTokens, document, chunk, index);
      if (score > 0) {
        results.push({
          score,
          library: document.library,
          package: document.package,
          installedVersion: document.installedVersion,
          title: document.title,
          url: document.url,
          fetchedAt: document.fetchedAt,
          snippet: highlightSnippet(chunk, queryTokens),
        });
      }
    });
  }

  const topResults = results.sort((a, b) => b.score - a.score).slice(0, limit);

  if (args.json) {
    console.log(JSON.stringify({ query: queryText, cacheRoot, results: topResults }, null, 2));
    return;
  }

  if (!topResults.length) {
    console.log("No local RAG matches found.");
    console.log(`cache: ${cacheRoot}`);
    return;
  }

  for (const [index, result] of topResults.entries()) {
    console.log(`${index + 1}. [${result.library}] ${result.title}`);
    if (result.package && result.installedVersion) {
      console.log(`   package: ${result.package}@${result.installedVersion}`);
    }
    console.log(`   ${result.url}`);
    console.log(`   score: ${result.score.toFixed(2)} fetched: ${result.fetchedAt}`);
    console.log(`   ${result.snippet}`);
  }

  console.log(`cache: ${cacheRoot}`);
}

async function main() {
  const [command, ...rest] = process.argv.slice(2);
  const args = parseArgs(rest);

  if (!command || command === "help" || command === "--help") {
    printUsage();
    return;
  }

  if (command === "sources") {
    await listSources(args.positional.join(" "));
  } else if (command === "fetch") {
    await fetchSources(args);
  } else if (command === "query") {
    await query(args);
  } else {
    printUsage();
    throw new Error(`Unknown command: ${command}`);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
