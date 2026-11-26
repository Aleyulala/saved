import React, { useEffect, useRef, useCallback, useState } from 'react';
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

const camIcon = (cls: string) => (
  <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2.5" y="5" width="15" height="14" rx="3" /><path d="M17.5 10l4-2.5v9l-4-2.5" /></svg>
);

/** Doğrudan video dosyası için ilk kareyi tuvale çizer; kartta oynatıcı (video öğesi) kalmaz */
const VideoFrame: React.FC<{ url: string }> = ({ url }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    let v: HTMLVideoElement | null = null;
    const end = () => { if (v) { v.removeAttribute('src'); try { v.load(); } catch { /* yok say */ } } };
    const go = () => {
      v = document.createElement('video');
      const draw = () => {
        try { c.width = v!.videoWidth || 640; c.height = v!.videoHeight || 360; c.getContext('2d')?.drawImage(v!, 0, 0, c.width, c.height); c.style.opacity = '1'; } catch { /* yok say */ }
        end();
      };
      v.muted = true; v.playsInline = true; v.preload = 'auto';
      v.addEventListener('loadeddata', () => { try { v!.currentTime = Math.min(1, (v!.duration || 4) / 4); } catch { draw(); } }, { once: true });
      v.addEventListener('seeked', draw, { once: true });
      v.addEventListener('error', end, { once: true });
      v.src = url;
    };
    if (!('IntersectionObserver' in window)) { go(); return end; }
    const io = new IntersectionObserver((en) => { if (en[0].isIntersecting) { io.disconnect(); go(); } }, { rootMargin: '200px' });
    io.observe(c);
    return () => { io.disconnect(); end(); };
  }, [url]);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300" aria-hidden="true" />;
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
  // Tam ekran / kayan oynatıcıda çalan medya (UniversalMediaModal bildirir): kartında "Oynatılıyor"
  const [nowUrl, setNowUrl] = useState<string | null>(null);
  useEffect(() => {
    const on = (e: Event) => setNowUrl((e as CustomEvent<string | null>).detail || null);
    window.addEventListener('saved-now', on);
    return () => window.removeEventListener('saved-now', on);
  }, []);
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
                <span className={`relative block w-full h-full rounded-lg ${active || (nowUrl && it.url === nowUrl) ? 'shadow-[0_0_0_2px_var(--linkC,#9aa0a6)]' : ''}`}>
                  <span className="relative block w-full h-full rounded-lg overflow-hidden bg-[#282828]">
                    {thumb && <img src={thumb} alt="" draggable={false} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />}
                    <span className="absolute inset-0 flex items-center justify-center bg-black/[0.16]">
                      {it.type === 'image' ? (
                        <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] drop-shadow" fill="none" stroke="#fff" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" fill="#fff" /><polyline points="21 15 16 10 5 21" /></svg>
                      ) : (
                        camIcon('w-[18px] h-[18px] text-white drop-shadow')
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
                ) : (
                  <button
                    type="button"
                    onClick={() => (isActive ? openAt(i) : goTo(i))}
                    className="saved-poster group relative w-full h-full block cursor-pointer border-0 p-0 overflow-hidden text-white"
                    aria-label={`Tam ekranda aç: ${it.title || 'Video'}`}
                    title="Tam ekranda aç"
                  >
                    <span className="absolute inset-0 flex items-center justify-center opacity-30">{camIcon('w-16 h-16')}</span>
                    {thumb ? (
                      <img src={thumb} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" draggable={false} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    ) : it.type === 'video' ? (
                      <VideoFrame url={it.url} />
                    ) : null}
                    <span className="absolute left-2.5 bottom-2.5 max-w-[calc(100%-20px)] inline-flex items-center gap-1.5 pl-2 pr-2.5 py-1.5 rounded-[10px] bg-[rgba(10,12,18,0.72)] backdrop-blur-md border border-white/15 text-[13px] pointer-events-none">
                      {camIcon('w-4 h-4 shrink-0 text-[var(--linkC,#9aa0a6)]')}
                      <b className="font-semibold truncate">{it.title || (it.type === 'shorts' ? 'Shorts' : 'Video')}</b>
                    </span>
                    {nowUrl === it.url && (
                      <span className="saved-now absolute inset-0 flex items-center justify-center gap-1 bg-black/60 backdrop-blur-[2px] pointer-events-none">
                        <i /><i /><i /><b className="ml-2 font-bold text-sm">Oynatılıyor</b>
                      </span>
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Sağ üst: video → kayan pencerede izle; görsel → tam ekran (karta dokunmak da tam ekran açar) */}
        {onOpenMedia && cur && (
          <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
            {cur.type === 'image' ? (
              <button type="button" className={iconBtn} title="Tam Ekran" aria-label="Tam Ekran" onClick={(e) => { e.stopPropagation(); openAt(index); }}>
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
              </button>
            ) : (
              <button type="button" className={iconBtn} title="Kayan pencerede izle" aria-label="Kayan pencerede izle" onClick={(e) => { e.stopPropagation(); openAt(index, true); }}>
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="3" /><rect x="11.5" y="11.5" width="7.5" height="5.5" rx="1.5" /></svg>
              </button>
            )}
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
