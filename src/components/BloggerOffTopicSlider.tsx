import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CollectionItem, LinkItem } from '../types';
import { formatBlogDate } from '../utils/favicon';
import { BrandLogoCard } from './BrandLogoCard';

interface BloggerOffTopicSliderProps {
  collection: CollectionItem;
  links: LinkItem[];
  onViewAll: () => void;
  onOpenPostPage: (link: LinkItem) => void;
}

const MAX_DOTS = 6;

/**
 * Blogger "Konu dışı" slaytı: başlık + "Tümünü göster" düğmesi, yatay kaydırılan
 * gönderi kartları (yan kart yarım görünür) ve altında nokta göstergesi.
 */
export const BloggerOffTopicSlider: React.FC<BloggerOffTopicSliderProps> = ({
  collection,
  links,
  onViewAll,
  onOpenPostPage
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [activePage, setActivePage] = useState(0);

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < maxScroll - 4);

    if (maxScroll <= 4) {
      setPageCount(1);
      setActivePage(0);
      return;
    }
    const pages = Math.min(MAX_DOTS, Math.max(2, Math.ceil(el.scrollWidth / el.clientWidth)));
    setPageCount(pages);
    setActivePage(Math.round((el.scrollLeft / maxScroll) * (pages - 1)));
  }, []);

  useEffect(() => {
    update();
    const el = trackRef.current;
    if (!el) return;
    window.addEventListener('resize', update);
    let observer: ResizeObserver | undefined;
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(update);
      observer.observe(el);
    }
    return () => {
      window.removeEventListener('resize', update);
      observer?.disconnect();
    };
  }, [update, links.length]);

  const goToPage = (page: number) => {
    const el = trackRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const ratio = pageCount > 1 ? page / (pageCount - 1) : 0;
    el.scrollTo({ left: maxScroll * ratio, behavior: 'smooth' });
  };

  if (links.length === 0) return null;

  // Kaydırılabilir kenarlarda kartlar yumuşakça solar (Blogger .sldW kenar maskesi)
  const left = canScrollLeft ? 'transparent 0, #000 28px' : '#000 0, #000 0';
  const right = canScrollRight ? '#000 calc(100% - 28px), transparent 100%' : '#000 100%, #000 100%';
  const mask = `linear-gradient(to right, ${left}, ${right})`;

  return (
    <section aria-label={collection.name} className="space-y-5 pt-2">
      <div className="flex items-center justify-between gap-3 mb-9">
        <h2 className="text-[20px] font-bold text-white tracking-tight">{collection.name}</h2>
        <button
          type="button"
          onClick={onViewAll}
          className="shrink-0 h-7 px-[15px] rounded-[12px] bg-[#56595e] hover:bg-[#62666b] text-[#fdfdfd] text-[12px] font-normal leading-none transition-colors cursor-pointer"
        >
          Tümünü göster
        </button>
      </div>

      <div
        ref={trackRef}
        onScroll={update}
        className="flex gap-[17px] overflow-x-auto snap-x snap-mandatory hide-scrollbar scroll-smooth"
        style={{ WebkitMaskImage: mask, maskImage: mask }}
      >
        {links.map((link) => (
          <article
            key={link.id}
            onClick={() => onOpenPostPage(link)}
            className="group snap-start shrink-0 basis-[58%] min-w-[240px] sm:basis-[calc((100%-34px)/3)] flex flex-col gap-2.5 cursor-pointer select-none"
          >
            <div className="relative w-full aspect-[16/9] rounded-[12px] bg-[#1e1e1e] overflow-hidden">
              {link.thumbnail ? (
                <img
                  src={link.thumbnail}
                  alt={link.title}
                  className="w-full h-full object-cover thmb-zoom"
                  loading="lazy"
                />
              ) : (
                <BrandLogoCard url={link.url} title={link.title} size="card" />
              )}
            </div>

            <div className="text-[13px] text-[var(--linkC,#9aa0a6)] lowercase font-medium truncate">
              {link.tags[0] || collection.name.toLowerCase()}
            </div>

            <h3 className="text-lg font-bold text-white group-hover:text-[var(--linkC,#9aa0a6)] leading-snug transition-colors line-clamp-2">
              {link.title}
            </h3>

            {link.description && (
              <p className="text-[14px] text-[#989b9f] leading-[21px] line-clamp-2">
                {link.description}
              </p>
            )}

            <div className="mt-auto pt-2 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#3f7d4e] text-white font-semibold">
                  Yayınlandı!
                </span>
                <span className="text-[11px] text-[#989b9f]">{formatBlogDate(link.createdAt, true)}</span>
              </div>
              <span className="text-xs text-[#989b9f] group-hover:text-[var(--linkC,#9aa0a6)] group-hover:underline font-medium">
                Daha
              </span>
            </div>
          </article>
        ))}
      </div>

      {pageCount > 1 && (
        <div className="flex items-center justify-center gap-1.5 pt-1" role="tablist" aria-label="Slayt göstergesi">
          {Array.from({ length: pageCount }, (_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === activePage}
              aria-label={`Slayt ${i + 1}`}
              onClick={() => goToPage(i)}
              className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                i === activePage ? 'w-6 bg-white/80' : 'w-3.5 bg-white/20 hover:bg-white/35'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
};
