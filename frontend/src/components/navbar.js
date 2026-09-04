// ============================================================
// VI CITY — Navbar
// ============================================================
import { navigate, currentPath } from '../router.js';
import { getState, subscribe } from '../store/index.js';
import { EDITIONS } from '../data/catalog.js';
import { formatCLP } from '../data/catalog.js';

export function renderNavbar() {
  const el = document.getElementById('navbar');
  const state = getState();
  const sel = state.selection;
  const ed = EDITIONS.find(e => e.id === sel.editionId);
  const price = ed ? (sel.format === 'physical' ? ed.pricePhysical : ed.priceDigital) : 0;

  el.innerHTML = `
    <div class="nav-inner">
      <span class="nav-logo" data-nav="/">VI·CITY</span>
      <nav class="nav-links">
        <a class="nav-link" data-path="/" data-nav="/">Preventa</a>
        <a class="nav-link" data-path="/customizer" data-nav="/customizer">Configurar</a>
        <a class="nav-link" data-path="/checkout" data-nav="/checkout">Checkout</a>
        <a class="nav-link" data-path="/dashboard" data-nav="/dashboard">Mis Preventas</a>
      </nav>
      <button class="nav-cart" data-nav="/customizer">
        🛒 Reservar <span class="dot">${formatCLP(price)}</span>
      </button>
    </div>`;

  el.querySelectorAll('[data-nav]').forEach(a => {
    a.addEventListener('click', e => { e.preventDefault(); navigate(a.dataset.nav); });
  });

  // resaltar activo
  const p = currentPath();
  el.querySelectorAll('.nav-link').forEach(a => a.classList.toggle('active', a.dataset.path === p));
}

export function mountNavbar() {
  renderNavbar();
  subscribe(renderNavbar);
}
