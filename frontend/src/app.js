// Frontend Application Logic - Kevin Gallardo
const BACKEND_API_URL = 'http://localhost:3000/api';

// Estado local reactivo con datos de muestra iniciales
let state = {
  items: [
    { id: 1, title: 'Servicio de Autenticación JWT', category: 'Servicio', status: 'Activo', time: '10:00:15' },
    { id: 2, title: 'Endpoint Métricas Cloud', category: 'Pipeline', status: 'Activo', time: '10:14:22' }
  ],
  backendOnline: false
};

// Elementos del DOM
const backendStatusEl = document.getElementById('backend-status');
const itemsTableBody = document.getElementById('items-table-body');
const itemForm = document.getElementById('item-form');
const btnCheckApi = document.getElementById('btn-check-api');
const logsTerminal = document.getElementById('logs-terminal');
const btnClearLogs = document.getElementById('btn-clear-logs');

// Función para registrar en la consola visual
function appendLog(message, type = 'info') {
  const line = document.createElement('div');
  line.className = `log-line log-${type}`;
  const timestamp = new Date().toLocaleTimeString();
  line.textContent = `[${timestamp}] ${message}`;
  logsTerminal.appendChild(line);
  logsTerminal.scrollTop = logsTerminal.scrollHeight;
}

// Renderizar tabla de items
function renderTable() {
  itemsTableBody.innerHTML = '';
  state.items.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>#${item.id}</td>
      <td><strong>${escapeHtml(item.title)}</strong></td>
      <td><span class="badge ${getCategoryBadge(item.category)}">${item.category}</span></td>
      <td><span class="status-online">● ${item.status}</span></td>
      <td>${item.time}</td>
    `;
    itemsTableBody.appendChild(row);
  });
}

function getCategoryBadge(cat) {
  if (cat === 'Servicio') return 'badge-fe';
  if (cat === 'Módulo') return 'badge-be';
  return 'badge-ops';
}

function escapeHtml(str) {
  return str.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag] || tag));
}

// Verificar conexión con el microservicio Backend
async function checkBackendConnection() {
  appendLog('Intentando conectar con Backend API en ' + BACKEND_API_URL + '/health...', 'info');
  try {
    const res = await fetch(`${BACKEND_API_URL}/health`, { method: 'GET', mode: 'cors' });
    if (res.ok) {
      const data = await res.json();
      state.backendOnline = true;
      backendStatusEl.className = 'status-online';
      backendStatusEl.textContent = `● Conectado (v${data.version || '1.0.0'})`;
      appendLog(`Backend conectado exitosamente: ${JSON.stringify(data)}`, 'success');
      loadRemoteItems();
    } else {
      throw new Error(`HTTP Status ${res.status}`);
    }
  } catch (err) {
    state.backendOnline = false;
    backendStatusEl.className = 'status-pending';
    backendStatusEl.textContent = '● Modo Autónomo (Sin Backend)';
    appendLog(`Backend no disponible (${err.message}). Operando con almacenamiento local.`, 'warn');
  }
}

// Cargar items desde el backend si está activo
async function loadRemoteItems() {
  try {
    const res = await fetch(`${BACKEND_API_URL}/items`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        state.items = data;
        renderTable();
        appendLog(`Cargados ${data.length} recursos desde el backend.`, 'info');
      }
    }
  } catch (err) {
    // Si falla, se conservan los locales
  }
}

// Manejar nuevo registro
itemForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const titleInput = document.getElementById('item-title');
  const categoryInput = document.getElementById('item-category');

  const title = titleInput.value.trim();
  const category = categoryInput.value;

  if (!title) return;

  const newItem = {
    id: state.items.length + 1,
    title,
    category,
    status: 'Activo',
    time: new Date().toLocaleTimeString()
  };

  // Intentar persistir en backend si está disponible
  if (state.backendOnline) {
    try {
      const res = await fetch(`${BACKEND_API_URL}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });
      if (res.ok) {
        appendLog(`Recurso registrado en Backend API: "${title}"`, 'success');
      }
    } catch (err) {
      appendLog(`Error al sincronizar con backend: ${err.message}`, 'error');
    }
  } else {
    appendLog(`Recurso guardado localmente: "${title}"`, 'info');
  }

  state.items.unshift(newItem);
  renderTable();
  titleInput.value = '';
});

btnCheckApi.addEventListener('click', () => {
  checkBackendConnection();
});

btnClearLogs.addEventListener('click', () => {
  logsTerminal.innerHTML = '';
  appendLog('Consola reiniciada.', 'system');
});

// Inicialización
renderTable();
checkBackendConnection();
