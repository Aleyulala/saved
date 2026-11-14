import React, { useRef, useState, useEffect } from 'react';
import { Palette, Sun, Moon, Laptop, Check, ChevronDown } from 'lucide-react';
import { 
  MenuHamburgerIcon, 
  SearchNormalIcon, 
  CloseIcon, 
  SunMoonIcon,
  TranslateIcon,
  TelegramIcon,
  ArchiveIcon,
  Profile1Icon,
  Verify1Icon,
  Edit3Icon
} from './BloggerIcons';
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

  return (
    <header className="sticky top-0 z-40 w-full h-[60px] bg-[#1e1e1e] border-b border-[#252526] flex items-center select-none relative">
      
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
          className="cursor-pointer inline-flex items-center group select-none ml-2.5 no-underline"
          title="Ana Sayfaya Git (NESCİONE)"
          aria-label="Ana Sayfa"
        >
          {/* Typographic Wordmark (Yazı Logo — NESCİONE) */}
          <span className="font-sans font-extrabold text-[15px] sm:text-[16px] tracking-[0.22em] uppercase text-[#202124] dark:text-[#fffdfc] group-hover:text-[var(--linkC,#9aa0a6)] transition-colors duration-300 leading-none">
            NESCİONE
          </span>
          <span className="inline-flex items-center justify-center ml-2.5 text-[#202124] dark:text-[#fffdfc] group-hover:text-[var(--linkC,#9aa0a6)] transition-colors duration-300 shrink-0 leading-none" aria-hidden="true">
            <svg className="w-[14px] h-[14px] text-current stroke-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ shapeRendering: 'geometricPrecision' }}>
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </span>
        </a>
      </div>

      {/* 2. Orta Bölüm: Blogger Arama Hapı (Ekranın TAM GEOMETRİK ORTASINDA: absolute left-1/2 -translate-x-1/2 — Blogger 1:1) */}
      <div className="hidden min-[800px]:flex absolute left-1/2 -translate-x-1/2 w-full max-w-[440px] px-2.5 min-w-0 z-10 items-center justify-center h-full pointer-events-none">
        <div
          onClick={onOpenSearchModal}
          className="relative flex items-center w-full h-9 rounded-[14px] px-3.5 gap-2.5 bg-[#252526] pointer-events-auto hover:bg-[#28282b] border border-white/[0.08] hover:border-[rgba(96,205,255,0.4)] cursor-pointer group select-none transition-all duration-200"
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

      {/* 3. Sağ Bölüm: Blogger XML 1:1 .headIc Butonları */}
      <div className="flex items-center justify-end shrink-0 pr-3 sm:pr-4 gap-1 sm:gap-1.5 ml-auto z-20">
        {/* Mobilde Arama Butonu (<800px .headIc .isSrh) */}
        <button
          onClick={onOpenSearchModal}
          className="min-[800px]:hidden head-action-btn"
          title="Ara"
          aria-label="Ara"
        >
          <SearchNormalIcon className="w-4 h-4" />
        </button>
            
            {/* 1. Buton: Yazarlar & Profil (.isPrf - Profile1Icon & .wPrf) */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(prev => !prev)}
                className={`head-action-btn ${isProfileOpen ? 'is-active' : ''}`}
                title="Yazarlar &amp; Profil"
                aria-label="Yazarlar"
              >
                <Profile1Icon className="w-4 h-4" />
              </button>

              {/* Blogger XML 1:1 Profil / Yazarlar Açılır Kartı */}
              {isProfileOpen && (
                <div
                  className="wPrf fixLs animate-in fade-in duration-200 flex flex-col origin-top-right"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + (var(--headerHc, 60px) - 100%) / 2)',
                    insetInlineEnd: 0,
                    width: '240px',
                    maxHeight: '240px',
                    background: '#252526',
                    border: '1px solid #333333',
                    borderRadius: '10px',
                    borderStartEndRadius: '5px',
                    overflow: 'hidden',
                    zIndex: 4
                  }}
                >
                  <div className="prfH fixH fixT flex items-center justify-between gap-2 px-5 shrink-0 border-b border-[#333333]">
                    <span className="flex-1 py-3 text-[13px] font-bold text-[#fffdfc] opacity-80">Yazarlar</span>
                    <button
                      onClick={() => setIsProfileOpen(false)}
                      className="w-8 h-8 aspect-square rounded-[10px] bg-[#282828] border border-white/[0.08] text-white hover:bg-[#333333] hover:border-[var(--linkC,#9aa0a6)] hover:text-[var(--linkC,#9aa0a6)] flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.2)] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] outline-none cursor-pointer shrink-0"
                      title="Kapat"
                      aria-label="Kapat"
                    >
                      <CloseIcon className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="prfC fixC teamPrfWrap overflow-y-auto p-3 flex flex-col gap-2.5">
                    {Object.values(BLOGGER_AUTHORS).map((author) => (
                      <a
                        key={author.name}
                        href={author.url}
                        target="_blank"
                        rel="noreferrer"
                        className="prfAuthorBlock block px-3 py-2.5 rounded-[10px] bg-white/[0.03] border border-white/[0.08] no-underline text-inherit hover:bg-white/[0.06] hover:border-[var(--linkC,#9aa0a6)] hover:-translate-y-[1px] transition-all duration-200"
                      >
                        <div className="prfTopRow flex items-center gap-2.5">
                          <img
                            src={author.avatar}
                            alt={author.name}
                            className="im w-[39px] h-[39px] rounded-full object-cover shrink-0 border-[1.5px] border-[var(--linkC,#9aa0a6)]"
                          />
                          <div className="prfHeadMeta flex flex-col min-w-0">
                            <span className="prfName flex items-center gap-1 text-[13px] font-bold text-[#fffdfc]">
                              {author.name}
                              <Verify1Icon className="w-3.5 h-3.5 text-[var(--linkC,#9aa0a6)] shrink-0" />
                            </span>
                            <span className="prfRole text-[11px] font-semibold text-[var(--linkC,#9aa0a6)]">{author.role}</span>
                          </div>
                        </div>
                        <p className="prfBio mt-1.5 mb-0 text-[11.5px] leading-[1.4] text-[#a1a1aa]">{author.bio}</p>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 2. Buton: Yer İmleri (.isBkm - svg.archive) */}
            <button
              onClick={() => {
                if (onOpenPinned) onOpenPinned();
                else onGoHome();
              }}
              className="head-action-btn"
              title="Sabitlenenler &amp; Yer İmleri"
              aria-label="Yer İmleri"
            >
              <ArchiveIcon className="w-4 h-4" />
            </button>

            {/* 3. Buton: Ay / Görünüm & Tema (.isMode - svg.moon-sun-icon & .aprW & .thmW) */}
            <div className="relative" ref={appearanceRef}>
              <button
                onClick={() => setIsAppearanceOpen(prev => !prev)}
                className={`head-action-btn ${isAppearanceOpen ? 'is-active' : ''}`}
                title="Görünüm ve Tema Ayarları"
                aria-label="Görünüm ve Tema Modu"
              >
                <SunMoonIcon className="w-4 h-4" isDark={isDark} />
              </button>

              {/* Blogger XML 1:1 Görünüm Context Menüsü */}
              {isAppearanceOpen && (
                <div className="aprW absolute right-0 top-[calc(100%+8px)] w-60 bg-[#252526] border border-[#333333] rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 select-none">
                  
                  <div className="px-2.5 py-1.5 text-[11px] font-bold text-[#989b9f] uppercase tracking-wider border-b border-white/5 flex items-center justify-between">
                    <span>Görünüm</span>
                    <button 
                      onClick={() => setIsAppearanceOpen(false)} 
                      className="text-[#71717a] hover:text-white p-0.5 rounded cursor-pointer"
                      title="Kapat"
                    >
                      <CloseIcon className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Tema Modu: Açık / Koyu / Sistem */}
                  <div className="space-y-1 py-1.5">
                    <button
                      type="button"
                      onClick={() => applyThemeMode('light')}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        currentMode === 'light' ? 'bg-[#333333] text-white font-semibold' : 'text-[#d4d4d4] hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Sun className="w-4 h-4 text-amber-400" />
                        <span>Açık</span>
                      </div>
                      {currentMode === 'light' && <Check className="w-3.5 h-3.5 text-[var(--linkC,#9aa0a6)]" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => applyThemeMode('dark')}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        currentMode === 'dark' ? 'bg-[#333333] text-white font-semibold' : 'text-[#d4d4d4] hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Moon className="w-4 h-4 text-[var(--linkC,#9aa0a6)]" />
                        <span>Koyu</span>
                      </div>
                      {currentMode === 'dark' && <Check className="w-3.5 h-3.5 text-[var(--linkC,#9aa0a6)]" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => applyThemeMode('system')}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        currentMode === 'system' ? 'bg-[#333333] text-white font-semibold' : 'text-[#d4d4d4] hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Laptop className="w-4 h-4 text-[#989b9f]" />
                        <span>Sistem</span>
                      </div>
                      {currentMode === 'system' && <Check className="w-3.5 h-3.5 text-[var(--linkC,#9aa0a6)]" />}
                    </button>
                  </div>

                  {/* Vurgu Rengi */}
                  <div className="pt-1.5 border-t border-white/5">
                    <button
                      type="button"
                      onClick={() => setIsThemePaletteOpen(prev => !prev)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-[#d4d4d4] hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <Palette className="w-4 h-4" style={{ color: currentThemeColor }} />
                        <span>Tema Rengi</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3.5 h-3.5 rounded-full border border-white/30" style={{ backgroundColor: currentThemeColor }} />
                        <ChevronDown className={`w-3.5 h-3.5 text-[#71717a] transition-transform duration-200 ${isThemePaletteOpen ? 'rotate-180' : ''}`} />
                      </div>
                    </button>

                    {isThemePaletteOpen && (
                      <div className="thmP grid grid-cols-4 gap-2.5 p-2 mt-1.5 bg-[#1e1e1e] rounded-lg border border-white/5 animate-in fade-in duration-150">
                        {THEME_COLORS.map(c => {
                          const isSelected = currentThemeIndex === c.id;
                          return (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => applyThemeColor(c.hex, c.id)}
                              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-115 cursor-pointer relative shadow-sm ${
                                isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-[#1e1e1e] scale-110 shadow-lg' : ''
                              }`}
                              style={{ backgroundColor: c.hex }}
                              title={c.name}
                            >
                              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                </div>
              )}
            </div>

            {/* 4. Buton: Çeviri (.isTrans - TranslateIcon & .wTrans) */}
            <div className="relative" ref={translateRef}>
              <button
                onClick={() => setIsTranslateOpen(prev => !prev)}
                className={`head-action-btn ${isTranslateOpen ? 'is-active' : ''}`}
                title="Dili Çevir"
                aria-label="Dili Çevir"
              >
                <TranslateIcon className="w-4 h-4" />
              </button>

              {isTranslateOpen && (
                <div
                  className="wTrans fixLs animate-in fade-in duration-200 flex flex-col origin-top-right select-none"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    insetInlineEnd: 0,
                    width: '200px',
                    maxHeight: '260px',
                    background: '#252526',
                    border: '1px solid #333333',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    zIndex: 50
                  }}
                >
                  <div className="fixH px-3 py-2 border-b border-[#333333] flex items-center justify-between text-xs font-bold text-white">
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
                        {selectedLang === lang.code && <Check className="w-3.5 h-3.5 text-[var(--linkC,#9aa0a6)]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>





          </div>
    </header>
  );
};
