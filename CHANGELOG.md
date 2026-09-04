# Registro de Cambios (Changelog)

Todos los cambios notables de este proyecto serán documentados cronológicamente en este archivo.
El formato se basa en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y se adhiere a [Semantic Versioning](https://semver.org/lang/es/).

---

## [1.0.2] - 2026-09-03 (Rama `main`)
### Añadido
- Integración continua automatizada con GitHub Actions (`.github/workflows/ci.yml`).
- Módulo de interfaz gráfica base para Frontend (Kevin Gallardo).
- Microservicio base con API REST para Backend (Alexsander Rosales).
- Dockerización del entorno con `Dockerfile` para backend y frontend, y orquestación con `docker-compose.yml` (Paulo Rivas).
- Actualización de reflexión DevOps en `README.md` sobre GitFlow y automatización CI (Paulo Rivas).
- Ramas de características (`feature/backend-api-endpoints`, `feature/frontend-dashboard`) y solución urgente (`hotfix/fix-client-cors-error`) preparadas.

---

## [1.0.1] - 2026-09-03 (Rama `hotfix/fix-checkout-validation-crash`)
### Corregido
- Corrección crítica de excepción TypeError en validaciones de tarjeta y correo al recibir valores nulos o no-string en el checkout de producción.
- Incorporación de validaciones defensivas y sanitización segura en utilidades de interfaz (`ui.js`).
- Nueva prueba unitaria automatizada para prevenir regresiones en validación de datos.

---

## [1.0.0] - 2026-09-03 (Rama `main`)
### Añadido
- Inicialización del repositorio y configuración de la arquitectura DevOps (Paulo Rivas).
- Implementación del modelo de ramificación GitFlow (`main`, `develop`, `feature/*`, `hotfix/*`).
- Creación de documentación normativa: `README.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `LICENSE.md`.
- Definición de pipeline de CI/CD activado por eventos en `develop` y `main`.
