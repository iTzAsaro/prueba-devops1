// Utilidades de respuesta HTTP y parseo para el Microservicio
// Desarrollado por Alexsander Rosales

function sendJson(res, statusCode, data) {
  const payload = JSON.stringify(data);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(payload)
  });
  res.end(payload);
}

function sendError(res, statusCode, message, details = null) {
  const response = {
    error: true,
    status: statusCode,
    message,
    timestamp: new Date().toISOString()
  };
  if (details) response.details = details;
  sendJson(res, statusCode, response);
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      // Protección contra payloads excesivos (1MB max)
      if (body.length > 1e6) {
        req.destroy();
        reject(new Error('Payload demasiado grande'));
      }
    });
    req.on('end', () => {
      if (!body.trim()) {
        resolve({});
        return;
      }
      try {
        const parsed = JSON.parse(body);
        resolve(parsed);
      } catch (err) {
        reject(new Error('Formato JSON inválido en el cuerpo de la petición'));
      }
    });
    req.on('error', err => reject(err));
  });
}

module.exports = {
  sendJson,
  sendError,
  parseJsonBody
};
