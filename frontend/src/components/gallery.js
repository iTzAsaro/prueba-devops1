// ============================================================
// VI CITY — Galería multimedia (trailers + capturas + lightbox)
// ============================================================
import { TRAILERS, SCREENSHOTS } from '../data/catalog.js';
import { modal } from '../utils/ui.js';

const GRAD = {
  'gradient-a': 'linear-gradient(135deg,#ff2d6f,#ffb627)',
  'gradient-b': 'linear-gradient(135deg,#7c5cff,#00e0c6)',
  'gradient-c': 'linear-gradient(135deg,#ffb627,#ff2d6f)',
  'gradient-d': 'linear-gradient(135deg,#00e0c6,#7c5cff)',
  'gradient-e': 'linear-gradient(135deg,#2d0a3e,#ff2d6f)',
  'gradient-f': 'linear-gradient(135deg,#0a0e17,#00e0c6)',
};

function thumbStyle(g) { return `background:${GRAD[g] || GRAD['gradient-a']};background-size:cover`; }

export function renderGallery() {
  const html = `
    <section class="section" id="galeria">
      <div class="container">
        <h2 class="section-title">Galería <span class="accent">multimedia</span></h2>
        <p class="section-sub">Tráilers y capturas 4K de Vice City.</p>

        <div class="tabs" id="gal-tabs">
          <button data-tab="trailers" class="active">Tráilers</button>
          <button data-tab="shots">Capturas 4K</button>
        </div>

        <div id="gal-content"></div>
      </div>
    </section>`;

  const mount = (root) => {
    root.insertAdjacentHTML('beforeend', html);
    const tabs = root.querySelector('#gal-tabs');
    const content = root.querySelector('#gal-content');

    function paint(tab) {
      tabs.querySelectorAll('button').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
      if (tab === 'trailers') {
        content.innerHTML = `<div class="gallery-grid">
          ${TRAILERS.map(t => `
            <div class="trailer-card" data-trailer="${t.id}" style="${thumbStyle(t.thumb)}">
              <div class="play"><span>▶</span></div>
            </div>`).join('')}
        </div>
        <p class="text-muted mt" style="font-size:.84rem">Click para abrir el reproductor (mockup).</p>`;

        content.querySelectorAll('[data-trailer]').forEach(c => {
          c.addEventListener('click', () => {
            const t = TRAILERS.find(x => x.id === c.dataset.trailer);
            modal({
              title: t.title,
              bodyHtml: `<div style="aspect-ratio:16/9;border-radius:12px;${thumbStyle(t.thumb)};display:grid;place-items:center;color:#fff;font-size:1.2rem">▶ Reproductor de tráiler (mockup)</div>
                <p class="text-muted mt">${t.title} · ${t.year} · 4K HDR</p>`,
            });
          });
        });
      } else {
        content.innerHTML = `<div class="gallery-grid">
          ${SCREENSHOTS.map(s => `
            <div class="shot" data-shot="${s.id}" style="${thumbStyle(s.thumb)}" title="${s.title}"></div>`).join('')}
        </div>`;
        content.querySelectorAll('[data-shot]').forEach(c => {
          c.addEventListener('click', () => {
            const s = SCREENSHOTS.find(x => x.id === c.dataset.shot);
            modal({
              title: s.title,
              bodyHtml: `<div style="aspect-ratio:16/9;border-radius:12px;${thumbStyle(s.thumb)};display:grid;place-items:center;color:#fff">Captura 4K · ${s.title}</div>`,
            });
          });
        });
      }
    }

    tabs.querySelectorAll('button').forEach(b => b.addEventListener('click', () => paint(b.dataset.tab)));
    paint('trailers');
  };

  return mount;
}
