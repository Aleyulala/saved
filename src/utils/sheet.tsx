import { useCallback, useRef } from 'react';

/* Yeni nesil bağlam menüsü (Blogger şablonları ve Class ile aynı):
   telefonda menüler ekranın altından açılır; tutamaçtan ya da başlıktan aşağı çekince kapanır,
   az çekilirse yerine döner. Bilgisayarda menüler eskisi gibi kalır. */
const MQ = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(max-width: 896px)') : null;
export const isPhone = () => !!MQ?.matches;

type SheetEl = HTMLElement & { __sheet?: boolean };

function bind(m: SheetEl, close: () => void) {
  if (m.__sheet) return;
  m.__sheet = true;
  let gone = 0;
  m.addEventListener('pointerdown', (e) => {
    const t = e.target as Element | null;
    if (!isPhone() || e.button > 0 || !t) return;
    if (!(t === m || t.closest('.cGrip, .popH, [data-drag]')) || t.closest('button:not(.cGrip), a, input')) return;
    const id = e.pointerId, y0 = e.clientY, t0 = performance.now(), h = m.offsetHeight || 1;
    let dy = 0, moved = false;
    try { m.setPointerCapture(id); } catch { /* yoksay */ }
    const mv = (v: PointerEvent) => {
      if (v.pointerId !== id) return;
      dy = Math.max(0, v.clientY - y0);
      if (!moved && dy > 4) { moved = true; m.style.transition = 'none'; m.style.animation = 'none'; }
      if (moved) { m.style.transform = `translateY(${dy}px)`; if (v.cancelable) v.preventDefault(); }
    };
    const up = (v: PointerEvent) => {
      if (v.pointerId !== id) return;
      m.removeEventListener('pointermove', mv); m.removeEventListener('pointerup', up); m.removeEventListener('pointercancel', up);
      if (!moved) return;
      gone = Date.now();
      const fast = dy / Math.max(1, performance.now() - t0) > 0.5 && dy > 30;
      m.style.transition = 'transform .22s cubic-bezier(.2,.8,.2,1)';
      if (v.type === 'pointerup' && (dy > Math.min(140, h * 0.25) || fast)) {
        m.style.transform = 'translateY(105%)';
        setTimeout(close, 180);
      } else m.style.transform = '';
    };
    m.addEventListener('pointermove', mv); m.addEventListener('pointerup', up); m.addEventListener('pointercancel', up);
  });
  /* sürüklemenin sonundaki tıklama bir seçeneği çalıştırmasın */
  m.addEventListener('click', (e) => { if (Date.now() - gone < 350) { e.preventDefault(); e.stopPropagation(); } }, true);
}

/** Açılır menünün kök öğesine verilir: telefonda sürükleyip kapatmayı bağlar. */
export function useSheet<T extends HTMLElement>(close: () => void) {
  const fn = useRef(close);
  fn.current = close;
  return useCallback((el: T | null) => { if (el) bind(el, () => fn.current()); }, []);
}

/** Alt sayfanın üstündeki tutamaç (yalnızca telefonda görünür). */
export const SheetGrip = () => (
  <div className="cGrip" aria-hidden="true"><span /></div>
);
