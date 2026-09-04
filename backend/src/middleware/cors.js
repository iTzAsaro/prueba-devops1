// Middleware para control de CORS (Cross-Origin Resource Sharing)
// Permite la comunicación segura entre el Frontend (puerto 5000) y Backend (puerto 3000)
// Desarrollado por Alexsander Rosales

const config = require('../config/constants');

function handleCors(req, res) {
  res.setHeader('Access-Control-Allow-Origin', config.CORS_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', config.CORS_METHODS);
  res.setHeader('Access-Control-Allow-Headers', config.CORS_HEADERS);
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 horas de cache para pre-flight

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return true; // Petición OPTIONS interceptada
  }
  return false;
}

module.exports = {
  handleCors
};
