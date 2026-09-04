// Configuración y constantes del Microservicio Backend
// Responsable: Alexsander Rosales (Backend Developer)

module.exports = {
  PORT: process.env.PORT || 3000,
  API_PREFIX: '/api',
  SERVICE_NAME: 'devops-microservice-backend',
  VERSION: '1.0.0',
  AUTHOR: 'Alexsander Rosales',
  ENVIRONMENT: process.env.NODE_ENV || 'development',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  CORS_METHODS: 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  CORS_HEADERS: 'Content-Type, Authorization, X-Requested-With'
};
