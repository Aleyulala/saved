import React, { useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'saved_post_rx_v1';
const EMOJIS = ['👍', '❤️', '🔥', '🚀', '🎉', '😂'];

function readMap(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') || {};
  } catch {
    return {};
  }
}

interface PostReactionsProps {
  /** Yazıyı ayırt eden anahtar (bağlantı id'si) */
  postKey: string;
}

/**
 * Yazı altı tepki satırı (Blogger'daki yorum/yazı tepkisiyle aynı davranış):
 * tepki ekle düğmesi + emoji menüsü, seçilen tepki rozet olarak kalır.
 * Tepki yalnızca bu tarayıcıda saklanır.
 */
export const PostReactions: React.FC<PostReactionsProps> = ({ postKey }) => {
  const [current, setCurrent] = useState<string>('');
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Yazı değişince o yazının tepkisini oku, menüyü kapat
  useEffect(() => {
    setCurrent(readMap()[postKey] || '');
    setOpen(false);
  }, [postKey]);

  // Dışarı dokununca veya Esc ile menüyü kapat
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('touchstart', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('touchstart', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const choose = (emoji: string) => {
    const next = current === emoji ? '' : emoji;
    try {
      const map = readMap();
      if (next) map[postKey] = next;
      else delete map[postKey];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    } catch {
      /* depolama kapalıysa tepki yalnızca bu oturumda görünür */
    }
    setCurrent(next);
    setOpen(false);
  };

  return (
    <div ref={wrapRef} className="relative flex items-center gap-1.5 pt-1 select-none" data-post-reactions>
      {current && (
        <button
          type="button"
          onClick={() => choose(current)}
          title="Tepkiyi kaldır"
          aria-label="Tepkiyi kaldır"
          className="h-[34px] px-2.5 inline-flex items-center gap-1.5 rounded-[10px] border border-[var(--linkC,#60cdff)] bg-[rgba(96,205,255,0.12)] hover:bg-[rgba(96,205,255,0.22)] text-[#fffdfc] cursor-pointer"
        >
          <span className="text-[15px] leading-none">{current}</span>
          <span className="text-[12px] font-bold leading-none text-[var(--linkC,#60cdff)]">1</span>
        </button>
      )}

      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        title="Tepki Ekle"
        aria-label="Tepki Ekle"
        aria-expanded={open}
        className="w-[34px] h-[34px] inline-flex items-center justify-center rounded-[10px] border border-[#3c4043] bg-[#28292c] hover:bg-[#35363a] text-[#e8eaed] cursor-pointer transition-colors"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M8.5 14s1.2 2 3.5 2 3.5-2 3.5-2" />
          <path d="M9 9.5h.01M15 9.5h.01" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 bottom-[calc(100%+6px)] z-20 flex items-center gap-1 px-1.5 py-1 rounded-[10px] bg-[#202124] border border-[#3c4043] shadow-[0_8px_24px_rgba(0,0,0,0.45)] animate-in fade-in duration-150">
          {EMOJIS.map(em => (
            <button
              key={em}
              type="button"
              onClick={() => choose(em)}
              aria-label={`Tepki: ${em}`}
              className={`px-1.5 py-1 rounded-[10px] text-[17px] leading-none cursor-pointer hover:bg-white/10 hover:scale-110 transition ${current === em ? 'bg-[#35363a]' : ''}`}
            >
              {em}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
