const { test, describe } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

describe('Pruebas Unitarias del Microservicio Backend (Alexsander Rosales)', () => {
  const rootDir = path.resolve(__dirname, '..');

  test('Debe existir package.json con scripts start y test', () => {
    const pkgPath = path.join(rootDir, 'package.json');
    assert.strictEqual(fs.existsSync(pkgPath), true, 'package.json debe existir');

    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    assert.strictEqual(typeof pkg.scripts.start, 'string');
    assert.strictEqual(typeof pkg.scripts.test, 'string');
  });

  test('Debe existir server.js con endpoints definidos y soporte CORS', () => {
    const serverPath = path.join(rootDir, 'src', 'server.js');
    assert.strictEqual(fs.existsSync(serverPath), true, 'src/server.js debe existir');

    const content = fs.readFileSync(serverPath, 'utf8');
    assert.match(content, /\/api\/health/, 'Debe definir endpoint /api/health');
    assert.match(content, /\/api\/items/, 'Debe definir endpoint /api/items');
    assert.match(content, /Access-Control-Allow-Origin/, 'Debe configurar cabeceras CORS');
  });
});
