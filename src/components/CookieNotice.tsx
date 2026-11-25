import React, { useEffect, useState } from 'react';
import { FullscreenModal } from './FullscreenModal';

const KEY = 'saved_cookie_ok_v1';

interface CookieNoticeProps {
  /** "Çerez Politikası" bağlantısına basınca gösterilecek sayfayı açar */
  onOpenPolicy?: () => void;
}

/**
 * Çerez politikası: Blogger şablonundaki gibi tam ekran, yazılar üstte, "Tamam, anladım." düğmesi
 * metnin yanında, altta #Çerez çubuğu ve kapat düğmesi. Kapat / Esc / Tamam hepsi onay sayılır.
 * Tab ve Shift+Tab pencerenin içinde döner, açılışta odak "Tamam, anladım." düğmesindedir.
 */
export const CookieNotice: React.FC<CookieNoticeProps> = ({ onOpenPolicy }) => {
  const [open, setOpen] = useState<boolean>(() => {
    try { return localStorage.getItem(KEY) !== '1'; } catch { return true; }
  });

  const accept = () => {
    try { localStorage.setItem(KEY, '1'); } catch { /* yok say */ }
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const root = () => document.getElementById('cookieNotice');
    const t = window.setTimeout(() => {
      root()?.querySelector<HTMLButtonElement>('[data-cookie-accept]')?.focus({ preventScroll: true });
    }, 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const el = root();
      if (!el) return;
      const list = Array.from(el.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'));
      if (!list.length) return;
      const i = list.indexOf(document.activeElement as HTMLElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); list[list.length - 1].focus(); }
      else if (!e.shiftKey && (i < 0 || i === list.length - 1)) { e.preventDefault(); list[0].focus(); }
    };
    window.addEventListener('keydown', onKey);
    return () => { window.clearTimeout(t); window.removeEventListener('keydown', onKey); };
  }, [open]);

  if (!open) return null;

  return (
    <FullscreenModal id="cookieNotice" title="#Çerez" ariaLabel="Çerez Politikası" maxWidth="max-w-[520px]" onClose={accept}>
      <h2 className="text-lg font-bold text-white px-1 pb-3">Çerez Politikası</h2>
      <p className="px-1 text-[15px] leading-[1.8] text-[#d4d4d4]">
        Tercihlerinizi hatırlamak ve sitemizi kullanma deneyiminizi iyileştirmek için tarayıcınızda yerel depolama ve çerezler kullanıyoruz; buna Google Çeviri dil tercihi de dahildir.
        <button
          type="button"
          data-cookie-accept
          onClick={accept}
          className="inline-flex items-center h-[34px] px-3.5 ml-2 align-middle rounded-[10px] bg-[#1a73e8] hover:bg-[#1666d0] text-white text-sm font-semibold border-0 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--linkC,#60cdff)] focus-visible:outline-offset-2"
        >
          Tamam, anladım.
        </button>
      </p>
      {onOpenPolicy && (
        <a
          href="?view=privacy"
          onClick={(e) => { e.preventDefault(); setOpen(false); onOpenPolicy(); }}
          className="inline-flex items-center gap-1.5 mt-4 px-1 text-sm font-semibold text-[var(--linkC,#60cdff)] no-underline hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--linkC,#60cdff)] focus-visible:outline-offset-2 rounded"
        >
          Çerez Politikası <span className="text-lg leading-none">›</span>
        </a>
      )}
    </FullscreenModal>
  );
};
