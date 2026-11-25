import React, { useRef, useState, useEffect } from 'react';
import { 
  MenuHamburgerIcon, 
  SearchNormalIcon, 
  CloseIcon, CheckMarkIcon, 
  SunMoonIcon,
  TranslateIcon,
  TelegramIcon,
  ArchiveIcon,
  Profile1Icon,
  Verify1Icon,
  EditPostIcon
} from './BloggerIcons';
import { LinkItem } from '../types';
import { getFaviconUrl } from '../utils/favicon';
import { BLOGGER_AUTHORS } from '../utils/bloggerAuthors';

const THEME_COLORS = [
  { id: 0, hex: '#9aa0a6', name: 'Gri (Varsayılan)' },
  { id: 1, hex: '#ea4335', name: 'Kırmızı' },
  { id: 2, hex: '#1e8e3e', name: 'Yeşil' },
  { id: 3, hex: '#4285f4', name: 'Mavi' },
  { id: 4, hex: '#f9ab00', name: 'Sarı' },
  { id: 5, hex: '#9334e6', name: 'Mor' },
  { id: 6, hex: '#e52592', name: 'Pembe' },
  { id: 7, hex: '#12b5cb', name: 'Camgöbeği' },
  { id: 8, hex: '#fa7b17', name: 'Turuncu' },
  { id: 9, hex: '#00897b', name: 'Teal' },
  { id: 10, hex: '#3949ab', name: 'İndigo' },
  { id: 11, hex: '#1a73e8', name: 'Google Mavi' },
  { id: 12, hex: '#188038', name: 'Koyu Yeşil' },
  { id: 13, hex: '#1967d2', name: 'Derin Mavi' },
  { id: 14, hex: '#a142f4', name: 'Açık Mor' },
  { id: 15, hex: '#d93025', name: 'Koyu Kırmızı' },
];

const LANGUAGES = [
  { code: 'tr', name: 'Türkçe', native: 'Türkçe' },
  { code: 'en', name: 'English', native: 'English' },
  { code: 'de', name: 'Deutsch', native: 'Deutsch' },
  { code: 'fr', name: 'Français', native: 'Français' },
  { code: 'es', name: 'Español', native: 'Español' },
  { code: 'ru', name: 'Русский', native: 'Русский' },
  { code: 'ar', name: 'العربية', native: 'العربية' },
  { code: 'it', name: 'Italiano', native: 'Italiano' },
  { code: 'ja', name: '日本語', native: '日本語' },
  { code: 'ko', name: '한국어', native: '한국어' },
  { code: 'pt', name: 'Português', native: 'Português' },
  { code: 'zh-CN', name: '中文', native: '中文' },
];

interface BloggerHeaderProps {
  onToggleSidebar: () => void;
  onOpenDrawer: () => void;
  onOpenRightSidebar?: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenNewLink: () => void;
  onOpenImportExport: () => void;
  onOpenSettings: () => void;
  onGoHome: () => void;
  onOpenSearchModal?: () => void;
  onOpenPinned?: () => void;
  bookmarkedLinks?: LinkItem[];
  onOpenBookmarkedPost?: (link: LinkItem) => void;
  onRemoveBookmark?: (id: number, current: boolean) => void;
  isPostDetail?: boolean;
  postTitle?: string;
}

export const BloggerHeader: React.FC<BloggerHeaderProps> = ({
  onToggleSidebar,
  onOpenDrawer,
  onOpenRightSidebar,
  searchQuery,
  onSearchChange,
  onOpenNewLink,
  onOpenImportExport,
  onOpenSettings,
  onGoHome,
  onOpenSearchModal,
  onOpenPinned,
  bookmarkedLinks = [],
  onOpenBookmarkedPost,
  onRemoveBookmark,
  isPostDetail = false,
  postTitle
}) => {
  const [isTranslateOpen, setIsTranslateOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState<string>('tr');
  const [isDark, setIsDark] = useState<boolean>(true);
  const [isAppearanceOpen, setIsAppearanceOpen] = useState(false);
  const [isThemePaletteOpen, setIsThemePaletteOpen] = useState(false);
  const [currentMode, setCurrentMode] = useState<'dark' | 'light' | 'system'>('dark');
  const [currentThemeIndex, setCurrentThemeIndex] = useState<number>(0);
  const [currentThemeColor, setCurrentThemeColor] = useState<string>('#9aa0a6');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const translateRef = useRef<HTMLDivElement>(null);
  const appearanceRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const bookmarkRef = useRef<HTMLDivElement>(null);
  const [isBookmarkOpen, setIsBookmarkOpen] = useState(false);

  const applyThemeColor = (color: string, themeId: number = 0) => {
    setCurrentThemeColor(color);
    setCurrentThemeIndex(themeId);
    document.documentElement.style.setProperty('--tv-nav-ring', color);
    document.documentElement.style.setProperty('--linkB', color);
    document.documentElement.style.setProperty('--linkC', color);
    document.documentElement.style.setProperty('--text-primary', color);
    document.documentElement.style.setProperty('--theme-color', color);
    document.documentElement.style.setProperty('--c', color);

    // Update root class thX
    const root = document.documentElement;
    const existingTh = root.className.match(/th\d+\b/g);
    if (existingTh) root.classList.remove(...existingTh);
    root.classList.add(`th${themeId}`);
    if (themeId !== 0) {
      root.classList.add('thS');
    } else {
      root.classList.remove('thS');
    }

    // Save in PLUS_UI_APPEARANCE and saved_theme_color
    try {
      const prev = JSON.parse(localStorage.getItem('PLUS_UI_APPEARANCE') || '{}');
      prev.theme = themeId;
      localStorage.setItem('PLUS_UI_APPEARANCE', JSON.stringify(prev));
    } catch {}
    localStorage.setItem('saved_theme_color', color);
    localStorage.setItem('saved_theme_id', String(themeId));
  };

  const applyThemeMode = (mode: 'dark' | 'light' | 'system') => {
    setCurrentMode(mode);
    const root = document.documentElement;
    if (mode === 'light') {
      root.classList.remove('drK', 'syS');
      root.classList.add('lgT');
      setIsDark(false);
    } else if (mode === 'system') {
      root.classList.remove('drK', 'lgT');
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add('syS', prefersDark ? 'drK' : 'lgT');
      setIsDark(prefersDark);
    } else {
      root.classList.remove('lgT', 'syS');
      root.classList.add('drK');
      setIsDark(true);
    }

    try {
      const prev = JSON.parse(localStorage.getItem('PLUS_UI_APPEARANCE') || '{}');
      prev.mode = mode;
      localStorage.setItem('PLUS_UI_APPEARANCE', JSON.stringify(prev));
    } catch {}
    localStorage.setItem('saved_theme', mode);
  };

  // Initialize theme from PLUS_UI_APPEARANCE / localStorage
  // Mobil alt menüdeki ay (tema) butonu bu olayı gönderir
  useEffect(() => {
    const onToggle = () => applyThemeMode(isDark ? 'light' : 'dark');
    window.addEventListener('saved:toggle-theme', onToggle);
    return () => window.removeEventListener('saved:toggle-theme', onToggle);
  }, [isDark]);

  useEffect(() => {
    try {
      const appStr = localStorage.getItem('PLUS_UI_APPEARANCE');
      if (appStr) {
        const parsed = JSON.parse(appStr);
        if (parsed.mode) {
          applyThemeMode(parsed.mode);
        } else {
          applyThemeMode('dark');
        }
        if (typeof parsed.theme === 'number' && parsed.theme !== 0 && THEME_COLORS[parsed.theme]) {
          applyThemeColor(THEME_COLORS[parsed.theme].hex, parsed.theme);
        } else {
          applyThemeColor('#9aa0a6', 0);
        }
      } else {
        const savedMode = (localStorage.getItem('saved_theme') as any) || 'dark';
        applyThemeMode(savedMode);
        const savedId = localStorage.getItem('saved_theme_id');
        if (savedId !== null && Number(savedId) > 0 && THEME_COLORS[Number(savedId)]) {
          applyThemeColor(THEME_COLORS[Number(savedId)].hex, Number(savedId));
        } else {
          applyThemeColor('#9aa0a6', 0);
        }
      }
    } catch {
      applyThemeMode('dark');
      applyThemeColor('#9aa0a6', 0);
    }

    // Check existing Google Translate cookie
    const cookies = document.cookie.split(';');
    for (const c of cookies) {
      const trimmed = c.trim();
      if (trimmed.startsWith('googtrans=')) {
        const val = trimmed.split('=')[1];
        if (val) {
          const parts = val.split('/');
          const l = parts[parts.length - 1];
          if (l) setSelectedLang(l);
        }
      }
    }
  }, []);

  // Close popups on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (translateRef.current && !translateRef.current.contains(e.target as Node)) {
        setIsTranslateOpen(false);
      }
      if (appearanceRef.current && !appearanceRef.current.contains(e.target as Node)) {
        setIsAppearanceOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
      if (bookmarkRef.current && !bookmarkRef.current.contains(e.target as Node)) {
        setIsBookmarkOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelectLanguage = (langCode: string) => {
    setSelectedLang(langCode);
    setIsTranslateOpen(false);

    if (langCode === 'tr') {
      // Revert to original Turkish
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      const hostname = window.location.hostname;
      if (hostname && hostname !== 'localhost') {
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=.${hostname}; path=/;`;
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${hostname}; path=/;`;
      }
      window.location.reload();
      return;
    }

    // Set Google translate cookies
    const hostname = window.location.hostname;
    document.cookie = `googtrans=/auto/${langCode}; path=/;`;
    if (hostname && hostname !== 'localhost') {
      document.cookie = `googtrans=/auto/${langCode}; domain=.${hostname}; path=/;`;
      document.cookie = `googtrans=/auto/${langCode}; domain=${hostname}; path=/;`;
    }

    // Load Google Translate widget script
    if (!document.getElementById('google-translate-script')) {
      let gElem = document.getElementById('google_translate_element');
      if (!gElem) {
        gElem = document.createElement('div');
        gElem.id = 'google_translate_element';
        gElem.style.display = 'none';
        document.body.appendChild(gElem);
      }

      (window as any).googleTranslateElementInit = () => {
        try {
          new (window as any).google.translate.TranslateElement(
            { pageLanguage: 'tr', autoDisplay: false },
            'google_translate_element'
          );
          setTimeout(() => {
            const select = document.querySelector<HTMLSelectElement>('.goog-te-combo');
            if (select) {
              select.value = langCode;
              select.dispatchEvent(new Event('change'));
            }
          }, 350);
        } catch (e) {
          console.warn('Google Translate init failed:', e);
        }
      };

      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      document.body.appendChild(script);
    } else {
      const select = document.querySelector<HTMLSelectElement>('.goog-te-combo');
      if (select) {
        select.value = langCode;
        select.dispatchEvent(new Event('change'));
      } else {
        window.location.reload();
      }
    }
  };

  useEffect(() => {
    if (isPostDetail) {
      setIsProfileOpen(false);
    }
  }, [isPostDetail]);

  const hasContextOpen = (!isPostDetail && isProfileOpen) || isAppearanceOpen || isTranslateOpen || isBookmarkOpen;

  return (
    <header className={`sticky top-0 ${hasContextOpen ? 'z-[60]' : 'z-40'} w-full h-[60px] bg-[#1e1e1e] border-0 flex items-center select-none`}>
      
      {/* 1. Sol Bölüm (.headL — XML 1:1: Desktop/El Konsolunda sabit 230px genişlik, padding-left 20px) */}
      <div className="flex items-center min-[896px]:w-[230px] shrink-0 pl-4 min-[896px]:pl-5">
        <button
          onClick={onToggleSidebar}
          className="head-action-btn shrink-0"
          aria-label="Menüyü Aç/Kapat"
          title="Menüyü Aç/Kapat"
        >
          <MenuHamburgerIcon className="w-4 h-4" />
        </button>

        <a 
          href="./"
          onClick={(e) => {
            e.preventDefault();
            onGoHome();
          }}
          className="cursor-pointer inline-flex items-center group select-none ml-[5px] no-underline"
          title="Ana Sayfaya Git (NESCİONE)"
          aria-label="Ana Sayfa"
        >
          {/* Typographic Wordmark (Yazı Logo — NESCİONE) */}
          <span className="font-sans font-medium text-[15px] sm:text-[16px] tracking-[0.04em] uppercase text-white group-hover:text-[var(--linkC,#9aa0a6)] transition-colors duration-300 leading-none">
            NESCİONE
          </span>
          <span className="inline-flex items-center justify-center ml-2 text-white group-hover:text-[var(--linkC,#9aa0a6)] transition-colors duration-300 shrink-0 leading-none" aria-hidden="true">
            <svg className="w-[14px] h-[14px] text-current stroke-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ shapeRendering: 'geometricPrecision' }}>
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </span>
        </a>
      </div>

      {/* 2. Orta Bölüm: Blogger Arama Hapı (Ekranın TAM GEOMETRİK ORTASINDA: absolute left-1/2 -translate-x-1/2 — Blogger 1:1) */}
      <div className="hidden min-[800px]:flex absolute left-1/2 min-[896px]:left-[calc(50%+42px)] -translate-x-1/2 w-full max-w-[440px] px-2.5 min-w-0 z-10 items-center justify-center h-full pointer-events-none">
        <div
          onClick={onOpenSearchModal}
          className="head-search-pill relative flex items-center w-full h-9 rounded-[14px] px-3.5 gap-2.5 bg-[#252526] pointer-events-auto hover:bg-[#28282b] border border-white/[0.08] hover:border-[rgba(96,205,255,0.4)] cursor-pointer group select-none transition-all duration-200"
          title="Gelişmiş Arama & Bul Paneli (Ctrl+K)"
        >
          <span className="text-[#989b9f] group-hover:text-[var(--linkC,#9aa0a6)] transition-colors pointer-events-none shrink-0 flex items-center justify-center">
            <SearchNormalIcon className="w-[15px] h-[15px]" />
          </span>

          <span className="flex-1 text-xs text-[#989b9f] text-left truncate">
            {searchQuery || 'Bul...'}
          </span>

          {searchQuery ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSearchChange('');
              }}
              className="text-[#989b9f] hover:text-white transition-colors shrink-0 cursor-pointer"
              title="Aramayı Temizle"
              aria-label="Aramayı Temizle"
            >
              <CloseIcon className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="inline-flex items-center px-[7px] py-[2px] rounded-[4px] text-[9px] font-mono bg-[#1e1e1e] text-[#989b9f] border border-white/[0.06] shrink-0">
              Ctrl K
            </kbd>
          )}
        </div>
      </div>

      {/* Backdrop Blur Overlay (.fCls — negron.xml 1:1 context menu açılınca arka planı bulanıklaştırır) */}
      {hasContextOpen && (
        <div
          onClick={() => {
            setIsProfileOpen(false);
            setIsAppearanceOpen(false);
            setIsTranslateOpen(false);
            setIsBookmarkOpen(false);
          }}
          className="head-context-backdrop fixed inset-0 z-40 transition-opacity duration-200"
          aria-hidden="true"
        />
      )}

      {/* 3. Sağ Bölüm: Blogger XML 1:1 .headIc Butonları */}
      <div className={`flex items-center justify-end shrink-0 pr-3 sm:pr-[15px] gap-1 ml-auto ${hasContextOpen ? '' : 'z-20'}`}>
        {/* Mobilde Arama Butonu (<800px .headIc .isSrh) */}
        <button
          onClick={onOpenSearchModal}
          className="min-[800px]:hidden head-action-btn"
          title="Ara"
          aria-label="Ara"
        >
          <SearchNormalIcon className="w-4 h-4" />
        </button>
            
            {/* 1. Buton: Yazarlar & Profil (.isPrf - Blogger XML 1:1 yalnızca liste/ana sayfada, yazı detayında yerini .isEditPost alır) */}
            {!isPostDetail && (
            <div className={`relative ${isProfileOpen ? 'z-50' : ''}`} ref={profileRef}>
              <button
                onClick={() => {
                  setIsAppearanceOpen(false);
                  setIsTranslateOpen(false);
                  setIsProfileOpen(prev => !prev);
                }}
                className={`head-action-btn ${isProfileOpen ? 'is-active' : ''}`}
                title="Yazarlar &amp; Profil"
                aria-label="Yazarlar"
              >
                <Profile1Icon className="w-4 h-4" />
              </button>

              {/* Blogger XML 1:1 Profil / Yazarlar Açılır Kartı */}
              {isProfileOpen && (
                <div
                  className="wPrf fixLs context-menu-card bg-[#252526] border-0 animate-in fade-in duration-200 flex flex-col origin-top-right z-50"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + (var(--headerHc, 60px) - 100%) / 2)',
                    insetInlineEnd: 0,
                    width: '285px',
                    maxHeight: '380px',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    zIndex: 50
                  }}
                >
                  <div className="prfH fixH fixT flex items-center justify-between gap-2 px-4 pt-3.5 pb-1 shrink-0 border-0">
                    <span className="flex-1 text-[13px] font-medium text-[#989b9f]">Yazarlar</span>
                    <button
                      onClick={() => setIsProfileOpen(false)}
                      className="w-8 h-8 aspect-square rounded-[10px] bg-[#252526] hover:bg-[#333333] text-white hover:text-[var(--linkC,#9aa0a6)] flex items-center justify-center transition-all duration-200 outline-none cursor-pointer shrink-0"
                      title="Kapat"
                      aria-label="Kapat"
                    >
                      <CloseIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="prfC fixC teamPrfWrap overflow-y-auto px-3 pb-3 pt-1 flex flex-col gap-1.5">
                    {Object.values(BLOGGER_AUTHORS).map((author) => (
                      <a
                        key={author.name}
                        href={author.url}
                        target="_blank"
                        rel="noreferrer"
                        className="prfAuthorBlock block px-3 py-2.5 rounded-[10px] bg-transparent border-0 no-underline text-inherit hover:bg-white/5 transition-all duration-200"
                      >
                        <div className="prfTopRow flex items-center gap-3">
                          <img
                            src={author.avatar}
                            alt={author.name}
                            className="im w-[39px] h-[39px] rounded-full object-cover shrink-0 border border-white/15"
                          />
                          <div className="prfHeadMeta flex flex-col min-w-0">
                            <span className="prfName flex items-center gap-1 text-[13px] font-bold text-white">
                              {author.name}
                              <Verify1Icon className="w-3.5 h-3.5 text-[var(--linkC,#9aa0a6)] shrink-0" />
                            </span>
                            <span className="prfRole text-[11px] font-medium text-[#989b9f]">{author.role}</span>
                          </div>
                        </div>
                        <p className="prfBio mt-1.5 mb-0 text-[11.5px] leading-[1.4] text-[#989b9f]">{author.bio}</p>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
            )}

            {/* 2. Buton: Yer İmleri (.isBkm - svg.archive) + açılır panel (.wBkm) */}
            <div className={`relative ${isBookmarkOpen ? 'z-50' : ''}`} ref={bookmarkRef}>
              <button
                type="button"
                onClick={() => {
                  setIsProfileOpen(false);
                  setIsAppearanceOpen(false);
                  setIsTranslateOpen(false);
                  setIsBookmarkOpen(prev => !prev);
                }}
                className={`head-action-btn ${isBookmarkOpen ? 'is-active' : ''}`}
                title="Yer İmleri"
                aria-label="Yer İmleri"
                aria-expanded={isBookmarkOpen}
              >
                <ArchiveIcon className="w-4 h-4" />
              </button>

              {isBookmarkOpen && (
                <div className="wBkmX" role="dialog" aria-label="Yazıları Yer İmlerine Ekle">
                  <div className="bkmWrap">
                    <div className="bkmH" data-text="Yazıları Yer İmlerine Ekle">
                      <button type="button" className="c" aria-label="Kapat" onClick={() => setIsBookmarkOpen(false)}>
                        <CloseIcon className="" />
                      </button>
                    </div>
                    <div className="bkmC" id="dBmPs">
                      {bookmarkedLinks.length === 0 ? (
                        <div className="n">
                          <svg className="line" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <g transform="translate(3.650100, 2.749900)">
                              <path d="M16.51,5.55 L10.84,0.15 C10.11,0.05 9.29,0 8.39,0 C2.1,0 -1.95399252e-14,2.32 -1.95399252e-14,9.25 C-1.95399252e-14,16.19 2.1,18.5 8.39,18.5 C14.69,18.5 16.79,16.19 16.79,9.25 C16.79,7.83 16.7,6.6 16.51,5.55 Z" />
                              <path d="M10.2839,0.0827 L10.2839,2.7437 C10.2839,4.6017 11.7899,6.1067 13.6479,6.1067 L16.5989,6.1067" />
                            </g>
                          </svg>
                          <p>
                            <span className="noBookmarkText">Henüz favori makale listeniz yok...</span>
                          </p>
                          <button
                            type="button"
                            className="viewAllArticles"
                            onClick={() => {
                              setIsBookmarkOpen(false);
                              onGoHome();
                            }}
                          >
                            <span className="viewAllText">Tüm yazıları gör</span>
                          </button>
                        </div>
                      ) : (
                        bookmarkedLinks.map((l) => (
                          <div
                            key={l.id}
                            className="item"
                            onClick={() => {
                              setIsBookmarkOpen(false);
                              if (onOpenBookmarkedPost) onOpenBookmarkedPost(l);
                              else if (onOpenPinned) onOpenPinned();
                            }}
                          >
                            <div className="pThmb">
                              {l.thumbnail ? (
                                <img src={l.thumbnail} alt={l.title} referrerPolicy="no-referrer" loading="lazy" />
                              ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <img src={getFaviconUrl(l.url)} alt="" style={{ width: 28, height: 28, objectFit: 'contain', borderRadius: 6 }} onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
                                </div>
                              )}
                            </div>
                            <div className="itmC">
                              <div className="itmTtl">{l.title || l.url}</div>
                              <div className="pLbls">{(l.tags && l.tags[0]) || 'genel'}</div>
                              <button
                                type="button"
                                className="del"
                                title="Yer imini kaldır"
                                aria-label="Yer imini kaldır"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (onRemoveBookmark && l.id) onRemoveBookmark(l.id, true);
                                }}
                              >
                                <CloseIcon className="" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Buton: Ay / Görünüm & Tema (.isMode - svg.moon-sun-icon & .aprW & .thmW) */}
            <div className={`relative ${isAppearanceOpen ? 'z-50' : ''}`} ref={appearanceRef}>
              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  setIsTranslateOpen(false);
                  setIsThemePaletteOpen(false);
                  setIsAppearanceOpen(prev => !prev);
                }}
                className={`head-action-btn ${isAppearanceOpen ? 'is-active' : ''}`}
                title="Görünüm ve Tema Ayarları"
                aria-label="Görünüm ve Tema Modu"
              >
                <SunMoonIcon className="w-4 h-4" isDark={isDark} />
              </button>

              {/* Blogger XML 1:1 Görünüm paneli (.aprW) — ikonsuz metin düğmeleri + aktif onay işareti */}
              {isAppearanceOpen && !isThemePaletteOpen && (
                <div className="aprX" data-text="Görünüm" role="menu">
                  <button type="button" role="menuitemradio" aria-label="Aydınlık" aria-pressed={currentMode === 'light'} onClick={() => applyThemeMode('light')} />
                  <button type="button" role="menuitemradio" aria-label="Karanlık" aria-pressed={currentMode === 'dark'} onClick={() => applyThemeMode('dark')} />
                  <button type="button" role="menuitemradio" aria-label="Sistem" aria-pressed={currentMode === 'system'} onClick={() => applyThemeMode('system')} />
                  <button type="button" role="menuitem" aria-label="Tema" onClick={() => setIsThemePaletteOpen(true)} />
                </div>
              )}

              {/* Tema renkleri (.thmW > .thmP) */}
              {isAppearanceOpen && isThemePaletteOpen && (
                <div className="thmX" data-text="Tema">
                  <div className="thmP">
                    {THEME_COLORS.map(c => (
                      <button
                        key={c.id}
                        type="button"
                        className={currentThemeIndex === c.id ? 'on' : ''}
                        style={{ ['--c' as string]: c.hex } as React.CSSProperties}
                        onClick={() => applyThemeColor(c.hex, c.id)}
                        title={c.name}
                        aria-label={c.name}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 4. Buton: Çeviri (.isTrans - TranslateIcon & .wTrans) */}
            <div className={`relative ${isTranslateOpen ? 'z-50' : ''}`} ref={translateRef}>
              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  setIsAppearanceOpen(false);
                  setIsTranslateOpen(prev => !prev);
                }}
                className={`head-action-btn ${isTranslateOpen ? 'is-active' : ''}`}
                title="Dili Çevir"
                aria-label="Dili Çevir"
              >
                <TranslateIcon className="w-4 h-4" />
              </button>

              {isTranslateOpen && (
                <div
                  className="wTrans fixLs context-menu-card bg-[#252526] border-0 animate-in fade-in duration-200 flex flex-col origin-top-right select-none"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    insetInlineEnd: 0,
                    width: '200px',
                    maxHeight: '260px',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    zIndex: 50
                  }}
                >
                  <div className="fixH px-3 py-2.5 border-0 flex items-center justify-between text-xs font-bold text-white">
                    <span>Dili Seçin</span>
                    <button
                      onClick={() => setIsTranslateOpen(false)}
                      className="text-[#989b9f] hover:text-white p-0.5 cursor-pointer"
                    >
                      <CloseIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="overflow-y-auto p-1.5 space-y-0.5">
                    {LANGUAGES.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => handleSelectLanguage(lang.code)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                          selectedLang === lang.code ? 'bg-[#333333] text-white font-bold' : 'text-[#d4d4d4] hover:bg-white/5'
                        }`}
                      >
                        <span>{lang.native}</span>
                        {selectedLang === lang.code && <CheckMarkIcon className="w-3.5 h-3.5 text-[var(--linkC,#9aa0a6)]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 4. Buton: Konuyu / Bağlantıyı Düzenle (.isEditPost - Blogger XML 1:1, bağlantı detayında sağ üst köşede) */}
            {isPostDetail && (
              <button
                type="button"
                onClick={() => {
                  setIsProfileOpen(false);
                  setIsAppearanceOpen(false);
                  setIsTranslateOpen(false);
                  onOpenNewLink();
                }}
                className="head-action-btn isEditPost"
                title={postTitle ? `Bağlantıyı Düzenle: ${postTitle}` : 'Konuyu Düzenle'}
                aria-label="Bağlantıyı Düzenle"
              >
                <EditPostIcon className="w-4 h-4" />
              </button>
            )}
          </div>
    </header>
  );
};
