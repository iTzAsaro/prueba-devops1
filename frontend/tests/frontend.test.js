const { test, describe } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

describe('Pruebas Unitarias del Módulo Frontend (Kevin Gallardo)', () => {
  const rootDir = path.resolve(__dirname, '..');

  test('Debe existir package.json con scripts de test y start', () => {
    const pkgPath = path.join(rootDir, 'package.json');
    assert.strictEqual(fs.existsSync(pkgPath), true, 'package.json debe existir');

    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    assert.strictEqual(typeof pkg.scripts.start, 'string', 'Debe tener script start');
    assert.strictEqual(typeof pkg.scripts.test, 'string', 'Debe tener script test');
  });

  test('Debe existir index.html con estructura semántica válida', () => {
    const htmlPath = path.join(rootDir, 'public', 'index.html');
    assert.strictEqual(fs.existsSync(htmlPath), true, 'public/index.html debe existir');

    const content = fs.readFileSync(htmlPath, 'utf8');
    assert.match(content, /<!DOCTYPE html>/i, 'Debe contener DOCTYPE');
    assert.match(content, /Kevin Gallardo/i, 'Debe identificar a Kevin Gallardo');
    assert.match(content, /id="item-form"/, 'Debe contener el formulario de items');
    assert.match(content, /id="items-table-body"/, 'Debe contener la tabla de datos');
  });

  test('Deben existir los archivos de estilos y lógica cliente', () => {
    const cssPath = path.join(rootDir, 'src', 'style.css');
    const jsPath = path.join(rootDir, 'src', 'app.js');

    assert.strictEqual(fs.existsSync(cssPath), true, 'src/style.css debe existir');
    assert.strictEqual(fs.existsSync(jsPath), true, 'src/app.js debe existir');

    const jsContent = fs.readFileSync(jsPath, 'utf8');
    assert.match(jsContent, /BACKEND_API_URL/, 'Debe configurar endpoint del backend');
  });
});
