// Controlador de Catálogo y Healthcheck
// Responsable: Alexsander Rosales (Backend Developer)

const catalog = require('../data/catalog');
const config = require('../config/constants');
const { sendJson, sendError, parseJsonBody } = require('../utils/response');

const startTime = Date.now();

// Base de datos de items generales para compatibilidad
let itemsDb = [
  { id: 1, title: 'Servicio de Autenticación JWT', category: 'Servicio', status: 'Activo', time: '10:00:15' },
  { id: 2, title: 'Endpoint Métricas Cloud', category: 'Pipeline', status: 'Activo', time: '10:14:22' },
  { id: 3, title: 'Catálogo VI CITY Pre-orders', category: 'Módulo', status: 'Activo', time: '11:30:00' }
];

function getHealth(req, res) {
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
  const memory = process.memoryUsage();

  sendJson(res, 200, {
    status: 'ok',
    service: config.SERVICE_NAME,
    version: config.VERSION,
    environment: config.ENVIRONMENT,
    author: config.AUTHOR,
    uptimeSeconds,
    memoryUsageMB: {
      rss: Math.round(memory.rss / 1024 / 1024),
      heapTotal: Math.round(memory.heapTotal / 1024 / 1024),
      heapUsed: Math.round(memory.heapUsed / 1024 / 1024)
    },
    timestamp: new Date().toISOString()
  });
}

function getCatalog(req, res) {
  sendJson(res, 200, {
    releaseDate: catalog.RELEASE_DATE,
    preloadDate: catalog.PRELOAD_DATE,
    chargeDate: catalog.CHARGE_DATE,
    platforms: catalog.PLATFORMS,
    editions: catalog.EDITIONS,
    extras: catalog.EXTRAS
  });
}

function getPlatforms(req, res) {
  sendJson(res, 200, catalog.PLATFORMS);
}

function getEditions(req, res) {
  sendJson(res, 200, catalog.EDITIONS);
}

function getItems(req, res) {
  sendJson(res, 200, itemsDb);
}

async function createItem(req, res) {
  try {
    const body = await parseJsonBody(req);
    if (!body.title) {
      sendError(res, 400, 'El campo title es obligatorio');
      return;
    }

    const newItem = {
      id: itemsDb.length + 1,
      title: body.title,
      category: body.category || 'General',
      status: 'Activo',
      time: new Date().toLocaleTimeString()
    };

    itemsDb.unshift(newItem);
    sendJson(res, 201, newItem);
  } catch (err) {
    sendError(res, 400, err.message);
  }
}

module.exports = {
  getHealth,
  getCatalog,
  getPlatforms,
  getEditions,
  getItems,
  createItem
};
