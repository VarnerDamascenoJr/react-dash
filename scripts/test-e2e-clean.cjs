const { execFileSync, spawnSync } = require('node:child_process');
const { cpSync, existsSync, mkdirSync, mkdtempSync, rmSync } = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const temporaryRoot = mkdtempSync(path.join(os.tmpdir(), 'react-dash-e2e-'));
const checkout = path.join(temporaryRoot, 'project');
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

try {
  mkdirSync(checkout);
  const files = execFileSync('git', ['ls-files', '-co', '--exclude-standard', '-z'], {
    cwd: root,
    encoding: 'utf8',
  }).split('\0').filter(Boolean);

  for (const file of files) {
    const source = path.join(root, file);
    if (!existsSync(source)) continue;
    const destination = path.join(checkout, file);
    mkdirSync(path.dirname(destination), { recursive: true });
    cpSync(source, destination);
  }

  const env = {
    ...process.env,
    PLAYWRIGHT_BROWSERS_PATH: path.join(temporaryRoot, 'browsers'),
    CI: '1',
  };
  // The clean run must start its own server and remain independent of a live API.
  delete env.REACT_DASH_BASE_URL;
  delete env.SALES_SUPPORT_API_KEY;
  delete env.SALES_EVENT_ID;

  for (const args of [['ci'], ['run', 'test:e2e:install'], ['run', 'test:e2e']]) {
    const result = spawnSync(npm, args, { cwd: checkout, env, stdio: 'inherit' });
    if (result.error) throw result.error;
    if (result.status !== 0) {
      process.exitCode = result.status || 1;
      break;
    }
  }
} finally {
  rmSync(temporaryRoot, { recursive: true, force: true });
}
