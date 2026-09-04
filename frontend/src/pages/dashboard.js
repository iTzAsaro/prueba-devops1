// ============================================================
// VI CITY — Panel "Mis Preventas" (Dashboard)
// ============================================================
import { getState, updateOrder, cancelOrder, subscribe } from '../store/index.js';
import { formatCLP, editionById, platformById, extraById } from '../data/catalog.js';
import { toast, modal, confirmDialog, statusBadge, formatDate, withLoader, sleep } from '../utils/ui.js';
import { navigate } from '../router.js';

const STATUS_FLOW = ['reservada', 'pago-procesado', 'listo-precarga', 'enviada'];

function statusProgress(status) {
  const idx = STATUS_FLOW.indexOf(status);
  if (status === 'cancelada') return -1;
  return idx < 0 ? 0 : idx;
}

function orderSummaryHtml(order) {
  const ed = editionById(order.selection.editionId);
  const p = platformById(order.selection.platformId);
  return `
    <div class="summary__row"><span>Edición</span><strong>${ed.name}</strong></div>
    <div class="summary__row"><span>Plataforma</span><span>${p.icon} ${p.short}</span></div>
    <div class="summary__row"><span>Formato</span><span>${order.selection.format === 'physical' ? 'Físico' : 'Digital'}</span></div>
    <div class="summary__row total"><span>Total</span><span>${formatCLP(order.totals.total)}</span></div>`;
}

export function dashboardPage(root) {
  function paint() {
    const { orders } = getState();

    if (!orders.length) {
      root.innerHTML = `
        <div class="section">
          <div class="container">
            <h1 class="section-title">Mis <span class="accent">preventas</span></h1>
            <div class="empty">
              <div class="empty__icon">📋</div>
              <h2>No tienes reservas activas</h2>
              <p class="mt">Cuando reserves, aparecerán aquí con su estado y opciones de gestión.</p>
              <button class="btn btn-primary mt" id="go-cust">Reservar ahora</button>
            </div>
          </div>
        </div>`;
      root.querySelector('#go-cust').onclick = () => navigate('/customizer');
      return;
    }

    root.innerHTML = `
      <div class="section">
        <div class="container">
          <div class="flex between center mb">
            <h1 class="section-title">Mis <span class="accent">preventas</span></h1>
            <button class="btn btn-ghost btn-sm" id="new-reserve">+ Nueva reserva</button>
          </div>
          <div class="grid" style="gap:18px" id="orders-list"></div>
        </div>
      </div>`;

    const list = root.querySelector('#orders-list');
    list.innerHTML = orders.map(order => {
      const ed = editionById(order.selection.editionId);
      const p = platformById(order.selection.platformId);
      const progress = statusProgress(order.status);
      const isPhysical = order.selection.format === 'physical';
      const cancelled = order.status === 'cancelada';
      return `
        <div class="order-card" data-order="${order.id}">
          <div class="order-card__head">
            <div>
              <span class="order-card__id">${order.id}</span>
              <span class="text-dim" style="font-size:.82rem"> · ${formatDate(new Date(order.createdAt), { dateStyle: 'medium', timeStyle: 'short' })}</span>
            </div>
            ${statusBadge(order.status)}
          </div>

          <div class="timeline">
            ${STATUS_FLOW.map((_, i) => `<div class="timeline__node ${i <= progress && !cancelled ? 'done' : ''}"></div>`).join('')}
          </div>

          <p class="mb"><strong>${ed.name}</strong> · ${p.icon} ${p.short} · ${isPhysical ? 'Físico' : 'Digital'}</p>

          <dl class="order-card__body">
            <dt>Contacto</dt><dd>${order.contact?.email || '—'}</dd>
            <dt>Pago</dt><dd>${order.payment?.method === 'card' ? `Tarjeta ••${order.payment.last4 || ''}` : order.payment?.method || '—'}</dd>
            ${isPhysical && order.shipping ? `<dt>Envío</dt><dd>${order.shipping.street || ''}, ${order.shipping.city || ''}</dd>` : ''}
            <dt>Total</dt><dd><strong class="text-accent">${formatCLP(order.totals.total)}</strong></dd>
          </dl>

          ${cancelled ? '' : `<div class="order-card__actions">
            ${isPhysical ? `<button class="btn btn-dark btn-sm" data-act="address" data-id="${order.id}">✏ Dirección</button>` : ''}
            <button class="btn btn-dark btn-sm" data-act="payment" data-id="${order.id}">💳 Pago</button>
            <button class="btn btn-dark btn-sm" data-act="detail" data-id="${order.id}">🔍 Detalle</button>
            <button class="btn btn-danger btn-sm" data-act="cancel" data-id="${order.id}">✕ Cancelar</button>
          </div>`}
        </div>`;
    }).join('');

    root.querySelector('#new-reserve').onclick = () => navigate('/customizer');

    list.querySelectorAll('[data-act]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const act = btn.dataset.act;
        if (act === 'cancel') doCancel(id);
        else if (act === 'address') editAddress(id);
        else if (act === 'payment') editPayment(id);
        else if (act === 'detail') showDetail(id);
      });
    });
  }

  function doCancel(id) {
    confirmDialog({
      title: 'Cancelar preventa',
      message: '¿Seguro que deseas cancelar esta reserva? El reembolso se procesa según la política (hasta el Día 1).',
      confirmText: 'Sí, cancelar',
      danger: true,
    }).then(async ok => {
      if (!ok) return;
      await sleep(500);
      cancelOrder(id);
      toast('Preventa cancelada', 'ok');
      paint();
    });
  }

  function editAddress(id) {
    const order = getState().orders.find(o => o.id === id);
    const sh = order.shipping || {};
    const m = modal({
      title: 'Cambiar dirección de envío',
      bodyHtml: `
        <div class="field"><label class="field-label">Dirección</label><input class="field-input" id="ad-street" value="${sh.street || ''}" /></div>
        <div class="field-row">
          <div class="field"><label class="field-label">Ciudad</label><input class="field-input" id="ad-city" value="${sh.city || ''}" /></div>
          <div class="field"><label class="field-label">Código postal</label><input class="field-input" id="ad-zip" value="${sh.zip || ''}" /></div>
        </div>
        <div class="field"><label class="field-label">Teléfono</label><input class="field-input" id="ad-phone" value="${sh.phone || ''}" /></div>
        <button class="btn btn-primary btn-block" id="ad-save">Guardar cambios</button>`,
    });
    m.root.querySelector('#ad-save').onclick = withLoader(m.root.querySelector('#ad-save'), async () => {
      const shipping = {
        ...sh,
        street: m.root.querySelector('#ad-street').value.trim(),
        city: m.root.querySelector('#ad-city').value.trim(),
        zip: m.root.querySelector('#ad-zip').value.trim(),
        phone: m.root.querySelector('#ad-phone').value.trim(),
      };
      await sleep(400);
      updateOrder(id, { shipping });
      m.close();
      toast('Dirección actualizada', 'ok');
      paint();
    });
  }

  function editPayment(id) {
    const order = getState().orders.find(o => o.id === id);
    const m = modal({
      title: 'Modificar método de pago',
      bodyHtml: `
        <p class="text-muted mb">El cobro final se realiza 7 días antes del lanzamiento.</p>
        <div class="pay-method">
          <button class="option-chip ${order.payment?.method === 'card' ? 'active' : ''}" data-pm="card">💳 Tarjeta</button>
          <button class="option-chip ${order.payment?.method === 'paypal' ? 'active' : ''}" data-pm="paypal">🅿️ PayPal</button>
          <button class="option-chip ${order.payment?.method === 'wallet' ? 'active' : ''}" data-pm="wallet">📱 Billetera</button>
        </div>
        <div class="field mt"><label class="field-label">Últimos 4 dígitos</label><input class="field-input" id="pm-last4" value="${order.payment?.last4 || ''}" maxlength="4" /></div>
        <button class="btn btn-primary btn-block mt" id="pm-save">Guardar</button>`,
    });
    let method = order.payment?.method || 'card';
    m.root.querySelectorAll('[data-pm]').forEach(b => b.onclick = () => {
      method = b.dataset.pm;
      m.root.querySelectorAll('[data-pm]').forEach(x => x.classList.toggle('active', x === b));
    });
    m.root.querySelector('#pm-save').onclick = withLoader(m.root.querySelector('#pm-save'), async () => {
      const last4 = m.root.querySelector('#pm-last4').value.trim();
      await sleep(400);
      updateOrder(id, { payment: { method, last4 } });
      m.close();
      toast('Método de pago actualizado', 'ok');
      paint();
    });
  }

  function showDetail(id) {
    const order = getState().orders.find(o => o.id === id);
    const ed = editionById(order.selection.editionId);
    modal({
      title: `Detalle ${order.id}`,
      bodyHtml: `
        ${orderSummaryHtml(order)}
        <h4 class="mt" style="text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted);font-size:.84rem">Bonus incluidos</h4>
        <ul class="summary__bonuses">${ed.bonuses.map(b => `<li>${b}</li>`).join('')}</ul>
        ${order.selection.extras.length ? `<h4 class="mt" style="text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted);font-size:.84rem">Extras</h4><ul class="summary__bonuses">${order.selection.extras.map(x => `<li>${extraById(x).name}</li>`).join('')}</ul>` : ''}
        <p class="text-dim mt" style="font-size:.82rem">Estado: ${order.status} · Creada: ${formatDate(new Date(order.createdAt), { dateStyle: 'medium', timeStyle: 'short' })}</p>`,
    });
  }

  paint();
  const unsub = subscribe(() => paint());
  return () => unsub();
}
