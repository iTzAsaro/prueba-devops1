# Registro de Cambios (Changelog)

Todos los cambios notables de este proyecto serán documentados cronológicamente en este archivo.
El formato se basa en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y se adhiere a [Semantic Versioning](https://semver.org/lang/es/).

---

## [Sin Publicar] - En Desarrollo (Rama `develop`)
### Añadido
- Integración continua automatizada con GitHub Actions (`.github/workflows/ci.yml`).
- Módulo de interfaz gráfica base para Frontend (Kevin Gallardo).
- Microservicio base con API REST para Backend (Alexsander Rosales).

---

## [1.0.1] - Planificado (Rama `hotfix/*`)
### Corregido
- Corrección de emergencia simulada en producción según el encargo académico (Hotfix #1).

---

## [1.0.0] - 2026-09-03 (Rama `main`)
### Añadido
- Inicialización del repositorio y configuración de la arquitectura DevOps (Paulo Rivas).
- Implementación del modelo de ramificación GitFlow (`main`, `develop`, `feature/*`, `hotfix/*`).
- Creación de documentación normativa: `README.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `LICENSE.md`.
- Definición de pipeline de CI/CD activado por eventos en `develop` y `main`.
