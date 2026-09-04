// ============================================================
// VI CITY — Confirmación de reserva (Success Page)
// ============================================================
import { getState } from '../store/index.js';
import { PRELOAD_DATE, RELEASE_DATE, formatCLP, editionById, platformById, extraById } from '../data/catalog.js';
import {
  startCountdown, renderCountdownUnits, formatDate, printReceipt,
  googleCalendarLink, icalDownload, toast,
} from '../utils/ui.js';
import { navigate } from '../router.js';

export function successPage(root) {
  const orders = getState().orders;
  const order = orders[0];

  if (!order) {
    root.innerHTML = `<div class="empty"><div class="empty__icon">🛒</div><h2>No hay reservas recientes</h2><p class="mt">Configura tu reserva para comenzar.</p><button class="btn btn-primary mt" id="go-cust">Ir al configurador</button></div>`;
    root.querySelector('#go-cust').onclick = () => navigate('/customizer');
    return;
  }

  const ed = editionById(order.selection.editionId);
  const p = platformById(order.selection.platformId);
  const isPhysical = order.selection.format === 'physical';

  root.innerHTML = `
    <div class="section--tight section">
      <div class="container">
        <div class="success-hero">
          <div class="success-check">✓</div>
          <h1 class="section-title">¡Reserva <span class="accent">confirmada</span>!</h1>
          <p class="text-muted mt">Orden <strong class="text-accent">${order.id}</strong> · ${formatDate(new Date(order.createdAt), { dateStyle: 'medium', timeStyle: 'short' })}</p>
        </div>

        <div class="grid grid-2">
          <div class="card card--pad-lg">
            <h3 class="mb">Resumen de compra</h3>
            <div class="summary__row"><span>Edición</span><strong>${ed.name}</strong></div>
            <div class="summary__row"><span>Plataforma</span><span>${p.icon} ${p.name}</span></div>
            <div class="summary__row"><span>Formato</span><span>${isPhysical ? 'Físico' : 'Digital'}</span></div>
            ${order.selection.extras.map(id => { const ex = extraById(id); return `<div class="summary__row"><span>${ex.name}</span><span>${formatCLP(ex.price)}</span></div>`; }).join('')}
            <div class="summary__row total"><span>Total</span><span>${formatCLP(order.totals.total)}</span></div>

            <div class="mt-lg">
              <span class="badge badge-warn">● En espera de precarga</span>
            </div>
          </div>

          <div class="card card--pad-lg">
            <h3 class="mb">Estado de precarga</h3>
            <p class="text-muted mb">La precarga estará disponible el <strong class="text-accent">${formatDate(PRELOAD_DATE)}</strong> a las 00:00 UTC.</p>
            <div class="countdown" id="preload-cd"></div>

            <h4 class="mt-lg" style="text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted)">Clave digital</h4>
            <div class="key-placeholder mt">
              🔒 La clave se revelará el ${formatDate(PRELOAD_DATE)} a las 00:00 UTC
            </div>

            <div class="flex gap wrap mt-lg">
              <button class="btn btn-ghost btn-sm" id="cal-google">📅 Google Calendar</button>
              <button class="btn btn-ghost btn-sm" id="cal-ical">📅 iCal</button>
              <button class="btn btn-ghost btn-sm" id="dl-pdf">⬇ Recibo PDF</button>
              <button class="btn btn-ghost btn-sm" id="print">🖨 Imprimir</button>
            </div>
          </div>
        </div>

        <div class="flex gap center mt-lg" style="justify-content:center">
          <button class="btn btn-primary" id="go-dash">Ver mis preventas</button>
          <button class="btn btn-dark" id="go-home">Volver al inicio</button>
        </div>
      </div>
    </div>`;

  // Countdown a precarga
  const cdEl = root.querySelector('#preload-cd');
  const stop = startCountdown(PRELOAD_DATE, c => {
    cdEl.innerHTML = c.done ? '<span class="badge badge-ok">¡Precarga disponible!</span>' : renderCountdownUnits(c);
  });

  // Calendar
  const calStart = RELEASE_DATE;
  const calEnd = new Date(RELEASE_DATE.getTime() + 2 * 3600000);
  const calTitle = 'GTA VI — Lanzamiento';
  const calDesc = `Lanzamiento de GTA VI. Orden ${order.id}. Precarga desde ${formatDate(PRELOAD_DATE)}.`;

  root.querySelector('#cal-google').onclick = () => {
    window.open(googleCalendarLink({ title: calTitle, start: calStart, end: calEnd, description: calDesc }), '_blank');
  };
  root.querySelector('#cal-ical').onclick = () => {
    icalDownload({ title: calTitle, start: calStart, end: calEnd, description: calDesc });
    toast('Archivo .ics descargado', 'ok');
  };

  // Recibo
  const receiptHtml = `
    <h1>VI·CITY — Recibo de reserva</h1>
    <p class="muted">Orden: ${order.id}</p>
    <p class="muted">Fecha: ${formatDate(new Date(order.createdAt), { dateStyle: 'medium', timeStyle: 'short' })}</p>
    <table>
      <tr><th>Edición</th><td>${ed.name}</td></tr>
      <tr><th>Plataforma</th><td>${p.name}</td></tr>
      <tr><th>Formato</th><td>${isPhysical ? 'Físico' : 'Digital'}</td></tr>
      ${order.selection.extras.map(id => `<tr><th>Extra</th><td>${extraById(id).name} — ${formatCLP(extraById(id).price)}</td></tr>`).join('')}
      <tr><th>Subtotal</th><td>${formatCLP(order.totals.subtotal)}</td></tr>
      <tr><th>IVA</th><td>${formatCLP(order.totals.iva)}</td></tr>
      <tr><th><strong>Total</strong></th><td><strong>${formatCLP(order.totals.total)}</strong></td></tr>
    </table>
    <p class="muted mt">Estado: Reservada — En espera de precarga (${formatDate(PRELOAD_DATE)})</p>
    <p class="muted">No se cobrará hasta el ${formatDate(new Date('2026-05-19'))}. Reembolso hasta el Día 1.</p>`;

  root.querySelector('#dl-pdf').onclick = () => printReceipt(receiptHtml);
  root.querySelector('#print').onclick = () => printReceipt(receiptHtml);

  root.querySelector('#go-dash').onclick = () => navigate('/dashboard');
  root.querySelector('#go-home').onclick = () => navigate('/');

  return () => stop();
}
