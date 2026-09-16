const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

function jsFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const p = path.join(dir, entry.name);
    return entry.isDirectory() ? jsFiles(p) : (entry.isFile() && entry.name.endsWith('.js') ? [p] : []);
  });
}

test('Hobby deployment exposes no more than 12 API functions', () => {
  const files = jsFiles(path.join(__dirname, '..', 'api'));
  assert.ok(files.length <= 12, `Found ${files.length} JavaScript files under api/: ${files.map(f => path.relative(path.join(__dirname, '..'), f)).join(', ')}`);
});
