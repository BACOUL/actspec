import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

assert.equal(process.platform, 'win32', 'This proof must run on native Windows');

const variants = {
  initial: `import path from 'node:path';\nimport fs from 'node:fs';\nexport function reportPath(root,id){return \`${'${root}'}/reports/${'${id}'}.json\`;}\nexport function writeManifest(file,lines){fs.writeFileSync(file,lines.join('\\n')+'\\n','utf8');}\n`,
  correct: `import path from 'node:path';\nimport fs from 'node:fs';\nexport function reportPath(root,id){return path.join(root,'reports',\`${'${id}'}.json\`);}\nexport function writeManifest(file,lines){fs.writeFileSync(file,lines.join('\\n')+'\\n','utf8');}\n`,
  incorrect: `import path from 'node:path';\nimport fs from 'node:fs';\nexport function reportPath(root,id){return path.join(root,'reports',\`${'${id}'}.json\`);}\nexport function writeManifest(file,lines){fs.writeFileSync(file,lines.join('\\r\\n')+'\\r\\n','utf8');}\n`
};

const rows = [];
for (const [name, source] of Object.entries(variants)) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), `hs30-d5-${name}-`));
  try {
    const modPath = path.join(dir, 'files.mjs');
    fs.writeFileSync(modPath, source, 'utf8');
    const m = await import(pathToFileURL(modPath).href + `?v=${Date.now()}-${name}`);
    const manifest = path.join(dir, 'manifest.txt');
    m.writeManifest(manifest, ['a', 'b']);
    const actualPath = m.reportPath('C:\\work', 'x');
    const expectedPath = path.join('C:\\work', 'reports', 'x.json');
    const text = fs.readFileSync(manifest, 'utf8');
    const pathOk = actualPath === expectedPath;
    const newlineStable = text === 'a\nb\n';
    rows.push({ name, actualPath, expectedPath, pathOk, newlineStable, taskPass: pathOk && newlineStable });
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

assert.equal(rows.find(r => r.name === 'initial').taskPass, false);
assert.equal(rows.find(r => r.name === 'correct').taskPass, true);
assert.equal(rows.find(r => r.name === 'incorrect').taskPass, false);

console.log(JSON.stringify({
  gate: 'HS30_D5_NATIVE_WINDOWS_PUBLIC_PROBE',
  officialBenchmarkRun: false,
  exposesHiddenGold: false,
  platform: process.platform,
  arch: process.arch,
  node: process.version,
  rows,
  status: 'PASS'
}, null, 2));
