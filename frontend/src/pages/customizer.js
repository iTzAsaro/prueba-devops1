// ============================================================
// VI CITY — Configurador de compra (Pre-order Customizer)
// ============================================================
import { PLATFORMS, EDITIONS, EXTRAS, formatCLP, editionById, extraById } from '../data/catalog.js';
import { getState, updateSelection, subscribe } from '../store/index.js';
import { toast, withLoader, sleep } from '../utils/ui.js';
import { navigate } from '../router.js';

function computeTotals(selection) {
  const ed = editionById(selection.editionId);
  const base = selection.format === 'physical' ? ed.pricePhysical : ed.priceDigital;
  const extrasTotal = selection.extras.reduce((s, id) => s + (extraById(id)?.price || 0), 0);
  const subtotal = base + extrasTotal;
  const iva = Math.round(subtotal * 0.19);
  const total = subtotal + iva;
  return { base, extrasTotal, subtotal, iva, total, ed };
}

export function customizerPage(root) {
  const state = getState();
  const sel = state.selection;

  root.innerHTML = `
    <div class="section">
      <div class="container">
        <h1 class="section-title">Configura tu <span class="accent">reserva</span></h1>
        <p class="section-sub">Personaliza plataforma, edición y extras. El precio se actualiza en tiempo real.</p>

        <div class="customizer">
          <div class="card card--pad-lg" id="config-panel">
            <div class="option-group">
              <h4>Plataforma</h4>
              <div class="option-row" id="platform-row"></div>
            </div>
            <div class="option-group">
              <h4>Edición</h4>
              <div class="option-row" id="edition-row"></div>
            </div>
            <div class="option-group">
              <h4>Formato</h4>
              <div class="format-toggle" id="format-toggle">
                <button data-fmt="digital">Digital</button>
                <button data-fmt="physical">Físico</button>
              </div>
            </div>
            <div class="option-group">
              <h4>Extras opcionales</h4>
              <div class="option-row" id="extras-row"></div>
            </div>
          </div>

          <div class="card card--pad-lg card--glow summary" id="summary-panel">
          </div>
        </div>
      </div>
    </div>`;

  const platformRow = root.querySelector('#platform-row');
  const editionRow = root.querySelector('#edition-row');
  const extrasRow = root.querySelector('#extras-row');
  const formatToggle = root.querySelector('#format-toggle');
  const summaryPanel = root.querySelector('#summary-panel');

  function paint() {
    const s = getState().selection;

    // Platforms
    platformRow.innerHTML = PLATFORMS.map(p => `
      <button class="option-chip ${s.platformId === p.id ? 'active' : ''}" data-p="${p.id}">
        ${p.icon} ${p.short}
      </button>`).join('');
    platformRow.querySelectorAll('[data-p]').forEach(b => b.addEventListener('click', () => {
      updateSelection({ platformId: b.dataset.p }); paint();
    }));

    // Editions
    editionRow.innerHTML = EDITIONS.map(ed => {
      const disabled = ed.physicalOnly && s.format === 'digital';
      return `<button class="option-chip ${s.editionId === ed.id ? 'active' : ''}" data-e="${ed.id}" ${disabled ? 'disabled' : ''}>
        ${ed.name} <span class="price">${ed.physicalOnly ? 'físico' : formatCLP(s.format === 'physical' ? ed.pricePhysical : ed.priceDigital)}</span>
      </button>`;
    }).join('');
    editionRow.querySelectorAll('[data-e]').forEach(b => b.addEventListener('click', () => {
      updateSelection({ editionId: b.dataset.e }); paint();
    }));

    // Format
    formatToggle.querySelectorAll('button').forEach(b => b.classList.toggle('active', b.dataset.fmt === s.format));

    // Extras
    extrasRow.innerHTML = EXTRAS.map(ex => `
      <button class="option-chip ${s.extras.includes(ex.id) ? 'active' : ''}" data-x="${ex.id}">
        ${ex.icon} ${ex.name} <span class="price">+${formatCLP(ex.price)}</span>
      </button>`).join('');
    extrasRow.querySelectorAll('[data-x]').forEach(b => b.addEventListener('click', () => {
      const id = b.dataset.x;
      const extras = s.extras.includes(id) ? s.extras.filter(x => x !== id) : [...s.extras, id];
      updateSelection({ extras }); paint();
    }));

    // Summary
    const t = computeTotals(s);
    const platform = PLATFORMS.find(p => p.id === s.platformId);
    summaryPanel.innerHTML = `
      <h3 class="mb" style="text-transform:uppercase;letter-spacing:.08em">Resumen de reserva</h3>
      <div class="summary__row"><span>Plataforma</span><strong>${platform.icon} ${platform.name}</strong></div>
      <div class="summary__row"><span>Edición</span><strong>${t.ed.name}</strong></div>
      <div class="summary__row"><span>Formato</span><strong>${s.format === 'physical' ? 'Físico' : 'Digital'}</strong></div>
      <div class="summary__row"><span>Precio base</span><span>${formatCLP(t.base)}</span></div>
      ${s.extras.length ? `<div class="summary__row"><span>Extras (${s.extras.length})</span><span>${formatCLP(t.extrasTotal)}</span></div>` : ''}
      <div class="summary__row"><span>Subtotal</span><span>${formatCLP(t.subtotal)}</span></div>
      <div class="summary__row"><span>IVA (19%)</span><span>${formatCLP(t.iva)}</span></div>
      <div class="summary__row total"><span>Total</span><span>${formatCLP(t.total)}</span></div>

      <h4 class="mt" style="text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted);font-size:.84rem">Bonus incluidos</h4>
      <ul class="summary__bonuses">${t.ed.bonuses.map(b => `<li>${b}</li>`).join('')}</ul>

      <button class="btn btn-primary btn-block mt-lg" id="go-checkout">Ir a checkout</button>
      <p class="text-dim text-center mt" style="font-size:.78rem">No se cobrará hasta el 19/05/2026</p>`;

    const btn = summaryPanel.querySelector('#go-checkout');
    btn.addEventListener('click', withLoader(btn, async () => {
      await sleep(600);
      toast('Configuración guardada. Continuando al checkout...', 'ok');
      navigate('/checkout');
    }));
  }

  formatToggle.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
    const fmt = b.dataset.fmt;
    const { editionId } = getState().selection;
    const ed = editionById(editionId);
    if (ed?.physicalOnly && fmt === 'digital') {
      toast('Collector\'s solo físico. Editando a Deluxe.', 'warn');
      updateSelection({ format: 'digital', editionId: 'deluxe' });
    } else {
      updateSelection({ format: fmt });
    }
    paint();
  }));

  paint();
  const unsub = subscribe(() => paint());
  return () => unsub();
}
