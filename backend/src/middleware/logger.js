// Middleware de observabilidad y logging para entornos DevOps
// Registra accesos HTTP con marcas de tiempo y códigos de respuesta
// Desarrollado por Alexsander Rosales

function logRequest(req, res) {
  const start = Date.now();
  const { method, url } = req;

  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [HTTP] ${method} ${url} -> ${status} (${duration}ms)`);
  });
}

module.exports = {
  logRequest
};
