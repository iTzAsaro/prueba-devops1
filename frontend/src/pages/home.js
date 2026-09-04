// ============================================================
// VI CITY — Home Page
// ============================================================
import { renderHero } from '../components/hero.js';
import { renderEditions } from '../components/editions.js';
import { renderGallery } from '../components/gallery.js';
import { renderSysReq } from '../components/sysreq.js';

export function homePage(root) {
  const cleanups = [];
  [renderHero(), renderEditions(), renderGallery(), renderSysReq()].forEach(m => {
    const r = m(root);
    if (typeof r === 'function') cleanups.push(r);
  });
  return () => cleanups.forEach(c => c());
}
