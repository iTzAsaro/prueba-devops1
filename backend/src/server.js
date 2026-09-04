const http = require('node:http');

const PORT = process.env.PORT || 3000;

// Base de datos en memoria para el microservicio
let items = [
  { id: 1, title: 'Servicio de Autenticación JWT', category: 'Servicio', status: 'Activo', time: '10:00:15' },
  { id: 2, title: 'Endpoint Métricas Cloud', category: 'Pipeline', status: 'Activo', time: '10:14:22' }
];

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

const server = http.createServer((req, res) => {
  setCorsHeaders(res);

  // Manejo de pre-flight request para CORS
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);

  // Endpoint de salud (Healthcheck)
  if (url.pathname === '/api/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      service: 'devops-microservice-backend',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      author: 'Alexsander Rosales'
    }));
    return;
  }

  // Endpoint para listar recursos
  if (url.pathname === '/api/items' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(items));
    return;
  }

  // Endpoint para registrar nuevo recurso
  if (url.pathname === '/api/items' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const newItem = {
          id: items.length + 1,
          title: data.title || 'Recurso sin título',
          category: data.category || 'General',
          status: 'Activo',
          time: new Date().toLocaleTimeString()
        };
        items.unshift(newItem);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newItem));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Payload JSON inválido' }));
      }
    });
    return;
  }

  // 404 No encontrado
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Endpoint no encontrado en el microservicio' }));
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`[Backend] Microservicio API iniciado en http://localhost:${PORT}`);
    console.log(`[Backend] Desarrollado por Alexsander Rosales`);
  });
}

module.exports = server;
