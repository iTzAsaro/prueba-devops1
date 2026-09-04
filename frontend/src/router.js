// ============================================================
// VI CITY — Router SPA minimalista (hash-based)
// ============================================================

const routes = new Map();
let currentCleanup = null;

export function register(path, handler) { routes.set(path, handler); }

export function navigate(path) {
  if (location.hash !== `#${path}`) location.hash = path;
  else render();
}

export function currentPath() {
  const h = location.hash.replace(/^#/, '');
  return h || '/';
}

function render() {
  const path = currentPath();
  const app = document.getElementById('app');
  if (currentCleanup) { currentCleanup(); currentCleanup = null; }
  app.innerHTML = '';
  app.classList.add('page-loader');
  app.innerHTML = '<span class="loader loader--page"></span>';

  // microtask para mostrar loader
  queueMicrotask(() => {
    const handler = routes.get(path) || routes.get('/404');
    app.classList.remove('page-loader');
    app.innerHTML = '';
    const result = handler(app);
    if (typeof result === 'function') currentCleanup = result;
    updateNavActive(path);
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
}

function updateNavActive(path) {
  document.querySelectorAll('.nav-link').forEach(a => {
    a.classList.toggle('active', a.dataset.path === path);
  });
}

export function initRouter() {
  window.addEventListener('hashchange', render);
  if (!location.hash) location.hash = '/';
  render();
}
