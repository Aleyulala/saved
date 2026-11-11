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

/* nsone.xml 35797-35812 1:1 — Hızlı Motor Hap Butonları (14) */
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
  { name: 'YouTube', url: 'https://www.youtube.com/results?search_query=' },
  { name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=' },
  { name: 'Perplexity', url: 'https://www.perplexity.ai/search?q=' },
  { name: 'Yandex', url: 'https://yandex.com/search/?text=' },
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
  const [selectedEngine, setSelectedEngine] = useState('blog');
  const [results, setResults] = useState<LinkItem[]>([]);
  const [isLatest, setIsLatest] = useState(false);
  const [collectionMap, setCollectionMap] = useState<Map<number, string>>(new Map());
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const shortUrl = (url: string) => url.replace(/^https?:\/\/[^/]+/, '') || 'Bağlantıyı Aç';

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
          className="inline-flex items-center px-[9px] py-[3px] rounded-[7px] bg-white/[0.08] border border-white/10 text-[#f1f5f9] text-[11px] font-mono cursor-pointer shrink-0 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[color-mix(in_srgb,var(--linkC,#9aa0a6)_28%,rgba(255,255,255,0.15))] hover:border-[var(--linkC,#9aa0a6)] hover:text-white"
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
      className="fixed inset-0 z-50 flex flex-col items-center justify-start px-4 pt-[10vh] pb-6 bg-black/[0.52] backdrop-blur-[16px] animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Kapat Butonu (.adv-close-btn) — nsone.xml 1:1 karemsi 32px */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 w-8 h-8 aspect-square rounded-[10px] bg-[#282828] border border-white/[0.08] text-white hover:bg-[#333333] hover:border-[var(--linkC,#9aa0a6)] hover:text-[var(--linkC,#9aa0a6)] flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.2)] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] outline-none cursor-pointer"
        aria-label="Aramayı Kapat (Esc)"
        title="Kapat (Esc)"
      >
        <CloseIcon className="w-4 h-4" />
      </button>

      {/* Modal Kartı (.adv-card) — nsone.xml 1:1: 660px cam efektli kart */}
      <div className="adv-card w-full max-w-[660px] flex flex-col gap-3 p-4 rounded-[20px] bg-[rgba(22,25,34,0.82)] backdrop-blur-[28px] border border-white/[0.08] shadow-[0_30px_80px_rgba(0,0,0,0.72)] animate-in slide-in-from-top duration-200">

        {/* Arama Kutusu ve Motor Seçici (.adv-input-bar) */}
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-[12px] bg-[#252526] border border-white/10 focus-within:border-[var(--linkC,#9aa0a6)] shadow-[0_12px_36px_rgba(0,0,0,0.45)] transition-all">

          {/* Arama Motoru Dropdown (.adv-engine-select) */}
          <select
            value={selectedEngine}
            onChange={(e) => setSelectedEngine(e.target.value)}
            className="bg-[#1e1e1e] hover:bg-[#28282b] text-[#d4d4d4] text-xs font-semibold py-2 px-2.5 rounded-lg border border-transparent outline-none cursor-pointer shrink-0 max-w-[130px] truncate"
            title="Arama Motoru Seçin"
          >
            {SEARCH_ENGINES.map((eng, i) => (
              <option key={`${eng.url}-${i}`} value={eng.url}>
                {eng.name}
              </option>
            ))}
          </select>

          {/* Arama Input (.adv-search-input) */}
          <div className="relative flex-1 flex items-center min-w-0">
            <span className="absolute left-2.5 text-[#989b9f] pointer-events-none">
              <SearchNormalIcon className="w-4 h-4" />
            </span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Arayın, @kategori veya adres…"
              className="w-full bg-transparent pl-[34px] pr-8 py-2 text-sm text-white placeholder-[#71717a] outline-none"
              autoComplete="off"
              spellCheck="false"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-2 text-[#989b9f] hover:text-white transition-colors"
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
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[var(--linkB,#9aa0a6)] hover:opacity-90 text-[#0f172a] flex items-center justify-center font-bold text-base shadow-md active:scale-95 transition-all cursor-pointer shrink-0"
            title="Ara veya Git (Enter)"
          >
            <SearchNormalIcon className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Hızlı Motor Hap Butonları (.adv-pills-row) — nsone.xml 35797-35812 1:1 */}
        <div className="adv-pills-row flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none select-none touch-pan-x cursor-grab">
          {SEARCH_PILLS.map(pill => {
            const isActive = selectedEngine === pill.url;
            return (
              <button
                key={pill.name}
                type="button"
                onClick={() => setSelectedEngine(pill.url)}
                className={`adv-pill px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap cursor-pointer border transition-all duration-150 ${
                  isActive
                    ? 'is-active bg-[rgba(96,205,255,0.15)] text-[var(--linkC,#9aa0a6)] border-[rgba(96,205,255,0.4)]'
                    : 'bg-[#1e1e1e] text-[#a3a3a3] border-transparent hover:bg-[#28282b] hover:text-white'
                }`}
              >
                {pill.name}
              </button>
            );
          })}
        </div>

        {/* Canlı Kısayol / Hesap Makinesi / Önizleme Şeridi (.adv-banner) — nsone.xml 36166-36204 1:1 */}
        <div className="adv-banner flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-[10px] bg-[rgba(30,30,30,0.92)] border border-white/[0.08] text-xs">
          <div className="flex items-center gap-1.5 min-w-0 flex-1 overflow-x-auto scrollbar-none whitespace-nowrap select-none py-0.5">
            {bannerContent}
          </div>
          <kbd className="adv-banner-kbd px-[9px] py-[3px] rounded-[7px] text-[11px] font-bold bg-[color-mix(in_srgb,var(--linkC,#9aa0a6)_25%,rgba(255,255,255,0.1))] border border-[color-mix(in_srgb,var(--linkC,#9aa0a6)_60%,rgba(255,255,255,0.2))] text-white shadow-[0_2px_6px_rgba(0,0,0,0.2)] shrink-0 whitespace-nowrap">
            {bannerKbd}
          </kbd>
        </div>

        {/* Sayfada Çekmecesi: Bağlantılar Paneli (.adv-results-list) — nsone.xml 35840-35847 1:1 */}
        {selectedEngine === 'blog' && (
          <div className="adv-results-list max-h-[290px] overflow-y-auto rounded-xl bg-[#1e1e1e] border border-white/[0.06] p-1.5 flex flex-col gap-[3px] shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
            <div className="adv-results-header px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.05em] text-[#989b9f] flex items-center justify-between">
              <span>
                {results.length > 0
                  ? isLatest
                    ? `📖 Son Eklenen Bağlantılar (${results.length})`
                    : `🔍 Eşleşen Bağlantılar (${results.length})`
                  : raw
                    ? 'Eşleşen Sonuç Bulunamadı'
                    : '📖 Son Eklenen Bağlantılar'}
              </span>
              <span className="text-[10px] font-normal opacity-70">Gezinmek için ↑ ↓</span>
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
                    className={`adv-item flex items-center justify-between gap-3 px-2.5 py-2 rounded-lg cursor-pointer transition-all duration-150 ${
                      isSel ? 'is-selected bg-[#252526] border border-white/10' : 'border border-transparent'
                    }`}
                  >
                    <div className="adv-item-main flex items-center gap-2.5 min-w-0">
                      <span className="adv-item-icon w-5 h-5 flex items-center justify-center text-[var(--linkC,#9aa0a6)] shrink-0">
                        <img
                          src={link.favicon || getFaviconUrl(link.url)}
                          alt=""
                          className="w-4 h-4 rounded object-contain"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </span>
                      <div className="adv-item-text min-w-0">
                        <div className="adv-item-title text-[13px] font-semibold text-[#f3f4f6] whitespace-nowrap overflow-hidden text-ellipsis flex items-center gap-1">
                          <span className="truncate">{link.title}</span>
                          {link.isPinned && (
                            <RankingIcon className="w-3 h-3 text-amber-400 shrink-0" />
                          )}
                        </div>
                        <div className="adv-item-sub text-[11px] text-[#71717a] whitespace-nowrap overflow-hidden text-ellipsis font-mono">
                          {shortUrl(link.url)}
                        </div>
                      </div>
                    </div>
                    <span className="adv-item-tag px-2 py-[3px] rounded-full text-[10px] font-medium bg-[#28282b] text-[#a3a3a3] shrink-0">
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
