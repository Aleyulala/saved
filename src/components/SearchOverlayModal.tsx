import React, { useState, useEffect, useRef } from 'react';
import { SearchNormalIcon, CloseIcon, RankingIcon } from './BloggerIcons';
import { LinkItem } from '../types';
import { db } from '../db';
import { getFaviconUrl } from '../utils/favicon';

interface SearchOverlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLink?: (link: LinkItem) => void;
  onApplySearchQuery?: (query: string) => void;
  initialQuery?: string;
}

/* nsone.xml 35760-35781 1:1 — Arama Motorları & Siteler */
const SEARCH_ENGINES = [
  { name: 'Sayfada', url: 'blog' },
  { name: 'Google AI', url: 'https://www.google.com/search?udm=50&q=' },
  { name: 'Google', url: 'https://www.google.com/search?q=' },
  { name: 'Google Çeviri', url: 'https://translate.google.com/?sl=auto&tl=tr&text=' },
  { name: 'DeepL', url: 'https://www.deepl.com/translator#auto/tr/' },
  { name: 'Yandex Çeviri', url: 'https://translate.yandex.com/?source_lang=auto&target_lang=tr&text=' },
  { name: 'YouTube Music', url: 'https://music.youtube.com/search?q=' },
  { name: 'Google Kaynak', url: 'https://www.google.com/preferences/source?q=' },
  { name: 'YouTube', url: 'https://www.youtube.com/results?search_query=' },
  { name: 'GitHub', url: 'https://github.com/search?q=' },
  { name: 'Hacker News', url: 'https://news.ycombinator.com/' },
  { name: 'Y Combinator', url: 'https://www.ycombinator.com/companies?query=' },
  { name: 'YouTube', url: 'https://www.youtube.com/results?search_query=' },
  { name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=' },
  { name: 'Perplexity', url: 'https://www.perplexity.ai/search?q=' },
  { name: 'Yandex', url: 'https://yandex.com/search/?text=' },
  { name: 'Archive', url: 'https://archive.org/search?query=' },
  { name: 'Google Hız Testi', url: 'https://pagespeed.web.dev/analysis?url=' },
  { name: 'Google Zengin Arama', url: 'https://search.google.com/test/rich-results?url=' },
  { name: 'Hakaret Mi?', url: 'https://hakaretmi.com/?s=' },
];

/* nsone.xml / negron-v3.xml 1:1 — Hızlı Motor Hap Butonları (19 Motor) */
const SEARCH_PILLS = [
  { name: 'Sayfada', url: 'blog' },
  { name: 'Google AI', url: 'https://www.google.com/search?udm=50&q=' },
  { name: 'Google', url: 'https://www.google.com/search?q=' },
  { name: 'Google Çeviri', url: 'https://translate.google.com/?sl=auto&tl=tr&text=' },
  { name: 'DeepL', url: 'https://www.deepl.com/translator#auto/tr/' },
  { name: 'Yandex Çeviri', url: 'https://translate.yandex.com/?source_lang=auto&target_lang=tr&text=' },
  { name: 'YT Music', url: 'https://music.youtube.com/search?q=' },
  { name: 'Google Kaynak', url: 'https://www.google.com/preferences/source?q=' },
  { name: 'GitHub', url: 'https://github.com/search?q=' },
  { name: 'Hacker News', url: 'https://news.ycombinator.com/' },
  { name: 'Y Combinator', url: 'https://www.ycombinator.com/companies?query=' },
  { name: 'YouTube', url: 'https://www.youtube.com/results?search_query=' },
  { name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=' },
  { name: 'Perplexity', url: 'https://www.perplexity.ai/search?q=' },
  { name: 'Yandex', url: 'https://yandex.com/search/?text=' },
  { name: 'Archive', url: 'https://archive.org/search?query=' },
  { name: 'Google Hız Testi', url: 'https://pagespeed.web.dev/analysis?url=' },
  { name: 'Google Zengin Arama', url: 'https://search.google.com/test/rich-results?url=' },
  { name: 'Hakaret Mi?', url: 'https://hakaretmi.com/?s=' },
];

/* nsone.xml 36076-36086 1:1 — Varsayılan Kısayol Çipleri (.adv-banner-chip) */
const BANNER_CHIPS: { prefix: string; label: string; title: string }[] = [
  { prefix: 'tr ', label: 'tr', title: 'Google Çeviri' },
  { prefix: 'deepl ', label: 'deepl', title: 'DeepL Çeviri' },
  { prefix: 'ytr ', label: 'ytr', title: 'Yandex Çeviri' },
  { prefix: 'ytm ', label: 'ytm', title: 'YouTube Music üzerinde ara' },
  { prefix: 'kaynak ', label: 'kaynak', title: 'Google Kaynak Tercihleri' },
  { prefix: 'yt ', label: 'yt', title: 'YouTube üzerinde ara' },
  { prefix: 'gh ', label: 'gh', title: 'GitHub üzerinde ara' },
  { prefix: 'wiki ', label: 'wiki', title: 'Wikipedia üzerinde ara' },
  { prefix: 'ps ', label: 'ps', title: 'PageSpeed hız testi' },
  { prefix: '@', label: '@kategori', title: 'Kategoriye göre ara' },
];

/* nsone.xml 35930-35967 1:1 — Kısayol Haritası (SHORTCUTS) */
const SHORTCUTS: Record<string, { label: string; url: string }> = {
  blog: { label: 'Sayfada', url: 'blog' },
  saved: { label: 'Sayfada', url: 'blog' },
  b: { label: 'Sayfada', url: 'blog' },
  ytm: { label: 'YouTube Music', url: 'https://music.youtube.com/search?q=' },
  music: { label: 'YouTube Music', url: 'https://music.youtube.com/search?q=' },
  ytmusic: { label: 'YouTube Music', url: 'https://music.youtube.com/search?q=' },
  kaynak: { label: 'Google Kaynak', url: 'https://www.google.com/preferences/source?q=' },
  source: { label: 'Google Kaynak', url: 'https://www.google.com/preferences/source?q=' },
  gsrc: { label: 'Google Kaynak', url: 'https://www.google.com/preferences/source?q=' },
  tr: { label: 'Google Çeviri', url: 'https://translate.google.com/?sl=auto&tl=tr&text=' },
  ceviri: { label: 'Google Çeviri', url: 'https://translate.google.com/?sl=auto&tl=tr&text=' },
  translate: { label: 'Google Çeviri', url: 'https://translate.google.com/?sl=auto&tl=tr&text=' },
  gt: { label: 'Google Çeviri', url: 'https://translate.google.com/?sl=auto&tl=tr&text=' },
  deepl: { label: 'DeepL', url: 'https://www.deepl.com/translator#auto/tr/' },
  dl: { label: 'DeepL', url: 'https://www.deepl.com/translator#auto/tr/' },
  ytr: { label: 'Yandex Çeviri', url: 'https://translate.yandex.com/?source_lang=auto&target_lang=tr&text=' },
  yandexceviri: { label: 'Yandex Çeviri', url: 'https://translate.yandex.com/?source_lang=auto&target_lang=tr&text=' },
  yt: { label: 'YouTube', url: 'https://www.youtube.com/results?search_query=' },
  youtube: { label: 'YouTube', url: 'https://www.youtube.com/results?search_query=' },
  gh: { label: 'GitHub', url: 'https://github.com/search?q=' },
  github: { label: 'GitHub', url: 'https://github.com/search?q=' },
  hn: { label: 'Hacker News', url: 'https://hn.algolia.com/?q=' },
  hackernews: { label: 'Hacker News', url: 'https://hn.algolia.com/?q=' },
  guilded: { label: 'Guilded', url: 'https://www.guilded.gg/explore?query=' },
  yc: { label: 'Y Combinator', url: 'https://www.ycombinator.com/companies?query=' },
  ycombinator: { label: 'Y Combinator', url: 'https://www.ycombinator.com/companies?query=' },
  wiki: { label: 'Wikipedia', url: 'https://tr.wikipedia.org/wiki/Özel:Ara?search=' },
  maps: { label: 'Google Haritalar', url: 'https://www.google.com/maps/search/' },
  ps: { label: 'Google Hız Testi', url: 'https://pagespeed.web.dev/analysis?url=' },
  pagespeed: { label: 'Google Hız Testi', url: 'https://pagespeed.web.dev/analysis?url=' },
  rich: { label: 'Google Zengin Sonuçlar', url: 'https://search.google.com/test/rich-results?url=' },
  amp: { label: 'Google AMP Testi', url: 'https://search.google.com/test/amp/result?url=' },
  hm: { label: 'Hakaret Mi?', url: 'https://hakaretmi.com/?s=' },
  hakaret: { label: 'Hakaret Mi?', url: 'https://hakaretmi.com/?s=' },
  g: { label: 'Google', url: 'https://www.google.com/search?q=' },
  ddg: { label: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=' },
};

/* nsone.xml 35969-35979 1:1 — Hesap Makinesi */
function calcMath(q: string): number | null {
  if (!/^[\d\s+\-*/().%]+$/.test(q)) return null;
  if (!/[+\-*/%]/.test(q)) return null;
  try {
    const fn = new Function('"use strict"; return (' + q + ')');
    const res = fn();
    return typeof res === 'number' && isFinite(res) ? res : null;
  } catch {
    return null;
  }
}

export const SearchOverlayModal: React.FC<SearchOverlayModalProps> = ({
  isOpen,
  onClose,
  onSelectLink,
  onApplySearchQuery,
  initialQuery = ''
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [selectedEngine, setSelectedEngine] = useState(() => {
    try {
      return localStorage.getItem('btt_adv_search_engine_v1') || 'blog';
    } catch {
      return 'blog';
    }
  });
  const [results, setResults] = useState<LinkItem[]>([]);
  const [isLatest, setIsLatest] = useState(false);
  const [collectionMap, setCollectionMap] = useState<Map<number, string>>(new Map());
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSelectEngine = (url: string) => {
    setSelectedEngine(url);
    try {
      localStorage.setItem('btt_adv_search_engine_v1', url);
    } catch {
      // ignore
    }
  };

  // Fare ile sağa-sola kaydırma (Mouse Drag & Wheel Horizontal Scroll — nsone.xml 37104-37156 1:1)
  const attachDragScroll = (el: HTMLDivElement | null) => {
    if (!el || (el as any)._hasDrag) return;
    (el as any)._hasDrag = true;

    // 1. Wheel ile yatay kaydırma
    el.addEventListener('wheel', (e) => {
      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (d !== 0) {
        e.preventDefault();
        el.scrollLeft += d * 0.9;
      }
    }, { passive: false });

    // 2. Fare ile basılı tutup sürükleme (Drag to scroll)
    let isDown = false;
    let startX = 0;
    let sLeft = 0;
    let hasDragged = false;

    el.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      isDown = true;
      hasDragged = false;
      startX = e.pageX;
      sLeft = el.scrollLeft;
      el.style.cursor = 'grabbing';
      el.style.userSelect = 'none';
    });

    const onMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      const dx = e.pageX - startX;
      if (Math.abs(dx) > 4) {
        hasDragged = true;
        el.scrollLeft = sLeft - dx * 1.35;
      }
    };

    const onMouseUp = () => {
      if (!isDown) return;
      isDown = false;
      el.style.cursor = 'grab';
      el.style.removeProperty('user-select');
      if (hasDragged) {
        const captureClick = (ev: MouseEvent) => {
          ev.preventDefault();
          ev.stopPropagation();
          window.removeEventListener('click', captureClick, true);
        };
        window.addEventListener('click', captureClick, true);
        setTimeout(() => window.removeEventListener('click', captureClick, true), 60);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  useEffect(() => {
    if (isOpen) {
      setQuery(initialQuery);
      setSelectedIndex(-1);
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);

      db.collections.toArray().then(cols => {
        const map = new Map<number, string>();
        cols.forEach(c => {
          if (c.id) map.set(c.id, c.name);
        });
        setCollectionMap(map);
      });
    }
  }, [isOpen, initialQuery]);

  /* nsone.xml 36206-36273 1:1 — Sayfada Çekmecesi (Son Eklenen / Eşleşen Bağlantılar) */
  useEffect(() => {
    let isMounted = true;
    const searchDb = async () => {
      if (selectedEngine !== 'blog') {
        if (isMounted) {
          setResults([]);
          setIsLatest(false);
        }
        return;
      }

      const raw = query.trim();
      const all = (await db.links.toArray()).filter(l => !l.isTrash);
      const cols = await db.collections.toArray();

      let matches: LinkItem[] = [];
      let latest = false;

      if (!raw) {
        matches = all
          .slice()
          .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
          .slice(0, 8);
        latest = true;
      } else if (raw.charAt(0) === '@') {
        const cat = raw.slice(1).trim().toLowerCase();
        const matchedColIds = cols
          .filter(c => c.name.toLowerCase().includes(cat))
          .map(c => c.id);
        matches = all.filter(l =>
          (l.collectionId && matchedColIds.includes(l.collectionId)) ||
          (l.tags && l.tags.some(t => t.toLowerCase().includes(cat)))
        ).slice(0, 8);
      } else {
        const q = raw.toLowerCase();
        matches = all.filter(l => {
          const tMatch = l.title.toLowerCase().includes(q);
          const uMatch = l.url.toLowerCase().includes(q);
          const cMatch = (l.tags || []).some(t => t.toLowerCase().includes(q));
          const colName = l.collectionId ? cols.find(c => c.id === l.collectionId)?.name || '' : '';
          return tMatch || uMatch || cMatch || colName.toLowerCase().includes(q);
        }).slice(0, 8);
      }

      if (isMounted) {
        setResults(matches);
        setIsLatest(latest);
        if (selectedIndex >= matches.length) setSelectedIndex(-1);
      }
    };
    searchDb();
    return () => { isMounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, selectedEngine, isOpen]);

  if (!isOpen) return null;

  const raw = query.trim();
  const math = calcMath(raw);
  const parts = raw.split(/\s+/);
  const prefix = (parts[0] || '').toLowerCase().replace(/:$/, '');
  const hasShortcut = !!SHORTCUTS[prefix] && raw.length > parts[0].length;
  const shortcutTarget = hasShortcut ? SHORTCUTS[prefix] : null;
  const shortcutPayload = hasShortcut ? raw.slice(parts[0].length).trim() : '';
  const isDirectUrl = /^(https?:\/\/|[\w-]+\.[a-z]{2,})(\/|$)/i.test(raw);
  const selectedResult = selectedIndex >= 0 ? results[selectedIndex] : null;
  const activeEngineName = SEARCH_ENGINES.find(e => e.url === selectedEngine)?.name || 'Arama Motoru';

  const getSubText = (item: { url: string; description?: string }) => {
    if (item.description && item.description.trim()) {
      return item.description.trim();
    }
    try {
      const u = new URL(item.url);
      const host = u.hostname.replace(/^www\./, '');
      const path = u.pathname + u.search + u.hash;
      return path && path !== '/' ? (host + path) : host;
    } catch {
      return item.url.replace(/^https?:\/\/(www\.)?/, '') || 'Bağlantı';
    }
  };

  const getPathText = (item: { url: string }) => {
    try {
      const u = new URL(item.url);
      const path = u.pathname + u.search + u.hash;
      return path && path !== '/' ? path : u.hostname.replace(/^www\./, '');
    } catch {
      return item.url;
    }
  };

  const executeSearch = (customEngineUrl?: string) => {
    if (!raw) return;

    // 1. Hesap Makinesi
    if (math !== null) {
      setQuery(`${raw} = ${math}`);
      return;
    }

    // 2. Kısayol
    if (hasShortcut && shortcutTarget && shortcutPayload) {
      if (shortcutTarget.url === 'blog') {
        if (onApplySearchQuery) onApplySearchQuery(shortcutPayload);
        onClose();
        return;
      }
      window.open(shortcutTarget.url + encodeURIComponent(shortcutPayload), '_blank', 'noopener,noreferrer');
      onClose();
      return;
    }

    // 3. Doğrudan Adres
    if (isDirectUrl) {
      const safeUrl = raw.startsWith('http') ? raw : `https://${raw}`;
      window.open(safeUrl, '_blank', 'noopener,noreferrer');
      onClose();
      return;
    }

    // 4. Seçili Motor
    const targetEngine = customEngineUrl || selectedEngine;
    if (targetEngine === 'blog') {
      if (onApplySearchQuery) onApplySearchQuery(raw);
      onClose();
      return;
    }
    window.open(targetEngine + encodeURIComponent(raw), '_blank', 'noopener,noreferrer');
    onClose();
  };

  const openResult = (link: LinkItem) => {
    if (onSelectLink) onSelectLink(link);
    else window.open(link.url, '_blank', 'noopener,noreferrer');
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
      return;
    }

    /* nsone.xml 36093-36108 1:1 — advNextResult / advPrevResult */
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedResult) {
        openResult(selectedResult);
        return;
      }
      executeSearch();
    }
  };

  /* nsone.xml 36166-36204 1:1 — Canlı Bilgi Şeridi (renderState) */
  let bannerKbd = 'Enter ↵';
  const bannerContent = (() => {
    if (math !== null) {
      return (
        <>
          <span className="text-[15px]">🧮</span>
          <span>Hesap Sonucu: <strong>{raw} = {math}</strong></span>
        </>
      );
    }
    if (hasShortcut && shortcutTarget) {
      return (
        <>
          <span className="text-[var(--linkC,#9aa0a6)] font-semibold">{shortcutTarget.label}:</span>
          <span>&ldquo;<strong>{shortcutPayload}</strong>&rdquo; üzerinde ara</span>
        </>
      );
    }
    if (isDirectUrl) {
      bannerKbd = 'Git (Enter ↵)';
      return (
        <>
          <span className="text-[14px]">🔗</span>
          <span>Doğrudan Web Sitesine Git: <strong>{raw}</strong></span>
        </>
      );
    }
    if (selectedResult) {
      bannerKbd = 'Aç (Enter ↵)';
      return (
        <>
          <span className="text-[13px]">🚀</span>
          <span>Bağlantıyı Aç: <strong>{selectedResult.title}</strong></span>
        </>
      );
    }
    if (selectedEngine !== 'blog') {
      bannerKbd = 'Ara (Enter ↵)';
      return (
        <>
          <span className="text-[var(--linkC,#9aa0a6)] font-semibold">{activeEngineName}:</span>
          <span>&ldquo;<strong>{raw || '...'}</strong>&rdquo; ara</span>
        </>
      );
    }
    if (!raw) {
      /* nsone.xml 36076-36086 1:1 — Varsayılan Kısayol Çipleri */
      return BANNER_CHIPS.map(chip => (
        <button
          key={chip.label}
          type="button"
          onClick={() => {
            setQuery(chip.prefix);
            inputRef.current?.focus();
          }}
          className="adv-banner-chip"
          title={chip.title}
        >
          {chip.label}
        </button>
      ));
    }
    return (
      <>
        <span className="text-[12.5px]">🔍</span>
        <span>&ldquo;<strong>{raw}</strong>&rdquo; için ara veya aşağıdan bağlantı seçin</span>
      </>
    );
  })();

  return (
    <div
      id="advSearchModal"
      className="is-open"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Kapat Butonu (.adv-close-btn) — negron-v3.xml 1:1 karemsi 32px */}
      <button
        onClick={onClose}
        className="adv-close-btn"
        aria-label="Aramayı Kapat (Esc)"
        title="Kapat (Esc)"
      >
        <CloseIcon className="w-4 h-4" />
      </button>

      {/* Modal Kartı (.adv-card) — negron-v3.xml 1:1: 660px #111214 / #ffffff kart */}
      <div className="adv-card">

        {/* Arama Kutusu (.adv-input-bar) — negron-v3.xml 1:1: motor seçimi alttaki kayan hap butonlarda */}
        <div className="adv-input-bar">

          {/* Arama Input (.adv-search-input) */}
          <div className="adv-input-wrap">
            <span className="adv-input-ico">
              <SearchNormalIcon className="w-4 h-4" />
            </span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Arayın, @kategori veya adres…"
              className="adv-search-input"
              autoComplete="off"
              spellCheck="false"
            />
            {(
              <button
                type="button"
                onClick={() => { setQuery(''); inputRef.current?.focus(); }}
                className="adv-input-clear"
                title="Temizle"
              >
                <CloseIcon className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Ara Butonu (.adv-search-btn) */}
          <button
            type="button"
            onClick={() => executeSearch()}
            className="adv-search-btn"
            title="Ara veya Git (Enter)"
          >
            <SearchNormalIcon className="w-4 h-4 stroke-[2.2]" />
          </button>
        </div>

        {/* Hızlı Motor Hap Butonları (.adv-pills-row) — negron-v3.xml 1:1 (19 Motor) */}
        <div 
          ref={attachDragScroll}
          className="adv-pills-row"
        >
          {SEARCH_PILLS.map(pill => {
            const isActive = selectedEngine === pill.url;
            return (
              <button
                key={pill.name}
                type="button"
                onClick={() => handleSelectEngine(pill.url)}
                className={`adv-pill${isActive ? ' is-active' : ''}`}
              >
                {pill.name}
              </button>
            );
          })}
        </div>

        {/* Canlı Kısayol / Hesap Makinesi / Önizleme Şeridi (.adv-banner) — negron-v3.xml 1:1 */}
        <div className="adv-banner">
          <div 
            ref={attachDragScroll}
            className="adv-banner-content"
          >
            {bannerContent}
          </div>
          <kbd className="adv-banner-kbd">
            {bannerKbd}
          </kbd>
        </div>

        {/* Sayfada Çekmecesi: Bağlantılar Paneli (.adv-results-list) — negron-v3.xml 1:1 */}
        {selectedEngine === 'blog' && (
          <div className="adv-results-list">
            <div className="adv-results-header">
              <span className="min-w-0 truncate">
                {results.length > 0
                  ? isLatest
                    ? `📖 Son Eklenen Yazılar (${results.length})`
                    : `🔍 Eşleşen Yazılar (${results.length})`
                  : raw
                    ? 'Eşleşen Sonuç Bulunamadı'
                    : '📖 Son Eklenen Yazılar'}
              </span>
              <span className="text-[10px] font-normal opacity-75 shrink-0 whitespace-nowrap">Gezinmek için ↑ ↓</span>
            </div>

            {results.length > 0 ? (
              results.map((link, idx) => {
                const isSel = idx === selectedIndex;
                const colName = link.collectionId ? collectionMap.get(link.collectionId) : null;
                const tag = colName || (link.tags && link.tags.length > 0 ? link.tags[0] : null) || 'Bağlantı';
                return (
                  <div
                    key={link.id || link.url}
                    onClick={() => openResult(link)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`adv-item${isSel ? ' is-selected' : ''}`}
                  >
                    <div className="adv-item-main">
                      <span className="adv-item-icon">
                        <svg className="line" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                      </span>
                      <div className="adv-item-text">
                        <div className="adv-item-title">
                          <span>{link.title}</span>
                          {link.isPinned && (
                            <RankingIcon className="adv-pin-ico" />
                          )}
                        </div>
                        <div className="adv-item-sub">
                          {getPathText(link)}
                        </div>
                      </div>
                    </div>
                    <span className="adv-item-tag">
                      {tag}
                    </span>
                  </div>
                );
              })
            ) : (
              raw ? (
                <div className="px-3.5 py-3.5 text-xs text-[#989b9f] text-center">
                  Sayfada eşleşen bağlantı bulunamadı. Enter tuşuna basarak genel arama yapabilirsiniz.
                </div>
              ) : (
                <div className="px-3.5 py-3.5 text-xs text-[#989b9f] text-center">
                  Kayıtlı bağlantılar hazırlanıyor…
                </div>
              )
            )}
          </div>
        )}

      </div>
    </div>
  );
};
