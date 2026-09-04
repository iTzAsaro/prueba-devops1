// ============================================================
// VI CITY — Checkout multi-paso con validaciones
// ============================================================
import { PLATFORMS, EDITIONS, EXTRAS, formatCLP, editionById, extraById, platformById, LEGAL, CHARGE_DATE } from '../data/catalog.js';
import { getState, updateSelection, setState, addOrder } from '../store/index.js';
import {
  toast, withLoader, sleep, validateEmail, validateCardNumber, validateExpiry,
  validateCVC, formatCardNumber, formatExpiry, detectCardBrand, formatDate, uid,
} from '../utils/ui.js';
import { navigate } from '../router.js';

function computeTotals(selection) {
  const ed = editionById(selection.editionId);
  const base = selection.format === 'physical' ? ed.pricePhysical : ed.priceDigital;
  const extrasTotal = selection.extras.reduce((s, id) => s + (extraById(id)?.price || 0), 0);
  const subtotal = base + extrasTotal;
  const iva = Math.round(subtotal * 0.19);
  return { base, extrasTotal, subtotal, iva, total: subtotal + iva, ed };
}

const STEPS = ['Contacto', 'Envío', 'Pago', 'Revisar'];

export function checkoutPage(root) {
  const sel = getState().selection;
  const isPhysical = sel.format === 'physical';
  const stepsList = isPhysical ? STEPS : STEPS.filter(s => s !== 'Envío');

  let step = 0;
  const form = { email: '', address: {}, payment: { method: 'card', number: '', name: '', expiry: '', cvc: '' }, legal: false };

  root.innerHTML = `
    <div class="section--tight section">
      <div class="container">
        <h1 class="section-title">Checkout de <span class="accent">preventa</span></h1>
        <div class="steps" id="steps"></div>
        <div class="checkout-layout">
          <div class="card card--pad-lg" id="step-body"></div>
          <div class="card card--pad-lg" id="order-summary"></div>
        </div>
      </div>
    </div>`;

  const stepsEl = root.querySelector('#steps');
  const bodyEl = root.querySelector('#step-body');
  const summaryEl = root.querySelector('#order-summary');

  function paintSteps() {
    stepsEl.innerHTML = stepsList.map((label, i) => {
      const cls = i === step ? 'active' : i < step ? 'done' : '';
      return `<div class="step ${cls}"><span class="num">${i < step ? '✓' : i + 1}</span>${label}</div>`;
    }).join('');
  }

  function paintSummary() {
    const s = getState().selection;
    const t = computeTotals(s);
    const p = platformById(s.platformId);
    summaryEl.innerHTML = `
      <h3 class="mb">Tu reserva</h3>
      <div class="summary__row"><span>Edición</span><strong>${t.ed.name}</strong></div>
      <div class="summary__row"><span>Plataforma</span><span>${p.icon} ${p.short}</span></div>
      <div class="summary__row"><span>Formato</span><span>${s.format === 'physical' ? 'Físico' : 'Digital'}</span></div>
      ${s.extras.map(id => { const ex = extraById(id); return `<div class="summary__row"><span>${ex.name}</span><span>${formatCLP(ex.price)}</span></div>`; }).join('')}
      <div class="summary__row total"><span>Total</span><span>${formatCLP(t.total)}</span></div>
      <p class="text-dim mt" style="font-size:.78rem">Cobro el ${formatDate(CHARGE_DATE)}. Reembolso hasta el Día 1.</p>`;
  }

  function paintStep() {
    const name = stepsList[step];
    if (name === 'Contacto') paintContact();
    else if (name === 'Envío') paintShipping();
    else if (name === 'Pago') paintPayment();
    else if (name === 'Revisar') paintReview();
  }

  function navButtons(back, nextLabel, onNext, canNext = true) {
    return `<div class="flex gap mt-lg">
      ${back ? `<button class="btn btn-dark btn-block" data-back>← Atrás</button>` : ''}
      <button class="btn btn-primary btn-block" data-next ${canNext ? '' : 'disabled'}>${nextLabel}</button>
    </div>`;
  }

  function bindNav(onNext) {
    bodyEl.querySelector('[data-back]')?.addEventListener('click', () => { step--; paint(); });
    bodyEl.querySelector('[data-next]')?.addEventListener('click', onNext);
  }

  // ===== Paso 1: Contacto =====
  function paintContact() {
    bodyEl.innerHTML = `
      <h2 class="mb">Identificación / Contacto</h2>
      <p class="text-muted mb">Ingresa tu correo para recibir la clave digital o el seguimiento del envío físico.</p>
      <div class="field">
        <label class="field-label">Correo electrónico *</label>
        <input class="field-input" id="ck-email" type="email" value="${form.email || getState().user.email || ''}" placeholder="tu@correo.com" />
        <div class="field-error" id="err-email"></div>
      </div>
      <div class="field">
        <label class="field-label">Confirmar correo *</label>
        <input class="field-input" id="ck-email2" type="email" value="${form.email || ''}" placeholder="repite tu correo" />
        <div class="field-error" id="err-email2"></div>
      </div>
      ${navButtons(false, 'Continuar', null)}
      <p class="text-dim mt" style="font-size:.78rem">¿Ya tienes cuenta? <a class="text-accent" id="quick-login" href="#">Inicio de sesión rápido</a></p>`;

    bodyEl.querySelector('#quick-login').addEventListener('click', e => {
      e.preventDefault();
      form.email = 'jugador@vicity.com';
      bodyEl.querySelector('#ck-email').value = form.email;
      bodyEl.querySelector('#ck-email2').value = form.email;
      toast('Sesión rápida simulada', 'info');
    });

    bindNav(async () => {
      const email = bodyEl.querySelector('#ck-email').value.trim();
      const email2 = bodyEl.querySelector('#ck-email2').value.trim();
      const err1 = bodyEl.querySelector('#err-email');
      const err2 = bodyEl.querySelector('#err-email2');
      err1.textContent = ''; err2.textContent = '';
      let ok = true;
      if (!validateEmail(email)) { err1.textContent = 'Correo inválido'; ok = false; }
      if (email !== email2) { err2.textContent = 'Los correos no coinciden'; ok = false; }
      if (!ok) return;
      form.email = email;
      setState({ user: { email } });
      toast('Correo validado', 'ok');
      step++; paint();
    });
  }

  // ===== Paso 2: Envío (solo físico) =====
  function paintShipping() {
    bodyEl.innerHTML = `
      <h2 class="mb">Datos de envío</h2>
      <p class="text-muted mb">Edición física — enviaremos para llegar el día de lanzamiento.</p>
      <div class="field-row">
        <div class="field"><label class="field-label">Nombre *</label><input class="field-input" id="sh-name" value="${form.address.name || ''}" /><div class="field-error" id="err-name"></div></div>
        <div class="field"><label class="field-label">Apellido *</label><input class="field-input" id="sh-surname" value="${form.address.surname || ''}" /><div class="field-error" id="err-surname"></div></div>
      </div>
      <div class="field"><label class="field-label">Dirección *</label><input class="field-input" id="sh-street" value="${form.address.street || ''}" placeholder="Av. Vice 123" /><div class="field-error" id="err-street"></div></div>
      <div class="field-row">
        <div class="field"><label class="field-label">Ciudad *</label><input class="field-input" id="sh-city" value="${form.address.city || ''}" /><div class="field-error" id="err-city"></div></div>
        <div class="field"><label class="field-label">Código postal</label><input class="field-input" id="sh-zip" value="${form.address.zip || ''}" /></div>
      </div>
      <div class="field"><label class="field-label">Teléfono</label><input class="field-input" id="sh-phone" value="${form.address.phone || ''}" /></div>
      ${navButtons(true, 'Continuar', null)}`;

    bindNav(() => {
      const fields = ['name', 'surname', 'street', 'city'];
      let ok = true;
      fields.forEach(f => {
        const v = bodyEl.querySelector(`#sh-${f}`).value.trim();
        const err = bodyEl.querySelector(`#err-${f}`);
        err.textContent = '';
        if (!v) { err.textContent = 'Requerido'; ok = false; }
        form.address[f] = v;
      });
      form.address.zip = bodyEl.querySelector('#sh-zip').value.trim();
      form.address.phone = bodyEl.querySelector('#sh-phone').value.trim();
      if (!ok) return;
      toast('Dirección guardada', 'ok');
      step++; paint();
    });
  }

  // ===== Paso 3: Pago =====
  function paintPayment() {
    const p = form.payment;
    bodyEl.innerHTML = `
      <h2 class="mb">Método de pago</h2>
      <p class="text-muted mb">Mockup interactivo — no se procesa pago real.</p>
      <div class="pay-method">
        <button class="option-chip ${p.method === 'card' ? 'active' : ''}" data-pm="card">💳 Tarjeta</button>
        <button class="option-chip ${p.method === 'paypal' ? 'active' : ''}" data-pm="paypal">🅿️ PayPal</button>
        <button class="option-chip ${p.method === 'wallet' ? 'active' : ''}" data-pm="wallet">📱 Billetera</button>
      </div>
      <div id="pm-body"></div>
      ${navButtons(true, 'Continuar', null)}`;

    const pmBody = bodyEl.querySelector('#pm-body');
    bodyEl.querySelectorAll('[data-pm]').forEach(b => b.addEventListener('click', () => {
      form.payment.method = b.dataset.pm;
      bodyEl.querySelectorAll('[data-pm]').forEach(x => x.classList.toggle('active', x === b));
      paintPmBody();
    }));

    function paintPmBody() {
      if (p.method === 'card') {
        const brand = detectCardBrand(p.number);
        pmBody.innerHTML = `
          <div class="card-mock" id="card-mock">
            <div class="card-mock__chip"></div>
            <div class="card-mock__number" id="mock-num">${p.number || '•••• •••• •••• ••••'}</div>
            <div class="card-mock__row"><span>Titular</span><strong>${p.name || 'NOMBRE APELLIDO'}</strong></div>
            <div class="card-mock__row"><span>Vence</span><strong>${p.expiry || 'MM/AA'}</strong></div>
            <div class="card-mock__row"><span>${brand}</span></div>
          </div>
          <div class="field"><label class="field-label">Número de tarjeta *</label><input class="field-input" id="pay-num" value="${p.number}" placeholder="4111 1111 1111 1111" /><div class="field-error" id="err-num"></div><div class="field-hint">Prueba: 4111 1111 1111 1111 (Visa)</div></div>
          <div class="field"><label class="field-label">Titular *</label><input class="field-input" id="pay-name" value="${p.name}" /><div class="field-error" id="err-name"></div></div>
          <div class="field-row">
            <div class="field"><label class="field-label">Vencimiento *</label><input class="field-input" id="pay-exp" value="${p.expiry}" placeholder="MM/AA" /><div class="field-error" id="err-exp"></div></div>
            <div class="field"><label class="field-label">CVC *</label><input class="field-input" id="pay-cvc" value="${p.cvc}" placeholder="123" /><div class="field-error" id="err-cvc"></div></div>
          </div>`;

        const numInput = pmBody.querySelector('#pay-num');
        const mockNum = pmBody.querySelector('#mock-num');
        numInput.addEventListener('input', () => {
          const v = formatCardNumber(numInput.value);
          numInput.value = v;
          p.number = v;
          mockNum.textContent = v || '•••• •••• •••• ••••';
        });
        pmBody.querySelector('#pay-name').addEventListener('input', e => p.name = e.target.value.toUpperCase());
        pmBody.querySelector('#pay-exp').addEventListener('input', e => {
          const v = formatExpiry(e.target.value);
          e.target.value = v; p.expiry = v;
        });
        pmBody.querySelector('#pay-cvc').addEventListener('input', e => p.cvc = e.target.value.replace(/\D/g, '').slice(0, 4));
      } else if (p.method === 'paypal') {
        pmBody.innerHTML = `<div class="empty"><div class="empty__icon">🅿️</div><p>Serás redirigido a PayPal (mockup).</p><p class="text-dim mt">Correo: ${form.email || '—'}</p></div>`;
      } else {
        pmBody.innerHTML = `<div class="empty"><div class="empty__icon">📱</div><p>Paga con saldo de tu billetera VI CITY.</p><p class="text-dim mt">Saldo simulado: ${formatCLP(150000)}</p></div>`;
      }
    }
    paintPmBody();

    bindNav(() => {
      if (p.method !== 'card') { toast(`${p.method === 'paypal' ? 'PayPal' : 'Billetera'} seleccionado`, 'ok'); step++; paint(); return; }
      let ok = true;
      const errs = {};
      if (!validateCardNumber(p.number)) { errs.num = 'Número inválido (Luhn)'; ok = false; }
      if (!p.name.trim()) { errs.name = 'Requerido'; ok = false; }
      if (!validateExpiry(p.expiry)) { errs.exp = 'Fecha inválida o vencida'; ok = false; }
      if (!validateCVC(p.cvc)) { errs.cvc = 'CVC inválido'; ok = false; }
      ['num', 'name', 'exp', 'cvc'].forEach(k => { const e = pmBody.querySelector(`#err-${k}`); if (e) e.textContent = errs[k] || ''; });
      if (!ok) return;
      toast('Método de pago validado', 'ok');
      step++; paint();
    });
  }

  // ===== Paso 4: Revisar =====
  function paintReview() {
    const s = getState().selection;
    const t = computeTotals(s);
    bodyEl.innerHTML = `
      <h2 class="mb">Revisa y confirma</h2>
      <div class="summary__row"><span>Contacto</span><strong>${form.email}</strong></div>
      ${isPhysical ? `<div class="summary__row"><span>Envío</span><span>${form.address.street || ''}, ${form.address.city || ''}</span></div>` : ''}
      <div class="summary__row"><span>Pago</span><span>${form.payment.method === 'card' ? `Tarjeta ${detectCardBrand(form.payment.number)} ••${form.payment.number.slice(-4)}` : form.payment.method}</span></div>
      <div class="summary__row total"><span>Total a reservar</span><span>${formatCLP(t.total)}</span></div>

      <div class="card card--glass mt-lg" style="border-color:var(--border-strong)">
        <label class="flex gap center" style="cursor:pointer;gap:10px">
          <input type="checkbox" id="legal-ck" ${form.legal ? 'checked' : ''} style="width:20px;height:20px;accent-color:var(--accent)" />
          <span style="font-size:.9rem">Acepto la política de reserva: no se cobrará hasta el ${formatDate(CHARGE_DATE)} y puedo solicitar reembolso hasta el Día 1.</span>
        </label>
      </div>
      ${navButtons(true, 'Confirmar reserva', null)}`;

    bodyEl.querySelector('#legal-ck').addEventListener('change', e => form.legal = e.target.checked);

    bindNav(withLoader(bodyEl.querySelector('[data-next]'), async () => {
      if (!form.legal) { toast('Debes aceptar la política de reserva', 'warn'); return; }
      await sleep(1200);
      const order = {
        id: uid(),
        createdAt: new Date().toISOString(),
        selection: { ...s },
        totals: t,
        contact: { email: form.email },
        shipping: isPhysical ? form.address : null,
        payment: { method: form.payment.method, last4: form.payment.number.slice(-4) },
        status: 'reservada',
      };
      addOrder(order);
      toast('¡Reserva confirmada!', 'ok');
      navigate('/success');
    }));
  }

  function paint() { paintSteps(); paintStep(); paintSummary(); }

  paint();
}
