# Módulo Backend - Alexsander Rosales

Este módulo contiene la API REST y lógica de negocio del microservicio para la Evaluación Parcial N°1 de Ingeniería DevOps.

---

## 🛠️ Tecnologías y Estructura
* **Tecnología:** Node.js HTTP nativo (o Express / Fastify según evolución del microservicio).
* **Endpoints Base:**
  * `GET /api/health`: Estado de operatividad del microservicio (Healthcheck).
  * `GET /api/items`: Obtención de recursos registrados.
  * `POST /api/items`: Registro de nuevo recurso en el microservicio.
* **Seguridad / Conectividad:** Cabeceras CORS habilitadas para permitir consumo seguro desde el frontend de Kevin Gallardo.
* **Entorno de Pruebas:** Node.js Test Runner nativo (`node --test`).

```text
backend/
├── src/
│   └── server.js            # Servidor HTTP con endpoints REST
├── tests/
│   └── backend.test.js      # Pruebas unitarias de servidor
├── package.json             # Scripts de npm (start, test)
└── README.md                # Este archivo de instrucciones
```

---

## 🚀 Instrucciones de Ejecución Local

1. **Ejecutar Pruebas Automatizadas:**
   ```bash
   npm test
   ```
2. **Iniciar Servidor Local:**
   ```bash
   npm start
   ```
   El microservicio escuchará peticiones en: [http://localhost:3000/api](http://localhost:3000/api)

---

## 📝 Guía para Alexsander Rosales: Simulación de Cambios Git (Pauta)

### Tarea Feature 1: Nueva Funcionalidad en Backend
Para cumplir con el requisito de simular al menos 2 cambios tipo feature en el equipo:
1. Asegurarse de estar en `develop` actualizado:
   ```bash
   git checkout develop
   git pull origin develop
   ```
2. Crear la rama de feature:
   ```bash
   git checkout -b feature/backend-api-endpoints
   ```
3. Realizar los cambios o incorporar endpoints de su microservicio (en `src/server.js`).
4. Realizar commit semántico:
   ```bash
   git add backend/
   git commit -m "feat(backend): add authentication and metrics endpoint"
   ```
5. Subir la rama a GitHub:
   ```bash
   git push -u origin feature/backend-api-endpoints
   ```
6. Abrir **Pull Request** hacia `develop` en GitHub, solicitar revisión a Paulo Rivas, y verificar que el pipeline CI ejecute con éxito.
