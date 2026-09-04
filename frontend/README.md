# Módulo Frontend - Kevin Gallardo

Este módulo contiene la interfaz de usuario del microservicio para la Evaluación Parcial N°1 de Ingeniería DevOps.

---

## 🛠️ Tecnologías y Estructura
* **Tecnología:** HTML5 semántico, CSS3 moderno con variables y Vanilla JavaScript asíncrono (`fetch` API).
* **Servidor Local:** Node.js nativo (sin dependencias de terceros requeridas).
* **Entorno de Pruebas:** Node.js Test Runner nativo (`node --test`).

```text
frontend/
├── public/
│   └── index.html           # Vista principal del microservicio
├── src/
│   ├── app.js               # Lógica del cliente, consumo de API y consola
│   └── style.css            # Estilos y diseño responsivo
├── tests/
│   └── frontend.test.js     # Suite de pruebas unitarias
├── package.json             # Scripts de npm (start, test, build)
├── server.js                # Servidor estático nativo en Node.js
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
   Abrir en el navegador: [http://localhost:5000](http://localhost:5000)

---

## 📝 Guía para Kevin Gallardo: Simulación de Cambios Git (Pauta)

### 1. Tarea Feature 2: Nueva Funcionalidad en Frontend
Para cumplir con el requisito de simular al menos 2 cambios tipo feature en el equipo:
1. Asegurarse de estar en `develop` actualizado:
   ```bash
   git checkout develop
   git pull origin develop
   ```
2. Crear la rama de feature:
   ```bash
   git checkout -b feature/frontend-dashboard
   ```
3. Realizar los cambios visuales o funcionales (por ejemplo, agregar una tarjeta de estadísticas o filtro en `index.html` y `app.js`).
4. Realizar commit semántico:
   ```bash
   git add frontend/
   git commit -m "feat(frontend): add real-time status filter and metric card"
   ```
5. Subir la rama a GitHub:
   ```bash
   git push -u origin feature/frontend-dashboard
   ```
6. Abrir **Pull Request** hacia `develop` en GitHub, solicitar revisión a Paulo Rivas o Alexsander Rosales, y verificar que el CI pase en verde.

### 2. Tarea Hotfix 1: Corrección Crítica en Producción
Para cumplir con el requisito del hotfix simulado:
1. Partir **directamente desde `main`**:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b hotfix/fix-client-cors-error
   ```
2. Realizar la corrección necesaria (por ejemplo, manejo de errores o timeout en la llamada fetch en `src/app.js`).
3. Commit semántico:
   ```bash
   git add frontend/
   git commit -m "fix(frontend): resolve fetch exception when backend connection drops"
   ```
4. Subir la rama a GitHub:
   ```bash
   git push -u origin hotfix/fix-client-cors-error
   ```
5. Abrir Pull Request hacia `main` (disparando el GitHub Action de PR a `main`) y luego sincronizar hacia `develop`.
