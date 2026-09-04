// Enrutador HTTP modular con soporte de parámetros de ruta
// Desarrollado por Alexsander Rosales

const { sendError } = require('./utils/response');

class Router {
  constructor() {
    this.routes = [];
  }

  add(method, pattern, handler) {
    // Convierte rutas como /api/orders/:id a expresiones regulares
    const paramNames = [];
    const regexPath = pattern.replace(/:([a-zA-Z0-9_]+)/g, (_, key) => {
      paramNames.push(key);
      return '([^/]+)';
    });
    const regex = new RegExp(`^${regexPath}$`);

    this.routes.push({
      method: method.toUpperCase(),
      pattern,
      regex,
      paramNames,
      handler
    });
  }

  get(pattern, handler) { this.add('GET', pattern, handler); }
  post(pattern, handler) { this.add('POST', pattern, handler); }
  put(pattern, handler) { this.add('PUT', pattern, handler); }
  patch(pattern, handler) { this.add('PATCH', pattern, handler); }
  delete(pattern, handler) { this.add('DELETE', pattern, handler); }

  async handle(req, res) {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = url.pathname;
    const method = req.method.toUpperCase();

    for (const route of this.routes) {
      if (route.method !== method) continue;

      const match = pathname.match(route.regex);
      if (match) {
        const params = {};
        route.paramNames.forEach((name, index) => {
          params[name] = decodeURIComponent(match[index + 1]);
        });
        req.params = params;
        req.query = Object.fromEntries(url.searchParams.entries());

        try {
          await route.handler(req, res);
          return true;
        } catch (err) {
          sendError(res, 500, 'Error interno del servidor', err.message);
          return true;
        }
      }
    }

    sendError(res, 404, `Ruta no encontrada: ${method} ${pathname}`);
    return false;
  }
}

module.exports = Router;
