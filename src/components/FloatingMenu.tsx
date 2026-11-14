import React, { useState, useEffect } from 'react';
import { exportDatabaseToJson, downloadFile } from '../utils/exportImport';
import { ViewMode } from '../types';

interface FloatingMenuProps {
  onOpenNewLink: () => void;
  onOpenSearch: () => void;
  onOpenCollections: () => void;
  onOpenSettings: () => void;
  onOpenImportExport: () => void;
  onOpenTags?: () => void;
  onOpenAllLinks?: () => void;
  onOpenPinned?: () => void;
  onToggleViewMode?: () => void;
  viewMode?: ViewMode;
}

export const FloatingMenu: React.FC<FloatingMenuProps> = ({
  onOpenNewLink,
  onOpenSearch,
  onOpenCollections,
  onOpenSettings,
  onOpenImportExport,
  onOpenTags,
  onOpenAllLinks,
  onOpenPinned,
  onToggleViewMode
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const el = document.getElementById('mainScrollContainer');
      const scrollTop = el ? el.scrollTop : (window.scrollY || document.documentElement.scrollTop);
      setIsScrolled(scrollTop > 20);
    };

    const container = document.getElementById('mainScrollContainer');
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
    }
    window.addEventListener('scroll', handleScroll, { passive: true });

    handleScroll();

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleScrollToggle = () => {
    const el = document.getElementById('mainScrollContainer');
    if (el) {
      if (el.scrollTop <= 20) {
        el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
      } else {
        el.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      if ((window.scrollY || document.documentElement.scrollTop) <= 20) {
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleQuickBackup = async () => {
    try {
      const jsonStr = await exportDatabaseToJson();
      const dateStr = new Date().toISOString().slice(0, 10);
      downloadFile(jsonStr, `saved-backup-${dateStr}.json`, 'application/json');
    } catch (e) {
      console.error('Quick backup failed:', e);
    }
  };

  const buttonClass = "w-9 h-9 rounded-[10px] bg-[#252526] hover:bg-[#333333] border border-white/10 hover:border-[var(--linkC,#9aa0a6)] text-white hover:text-[var(--linkC,#9aa0a6)] flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95 group relative";

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Floating Action Menu Container (Fixed Bottom Right - Blogger .qeF & .tTb 1:1) */}
      <div className="fixed bottom-6 right-6 z-50 flex items-end gap-2.5 select-none">
        {isOpen ? (
          /* Blogger .qeL 4 Basamaklı Merdiven / Çapraz Genişleyen Menü (Screenshot 3 1:1 Parity) */
          <div className="grid grid-cols-4 gap-2 p-1 animate-in zoom-in-95 duration-150">
            
            {/* --- SATIR 4 (EN ÜST): 2 Buton (Sütun 3 & 4) --- */}
            <div className="col-start-3">
              <button
                type="button"
                className={buttonClass}
                onClick={() => {
                  setIsOpen(false);
                  window.open('https://pagespeed.web.dev/', '_blank', 'noopener,noreferrer');
                }}
                title="Hız Testi (PageSpeed)"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M19.14 19.5C20.91 17.7 22 15.22 22 12.5C22 6.98 17.52 2.5 12 2.5C6.48 2.5 2 6.98 2 12.5C2 15.22 3.08 17.68 4.84 19.49" />
                  <circle cx="12" cy="18" r="3" />
                  <path d="M15 12h1" />
                </svg>
                <div className="absolute right-full top-1/2 -translate-y-1/2 mr-2 px-2 py-1 rounded bg-[#1e1e1e] border border-white/10 text-white text-[11px] whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-lg z-50">
                  Hız Testi
                </div>
              </button>
            </div>

            <div className="col-start-4">
              <button
                type="button"
                className={buttonClass}
                onClick={() => {
                  setIsOpen(false);
                  handleQuickBackup();
                }}
                title="Verileri Dışa Aktar"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="12" y1="18" x2="12" y2="12" />
                  <polyline points="9 15 12 18 15 15" />
                </svg>
                <div className="absolute right-full top-1/2 -translate-y-1/2 mr-2 px-2 py-1 rounded bg-[#1e1e1e] border border-white/10 text-white text-[11px] whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-lg z-50">
                  Verileri Dışa Aktar
                </div>
              </button>
            </div>

            {/* --- SATIR 3: 3 Buton (Sütun 2, 3 & 4) --- */}
            <div className="col-start-2">
              <button
                type="button"
                className={buttonClass}
                onClick={() => {
                  setIsOpen(false);
                  onOpenNewLink();
                }}
                title="Yeni Bağlantı / Yazı Ekle"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
                <div className="absolute right-full top-1/2 -translate-y-1/2 mr-2 px-2 py-1 rounded bg-[#1e1e1e] border border-white/10 text-white text-[11px] whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-lg z-50">
                  Yeni Ekle
                </div>
              </button>
            </div>

            <div className="col-start-3">
              <button
                type="button"
                className={buttonClass}
                onClick={() => {
                  setIsOpen(false);
                  onOpenImportExport();
                }}
                title="HTML & Veri Yönetimi"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M4.1 2h15.8c.6 0 1.1.5 1 1.1l-1.8 16.2c0 .4-.3.7-.7.9l-6.1 1.7c-.2.1-.4.1-.5 0l-6.1-1.7c-.4-.1-.7-.4-.7-.9L3.1 3.1c0-.6.4-1.1 1-1.1Z" />
                  <path d="M16.2 6.8H7.8l.4 4.4h7.6l-.6 5-3.4 1-3.6-1v-2" />
                </svg>
                <div className="absolute right-full top-1/2 -translate-y-1/2 mr-2 px-2 py-1 rounded bg-[#1e1e1e] border border-white/10 text-white text-[11px] whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-lg z-50">
                  HTML & İçe Aktar
                </div>
              </button>
            </div>

            <div className="col-start-4">
              <button
                type="button"
                className={buttonClass}
                onClick={() => {
                  setIsOpen(false);
                  if (onToggleViewMode) onToggleViewMode();
                }}
                title="Görünüm & Yerleşim"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="3" width="7" height="18" rx="2" />
                  <rect x="14" y="3" width="7" height="8" rx="2" />
                  <rect x="14" y="13" width="7" height="8" rx="2" />
                </svg>
                <div className="absolute right-full top-1/2 -translate-y-1/2 mr-2 px-2 py-1 rounded bg-[#1e1e1e] border border-white/10 text-white text-[11px] whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-lg z-50">
                  Yerleşim
                </div>
              </button>
            </div>

            {/* --- SATIR 2: 4 Buton (Sütun 1, 2, 3 & 4) --- */}
            <div className="col-start-1">
              <button
                type="button"
                className={buttonClass}
                onClick={() => {
                  setIsOpen(false);
                  if (onOpenPinned) onOpenPinned();
                  else if (onOpenAllLinks) onOpenAllLinks();
                }}
                title="Öne Çıkanlar (Pinli)"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <div className="absolute right-full top-1/2 -translate-y-1/2 mr-2 px-2 py-1 rounded bg-[#1e1e1e] border border-white/10 text-white text-[11px] whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-lg z-50">
                  Öne Çıkanlar
                </div>
              </button>
            </div>

            <div className="col-start-2">
              <button
                type="button"
                className={buttonClass}
                onClick={() => {
                  setIsOpen(false);
                  if (onOpenAllLinks) onOpenAllLinks();
                  else onOpenSearch();
                }}
                title="Tüm Bağlantılar (Sayfalar)"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" />
                  <line x1="3" y1="12" x2="3.01" y2="12" />
                  <line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
                <div className="absolute right-full top-1/2 -translate-y-1/2 mr-2 px-2 py-1 rounded bg-[#1e1e1e] border border-white/10 text-white text-[11px] whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-lg z-50">
                  Tüm Kayıtlar
                </div>
              </button>
            </div>

            <div className="col-start-3">
              <button
                type="button"
                className={buttonClass}
                onClick={() => {
                  setIsOpen(false);
                  if (onOpenTags) onOpenTags();
                  else onOpenCollections();
                }}
                title="İstatistikler & Etiketler"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="8" y1="12" x2="8" y2="16" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="16" y1="14" x2="16" y2="16" />
                </svg>
                <div className="absolute right-full top-1/2 -translate-y-1/2 mr-2 px-2 py-1 rounded bg-[#1e1e1e] border border-white/10 text-white text-[11px] whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-lg z-50">
                  İstatistikler
                </div>
              </button>
            </div>

            <div className="col-start-4">
              <button
                type="button"
                className={buttonClass}
                onClick={() => {
                  setIsOpen(false);
                  onOpenSettings();
                }}
                title="Ayarlar & Yapılandırma"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
                <div className="absolute right-full top-1/2 -translate-y-1/2 mr-2 px-2 py-1 rounded bg-[#1e1e1e] border border-white/10 text-white text-[11px] whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-lg z-50">
                  Ayarlar
                </div>
              </button>
            </div>

            {/* --- SATIR 1 (EN ALT): 4 Buton (Sütun 1, 2, 3 & Kapat [X] Sütun 4) --- */}
            <div className="col-start-1">
              <button
                type="button"
                className={buttonClass}
                onClick={() => {
                  setIsOpen(false);
                  handleQuickBackup();
                }}
                title="İçeriği Hızlı Yedekle"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29" />
                  <polyline points="8 17 12 21 16 17" />
                  <line x1="12" y1="12" x2="12" y2="21" />
                </svg>
                <div className="absolute right-full top-1/2 -translate-y-1/2 mr-2 px-2 py-1 rounded bg-[#1e1e1e] border border-white/10 text-white text-[11px] whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-lg z-50">
                  Hızlı Yedek
                </div>
              </button>
            </div>

            <div className="col-start-2">
              <button
                type="button"
                className={buttonClass}
                onClick={() => {
                  setIsOpen(false);
                  onOpenCollections();
                }}
                title="Koleksiyonlar"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M9.5 19.5V18H4.5C3.95 18 3.45 17.78 3.09 17.41C2.72 17.05 2.5 16.55 2.5 16C2.5 14.97 3.3 14.11 4.31 14.01C4.37 14 4.43 14 4.5 14H19.5C19.57 14 19.63 14 19.69 14.01C20.17 14.05 20.59 14.26 20.91 14.59C21.32 14.99 21.54 15.56 21.49 16.18C21.4 17.23 20.45 18 19.39 18H14.5V19.5C14.5 20.88 13.38 22 12 22C10.62 22 9.5 20.88 9.5 19.5Z" />
                  <path d="M20.17 5.3L19.69 14.01C19.63 14 19.57 14 19.5 14H4.50001C4.43001 14 4.37001 14 4.31001 14.01L3.83001 5.3C3.65001 3.53 5.04001 2 6.81001 2H17.19C18.96 2 20.35 3.53 20.17 5.3Z" />
                </svg>
                <div className="absolute right-full top-1/2 -translate-y-1/2 mr-2 px-2 py-1 rounded bg-[#1e1e1e] border border-white/10 text-white text-[11px] whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-lg z-50">
                  Koleksiyonlar
                </div>
              </button>
            </div>

            <div className="col-start-3">
              <button
                type="button"
                className={buttonClass}
                onClick={() => {
                  setIsOpen(false);
                  onOpenSearch();
                }}
                title="Gelişmiş Arama & Bul"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
                <div className="absolute right-full top-1/2 -translate-y-1/2 mr-2 px-2 py-1 rounded bg-[#1e1e1e] border border-white/10 text-white text-[11px] whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-lg z-50">
                  Arama Paneli
                </div>
              </button>
            </div>

            <div className="col-start-4">
              <button
                type="button"
                className={`${buttonClass} bg-[#282828] text-white hover:text-red-400`}
                onClick={() => setIsOpen(false)}
                title="Menüyü Kapat"
                aria-label="Menüyü Kapat"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                <div className="absolute right-full top-1/2 -translate-y-1/2 mr-2 px-2 py-1 rounded bg-[#1e1e1e] border border-white/10 text-white text-[11px] whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-lg z-50">
                  Kapat
                </div>
              </button>
            </div>

          </div>
        ) : (
          /* Kapalıyken Blogger .qeT Tarzı İkon Butonu */
          <button
            type="button"
            className="floating-btn w-10 h-10 rounded-[12px] bg-[#252526] hover:bg-[#333333] border border-white/10 text-white hover:text-[var(--linkC,#9aa0a6)] flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95 group relative"
            onClick={() => setIsOpen(true)}
            title="Hızlı İşlemler Paneli"
            aria-label="Hızlı İşlemler"
          >
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" />
              <path d="M2 12.8799V11.1199C2 10.0799 2.85 9.21994 3.9 9.21994C5.71 9.21994 6.45 7.93994 5.54 6.36994C5.02 5.46994 5.33 4.29994 6.24 3.77994L7.97 2.78994C8.76 2.31994 9.78 2.59994 10.25 3.38994L10.36 3.57994C11.26 5.14994 12.74 5.14994 13.65 3.57994L13.76 3.38994C14.23 2.59994 15.25 2.31994 16.04 2.78994L17.77 3.77994C18.68 4.29994 18.99 5.46994 18.47 6.36994C17.56 7.93994 18.3 9.21994 20.11 9.21994C21.15 9.21994 22.01 10.0699 22.01 11.1199V12.8799C22.01 13.9199 21.16 14.7799 20.11 14.7799C18.3 14.7799 17.56 16.0599 18.47 17.6299C18.99 18.5399 18.68 19.6999 17.77 20.2199L16.04 21.2099C15.25 21.6799 14.23 21.3999 13.76 20.6099L13.65 20.4199C12.75 18.8499 11.27 18.8499 10.36 20.4199L10.25 20.6099C9.78 21.3999 8.76 21.6799 7.97 21.2099L6.24 20.2199C5.33 19.6999 5.02 18.5299 5.54 17.6299C6.45 16.0599 5.71 14.7799 3.9 14.7799C2.85 14.7799 2 13.9199 2 12.8799Z" />
            </svg>
          </button>
        )}

        {/* Scroll to Top / Bottom (.tTb - Screenshot 1 1:1 Yuvarlak Buton) */}
        <button
          type="button"
          onClick={handleScrollToggle}
          className="floating-btn w-10 h-10 rounded-full bg-[#252526] hover:bg-[#333333] border border-white/15 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95 shrink-0"
          title={isScrolled ? 'Yukarı Çık' : 'Aşağı İn'}
          aria-label={isScrolled ? 'Yukarı Çık' : 'Aşağı İn'}
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {isScrolled ? (
              <polyline points="18 15 12 9 6 15" />
            ) : (
              <polyline points="6 9 12 15 18 9" />
            )}
          </svg>
        </button>
      </div>
    </>
  );
};
