import React, { useEffect, useRef, useCallback } from 'react';
import { MediaItem } from './UniversalMediaModal';
import { BrandLogoCard } from './BrandLogoCard';
import { getFaviconUrl } from '../utils/favicon';

interface PostMediaSliderProps {
  items: MediaItem[];
  index: number;
  onIndexChange: (i: number) => void;
  title: string;
  onOpenMedia?: (items: MediaItem[], initialIndex?: number, opts?: { floating?: boolean }) => void;
  /** Verilirse ilk slayt marka kartıdır; basınca siteye gider */
  brand?: { url: string; title: string };
}

/** YouTube gömme/şort adresinden video kimliği */
const ytId = (url: string): string => {
  const m = url.match(/(?:embed\/|shorts\/|v=|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
  return m ? m[1] : '';
};

const thumbOf = (it: MediaItem): string => {
  if (it.thumbnail) return it.thumbnail;
  if (it.type === 'image') return it.url;
  const id = ytId(it.url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '';
};

/**
 * Blogger .post-media-slider 1:1: kaydırmalı slayt, ok düğmeleri, noktalar, tam ekran ve kayan pencere
 * düğmeleri; altında hikaye (story) şeridi — her küçük resim bir medya, aktif olan çerçeveli.
 */
export const PostMediaSlider: React.FC<PostMediaSliderProps> = ({ items, index, onIndexChange, title, onOpenMedia, brand }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const trayRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const off = brand ? 1 : 0; // marka slaydı varsa medya indeksleri 1 kayar
  const total = items.length + off;
  const openAt = (i: number, floating?: boolean) => onOpenMedia && i >= off && onOpenMedia(items, i - off, floating ? { floating: true } : undefined);

  const goTo = useCallback((i: number) => {
    const t = trackRef.current;
    const c = Math.max(0, Math.min(total - 1, i));
    if (t) t.scrollTo({ left: c * t.clientWidth, behavior: 'smooth' });
    onIndexChange(c);
  }, [total, onIndexChange]);

  // Dışarıdan indeks değişince (ör. yeni gönderi) izi hizala
  useEffect(() => {
    const t = trackRef.current;
    if (t && Math.round(t.scrollLeft / (t.clientWidth || 1)) !== index) {
      t.scrollTo({ left: index * t.clientWidth, behavior: 'auto' });
    }
  }, [index, total]);

  // Aktif hikaye küçük resmini görünür tut
  useEffect(() => {
    const tray = trayRef.current;
    const el = tray?.children[index] as HTMLElement | undefined;
    if (tray && el) {
      tray.scrollTo({ left: el.offsetLeft - (tray.clientWidth - el.offsetWidth) / 2, behavior: 'smooth' });
    }
  }, [index]);

  const onScroll = () => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const t = trackRef.current;
      if (!t) return;
      const i = Math.max(0, Math.min(total - 1, Math.round(t.scrollLeft / (t.clientWidth || 1))));
      if (i !== index) onIndexChange(i);
    });
  };

  const cur = index >= off ? items[index - off] : undefined;
  const iconBtn = 'w-8 h-8 rounded-[10px] bg-[#282828] hover:bg-[#333333] text-white border-0 flex items-center justify-center cursor-pointer shadow-md active:scale-95 transition-all';

  return (
    <div className="post-media-slider space-y-2.5">
      {/* Hikaye şeridi (.insta-stories-tray) */}
      {total >= 2 && (
        <div ref={trayRef} className="insta-stories-tray flex items-center [justify-content:safe_center] gap-2.5 overflow-x-auto px-[4px] py-[4px] [scroll-padding-inline:4px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="tablist" aria-label="Hikaye Listesi">
          {brand && (
            <button
              type="button"
              role="tab"
              aria-selected={index === 0}
              aria-label={brand.title}
              title={brand.title}
              onClick={() => goTo(0)}
              className={`insta-story-item shrink-0 w-[104px] h-[58px] p-0 border-0 bg-transparent cursor-pointer transition-all hover:-translate-y-0.5 active:scale-95 ${index === 0 ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
            >
              <span className={`relative block w-full h-full rounded-lg ${index === 0 ? 'shadow-[0_0_0_2px_var(--linkC,#9aa0a6)]' : ''}`}>
                <span className="relative flex items-center justify-center w-full h-full rounded-lg overflow-hidden bg-[#1c1e26]">
                  <img src={getFaviconUrl(brand.url)} alt="" draggable={false} className="w-7 h-7 rounded-md" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                </span>
              </span>
            </button>
          )}
          {items.map((it, k) => {
            const i = k + off;
            const thumb = thumbOf(it);
            const active = i === index;
            return (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={it.title || `İçerik ${i + 1}`}
                title={it.title || `İçerik ${i + 1}`}
                onClick={() => (active ? openAt(i) : goTo(i))}
                className={`insta-story-item shrink-0 w-[104px] h-[58px] p-0 border-0 bg-transparent cursor-pointer transition-all hover:-translate-y-0.5 active:scale-95 ${active ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
              >
                <span className={`relative block w-full h-full rounded-lg ${active ? 'shadow-[0_0_0_2px_var(--linkC,#9aa0a6)]' : ''}`}>
                  <span className="relative block w-full h-full rounded-lg overflow-hidden bg-[#282828]">
                    {thumb && <img src={thumb} alt="" draggable={false} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />}
                    <span className="absolute inset-0 flex items-center justify-center bg-black/[0.16]">
                      {it.type === 'image' ? (
                        <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] drop-shadow" fill="none" stroke="#fff" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" fill="#fff" /><polyline points="21 15 16 10 5 21" /></svg>
                      ) : (
                        <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] drop-shadow" fill="#fff"><polygon points="8,5 19,12 8,19" /></svg>
                      )}
                    </span>
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      )}

      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-[16px] overflow-hidden bg-[#18181b] border border-white/5 shadow-2xl">
        <div
          ref={trackRef}
          onScroll={onScroll}
          className="flex w-full h-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ overscrollBehaviorX: 'contain' }}
        >
          {brand && (
            <div className="relative w-full h-full shrink-0 snap-center bg-black">
              <a href={brand.url} target="_blank" rel="noopener noreferrer" title={`${brand.title || brand.url} Sitesine Git`} className="block w-full h-full no-underline active:scale-[0.99] transition-transform">
                <BrandLogoCard url={brand.url} title={brand.title} size="detail" />
              </a>
            </div>
          )}
          {items.map((it, k) => {
            const i = k + off;
            const isActive = i === index;
            const thumb = thumbOf(it);
            return (
              <div key={i} className="relative w-full h-full shrink-0 snap-center bg-black">
                {it.type === 'image' ? (
                  <img
                    src={it.url}
                    alt={it.title || title}
                    referrerPolicy="no-referrer"
                    draggable={false}
                    className="w-full h-full object-cover object-center cursor-pointer"
                    onClick={() => openAt(i)}
                    onError={(e) => {
                      const t = e.currentTarget;
                      if (t.src.includes('maxresdefault.jpg')) t.src = t.src.replace('maxresdefault.jpg', 'hqdefault.jpg');
                    }}
                  />
                ) : isActive ? (
                  it.type === 'video' ? (
                    <video src={it.url} controls className="w-full h-full object-contain bg-black" />
                  ) : (
                    <iframe
                      src={it.url}
                      title={it.title || title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  )
                ) : (
                  <button type="button" onClick={() => goTo(i)} className="relative w-full h-full block cursor-pointer border-0 p-0 bg-black" aria-label={it.title || 'Videoyu aç'}>
                    {thumb && <img src={thumb} alt="" className="w-full h-full object-cover" draggable={false} />}
                    <span className="absolute inset-0 flex items-center justify-center bg-black/25">
                      <svg viewBox="0 0 24 24" className="w-12 h-12 drop-shadow-lg" fill="#fff"><polygon points="8,5 19,12 8,19" /></svg>
                    </span>
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Sağ üst: kayan pencere + tam ekran */}
        {onOpenMedia && cur && (
          <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
            <button type="button" className={iconBtn} title="Tam Ekran" aria-label="Tam Ekran" onClick={(e) => { e.stopPropagation(); openAt(index); }}>
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
            </button>
          </div>
        )}

      </div>

      {/* Slayt göstergesi: Blogger .car-nav gibi altta kısa çizgiler (ok düğmesi yok) */}
      {total >= 2 && (
        <div className="flex items-center justify-center gap-2 pt-1" role="tablist" aria-label="Slayt göstergesi">
          {Array.from({ length: total }, (_, d) => (
            <button
              key={d}
              type="button"
              role="tab"
              aria-selected={d === index}
              aria-label={`${d + 1}. medya`}
              onClick={() => goTo(d)}
              className={`h-[5px] rounded-full border-0 p-0 cursor-pointer transition-all duration-200 ${d === index ? 'w-6 bg-[var(--linkC,#9aa0a6)]' : 'w-3.5 bg-white/25 hover:bg-white/45'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
