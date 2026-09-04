// Servidor Principal del Microservicio Backend - Plataforma VI CITY
// Responsable: Alexsander Rosales (Backend Developer)
// Proyecto: DOY0101 Ingeniería DevOps

const http = require('node:http');
const config = require('./config/constants');
const { handleCors } = require('./middleware/cors');
const { logRequest } = require('./middleware/logger');
const Router = require('./router');

// Controladores
const catalogController = require('./controllers/catalogController');
const ordersController = require('./controllers/ordersController');

const router = new Router();

// Rutas del Catálogo y Estado
router.get('/api/health', catalogController.getHealth);
router.get('/api/catalog', catalogController.getCatalog);
router.get('/api/platforms', catalogController.getPlatforms);
router.get('/api/editions', catalogController.getEditions);
router.get('/api/items', catalogController.getItems);
router.post('/api/items', catalogController.createItem);

// Rutas de Gestión de Preventas / Órdenes
router.get('/api/orders', ordersController.getOrders);
router.get('/api/orders/:id', ordersController.getOrderById);
router.post('/api/orders', ordersController.createOrder);
router.patch('/api/orders/:id/cancel', ordersController.cancelOrder);
router.delete('/api/orders/:id', ordersController.deleteOrder);
router.get('/api/metrics', ordersController.getMetrics);

const server = http.createServer(async (req, res) => {
  logRequest(req, res);

  // Manejar CORS (retorna true si fue OPTIONS)
  if (handleCors(req, res)) return;

  await router.handle(req, res);
});

if (require.main === module) {
  server.listen(config.PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 [Backend] Microservicio API iniciado en el puerto ${config.PORT}`);
    console.log(`📦 [Backend] Entorno: ${config.ENVIRONMENT} | Versión: ${config.VERSION}`);
    console.log(`👤 [Backend] Desarrollador: ${config.AUTHOR}`);
    console.log(`🔗 [Backend] Endpoints base: http://localhost:${config.PORT}/api`);
    console.log(`====================================================`);
  });
}

module.exports = server;
