// ============================================================
// VI CITY — Editions Section (comparativa interactiva)
// ============================================================
import { EDITIONS } from '../data/catalog.js';
import { formatCLP } from '../data/catalog.js';
import { getState, updateSelection } from '../store/index.js';
import { toast } from '../utils/ui.js';
import { navigate } from '../router.js';

export function renderEditions() {
  const html = `
    <section class="section" id="ediciones">
      <div class="container">
        <h2 class="section-title">Elige tu <span class="accent">edición</span></h2>
        <p class="section-sub">Comparativa de bonus exclusivos de reserva. Formato físico o digital.</p>

        <div class="flex between center mb" style="flex-wrap:wrap;gap:14px">
          <div class="format-toggle" id="format-toggle">
            <button data-fmt="digital" class="active">Digital</button>
            <button data-fmt="physical">Físico</button>
          </div>
          <span class="text-muted" style="font-size:.86rem">Collector's solo disponible en formato físico</span>
        </div>

        <div class="editions" id="editions-grid"></div>
      </div>
    </section>`;

  const mount = (root) => {
    root.insertAdjacentHTML('beforeend', html);
    const grid = root.querySelector('#editions-grid');
    const toggle = root.querySelector('#format-toggle');

    function paint() {
      const { format, editionId } = getState().selection;
      toggle.querySelectorAll('button').forEach(b => b.classList.toggle('active', b.dataset.fmt === format));

      grid.innerHTML = EDITIONS.map(ed => {
        const isPhysical = format === 'physical';
        const price = isPhysical ? ed.pricePhysical : ed.priceDigital;
        const disabled = ed.physicalOnly && !isPhysical;
        const selected = editionId === ed.id;
        return `
          <div class="edition ${ed.featured ? 'edition--featured' : ''} ${selected ? 'card--glow' : ''}" data-edition="${ed.id}">
            <span class="badge badge-${ed.color}">${ed.physicalOnly ? 'Físico exclusivo' : isPhysical ? 'Físico' : 'Digital'}</span>
            <h3 class="edition__name" style="margin-top:10px">${ed.name}</h3>
            <p class="edition__tagline">${ed.tagline}</p>
            <div class="edition__price">${disabled ? '<small>Solo físico</small>' : formatCLP(price)}</div>
            <ul class="edition__list">
              ${ed.bonuses.map((b, i) => `<li class="${i > 0 ? 'exclusive' : ''}">${b}</li>`).join('')}
            </ul>
            <div class="edition__actions">
              <button class="btn ${selected ? 'btn-primary' : 'btn-dark'} btn-block" data-select="${ed.id}" ${disabled ? 'disabled' : ''}>
                ${selected ? '✓ Seleccionada' : 'Seleccionar'}
              </button>
            </div>
          </div>`;
      }).join('');

      grid.querySelectorAll('[data-select]').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.select;
          updateSelection({ editionId: id });
          const ed = EDITIONS.find(e => e.id === id);
          toast(`Edición seleccionada: ${ed.name}`, 'ok');
          paint();
        });
      });
    }

    toggle.querySelectorAll('button').forEach(b => {
      b.addEventListener('click', () => {
        const fmt = b.dataset.fmt;
        const { editionId } = getState().selection;
        const ed = EDITIONS.find(e => e.id === editionId);
        if (ed?.physicalOnly && fmt === 'digital') {
          toast('Esta edición solo está disponible en formato físico. Cambiando a Deluxe.', 'warn');
          updateSelection({ format: 'digital', editionId: 'deluxe' });
        } else {
          updateSelection({ format: fmt });
        }
        paint();
      });
    });

    paint();
  };

  return mount;
}
