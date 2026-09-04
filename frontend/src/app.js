// ============================================================
// VI CITY — App entrypoint
// ============================================================
import { initRouter, register, navigate } from './router.js';
import { mountNavbar } from './components/navbar.js';
import { homePage } from './pages/home.js';
import { customizerPage } from './pages/customizer.js';
import { checkoutPage } from './pages/checkout.js';
import { successPage } from './pages/success.js';
import { dashboardPage } from './pages/dashboard.js';

mountNavbar();

register('/', homePage);
register('/customizer', customizerPage);
register('/checkout', checkoutPage);
register('/success', successPage);
register('/dashboard', dashboardPage);
register('/404', (root) => {
  root.innerHTML = `<div class="empty"><div class="empty__icon">🛸</div><h2>404</h2><p>Página no encontrada.</p><button class="btn btn-primary mt" id="back404">Volver al inicio</button></div>`;
  root.querySelector('#back404').onclick = () => navigate('/');
});

initRouter();
