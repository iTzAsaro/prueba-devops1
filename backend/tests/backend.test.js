const { test, describe, before, after } = require('node:test');
const assert = require('node:assert');
const server = require('../src/server');

const TEST_PORT = 3999;
const BASE_URL = `http://localhost:${TEST_PORT}/api`;

describe('Suite de Pruebas Backend VI CITY - Microservicio (Alexsander Rosales)', () => {
  before((done) => {
    server.listen(TEST_PORT, done);
  });

  after((done) => {
    server.close(done);
  });

  test('GET /api/health debe responder 200 con metadata de DevOps', async () => {
    const res = await fetch(`${BASE_URL}/health`);
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.status, 'ok');
    assert.strictEqual(body.author, 'Alexsander Rosales');
    assert.strictEqual(typeof body.uptimeSeconds, 'number');
    assert.strictEqual(typeof body.memoryUsageMB, 'object');
  });

  test('GET /api/catalog debe retornar catálogo completo con plataformas y ediciones', async () => {
    const res = await fetch(`${BASE_URL}/catalog`);
    assert.strictEqual(res.status, 200);

    const data = await res.json();
    assert.ok(Array.isArray(data.platforms));
    assert.ok(Array.isArray(data.editions));
    assert.ok(data.platforms.some(p => p.id === 'ps5'));
    assert.ok(data.editions.some(e => e.id === 'deluxe'));
  });

  test('GET /api/platforms debe listar las 3 plataformas principales', async () => {
    const res = await fetch(`${BASE_URL}/platforms`);
    assert.strictEqual(res.status, 200);

    const platforms = await res.json();
    assert.strictEqual(platforms.length, 3);
  });

  test('GET /api/orders debe responder con lista de preventas', async () => {
    const res = await fetch(`${BASE_URL}/orders`);
    assert.strictEqual(res.status, 200);

    const data = await res.json();
    assert.ok(typeof data.total === 'number');
    assert.ok(Array.isArray(data.orders));
    assert.ok(data.orders.length >= 2);
  });

  test('POST /api/orders debe validar payload y registrar nueva orden con cálculo de precio', async () => {
    const newOrderPayload = {
      customer: {
        fullName: 'Alexsander Rosales Test',
        email: 'alexsander.test@duocuc.cl',
        phone: '+56987654321'
      },
      selection: {
        platformId: 'pc',
        editionId: 'standard',
        format: 'digital',
        extras: ['vip-pass']
      },
      payment: {
        method: 'card',
        cardNumber: '4532111122223333'
      }
    };

    const res = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrderPayload)
    });

    assert.strictEqual(res.status, 201);
    const body = await res.json();
    assert.strictEqual(body.order.customer.email, 'alexsander.test@duocuc.cl');
    assert.strictEqual(body.order.selection.platformId, 'pc');
    assert.strictEqual(body.order.status, 'confirmada');
    // Precio Standard Digital (69990) + VIP Pass (29990) = 99980
    assert.strictEqual(body.order.pricing.total, 99980);
  });

  test('POST /api/orders debe rechazar petición con campos faltantes (400 Bad Request)', async () => {
    const invalidPayload = {
      customer: { email: 'invalido@test.cl' }
    };

    const res = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidPayload)
    });

    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.strictEqual(body.error, true);
  });

  test('PATCH /api/orders/:id/cancel debe cambiar estado de la orden a cancelada', async () => {
    const res = await fetch(`${BASE_URL}/orders/ord-001/cancel`, {
      method: 'PATCH'
    });

    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.order.status, 'cancelada');
    assert.ok(body.order.cancelledAt);
  });

  test('GET /api/metrics debe proveer métricas acumuladas de DevOps', async () => {
    const res = await fetch(`${BASE_URL}/metrics`);
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.ok(body.metrics);
    assert.strictEqual(typeof body.metrics.totalOrders, 'number');
    assert.strictEqual(typeof body.metrics.totalRevenueCLP, 'number');
  });

  test('OPTIONS /api/health debe responder 204 con cabeceras CORS', async () => {
    const res = await fetch(`${BASE_URL}/health`, { method: 'OPTIONS' });
    assert.strictEqual(res.status, 204);
    assert.strictEqual(res.headers.get('access-control-allow-origin'), '*');
  });

  test('Ruta inexistente debe retornar 404 estructurado', async () => {
    const res = await fetch(`${BASE_URL}/ruta-desconocida`);
    assert.strictEqual(res.status, 404);
    const body = await res.json();
    assert.strictEqual(body.error, true);
  });
});
