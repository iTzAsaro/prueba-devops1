// ============================================================
// VI CITY — Requisitos del sistema / Ficha técnica
// ============================================================
import { SYS_REQ, RATING, LEGAL } from '../data/catalog.js';

export function renderSysReq() {
  const html = `
    <section class="section" id="ficha">
      <div class="container">
        <h2 class="section-title">Ficha <span class="accent">técnica</span></h2>
        <p class="section-sub">Requisitos de PC, clasificaciones y avisos legales.</p>

        <div class="grid grid-2">
          <div class="card">
            <h3 class="text-accent mb" style="text-transform:uppercase;letter-spacing:.06em">Mínimos</h3>
            <table class="req-table">
              ${SYS_REQ.min.map(r => `<tr><th>${r[0]}</th><td>${r[1]}</td></tr>`).join('')}
            </table>
          </div>
          <div class="card">
            <h3 class="text-pink mb" style="text-transform:uppercase;letter-spacing:.06em">Recomendados</h3>
            <table class="req-table">
              ${SYS_REQ.rec.map(r => `<tr><th>${r[0]}</th><td>${r[1]}</td></tr>`).join('')}
            </table>
          </div>
        </div>

        <div class="grid grid-2 mt-lg">
          <div class="card">
            <h3 class="mb">Clasificaciones de edad</h3>
            <div class="flex gap wrap mb">
              <span class="badge badge-danger">ESRB ${RATING.esrb.code}</span>
              <span class="badge badge-warn">PEGI ${RATING.pegi.code}</span>
            </div>
            <p class="text-muted" style="font-size:.88rem"><strong>ESRB:</strong> ${RATING.esrb.desc}</p>
            <p class="text-muted mt" style="font-size:.88rem"><strong>PEGI:</strong> ${RATING.pegi.desc}</p>
          </div>
          <div class="card">
            <h3 class="mb">Avisos legales de reserva</h3>
            <ul style="list-style:none">
              ${LEGAL.map(l => `<li style="padding:6px 0;font-size:.88rem;color:var(--text-muted);display:flex;gap:8px"><span class="text-cyan">▸</span>${l}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
    </section>`;

  return (root) => root.insertAdjacentHTML('beforeend', html);
}
