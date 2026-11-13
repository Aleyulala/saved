import React, { useState, useEffect } from 'react';
import { exportDatabaseToJson, downloadFile } from '../utils/exportImport';

interface FloatingMenuProps {
  onOpenNewLink: () => void;
  onOpenSearch: () => void;
  onOpenCollections: () => void;
  onOpenSettings: () => void;
  onOpenImportExport: () => void;
  onOpenTags?: () => void;
  onOpenAllLinks?: () => void;
}

export const FloatingMenu: React.FC<FloatingMenuProps> = ({
  onOpenNewLink,
  onOpenSearch,
  onOpenCollections,
  onOpenSettings,
  onOpenImportExport,
  onOpenTags,
  onOpenAllLinks
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const el = document.getElementById('mainScrollContainer');
      const scrollTop = el ? el.scrollTop : (window.scrollY || document.documentElement.scrollTop);
      const scrollHeight = el ? el.scrollHeight : document.documentElement.scrollHeight;
      const clientHeight = el ? el.clientHeight : window.innerHeight;

      const maxScroll = scrollHeight - clientHeight;
      let pct = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
      if (pct < 0) pct = 0;
      if (pct > 100) pct = 100;

      setProgress(pct);
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

  const buttonClass = "w-10 h-10 rounded-[12px] bg-[#252526] hover:bg-[#333333] border border-white/10 hover:border-[var(--linkC,#9aa0a6)] text-white hover:text-[var(--linkC,#9aa0a6)] flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95 group relative";

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Floating Action Menu Container (Fixed Bottom Right - Screenshot 1:1) */}
      <div className="fixed bottom-6 right-6 z-50 flex items-end gap-2.5 select-none">
        {isOpen ? (
          /* 3x3 Grid Menü (Screenshot 1: 1:1 Parity) */
          <div className="grid grid-cols-3 gap-2 p-1 animate-in zoom-in-95 duration-150">
            {/* Satır 1: İçe Aktar, İstatistikler, Koleksiyonlar */}
            <button
              type="button"
              className={buttonClass}
              onClick={() => {
                setIsOpen(false);
                onOpenImportExport();
              }}
              title="İçe Aktar"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <polyline points="9 15 12 18 15 15" />
              </svg>
            </button>

            <button
              type="button"
              className={buttonClass}
              onClick={() => {
                setIsOpen(false);
                if (onOpenTags) onOpenTags();
                else onOpenSearch();
              }}
              title="İstatistikler & Etiketler"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="8" y1="12" x2="8" y2="16" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="16" y1="14" x2="16" y2="16" />
              </svg>
            </button>

            <button
              type="button"
              className={buttonClass}
              onClick={() => {
                setIsOpen(false);
                onOpenCollections();
              }}
              title="Koleksiyonlar"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="18" rx="2" />
                <rect x="14" y="3" width="7" height="8" rx="2" />
                <rect x="14" y="13" width="7" height="8" rx="2" />
              </svg>
            </button>

            {/* Satır 2: Menü / Tüm Bağlantılar, Arama, Ayarlar */}
            <button
              type="button"
              className={buttonClass}
              onClick={() => {
                setIsOpen(false);
                if (onOpenAllLinks) onOpenAllLinks();
                else onOpenSearch();
              }}
              title="Tüm Bağlantılar"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </svg>
            </button>

            <button
              type="button"
              className={buttonClass}
              onClick={() => {
                setIsOpen(false);
                onOpenSearch();
              }}
              title="Gelişmiş Arama"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            <button
              type="button"
              className={buttonClass}
              onClick={() => {
                setIsOpen(false);
                onOpenSettings();
              }}
              title="Ayarlar & Depolama"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>

            {/* Satır 3: Hızlı Yedekle, Yeni Ekle, Kapat */}
            <button
              type="button"
              className={buttonClass}
              onClick={() => {
                setIsOpen(false);
                handleQuickBackup();
              }}
              title="Hızlı JSON Yedek İndir"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29" />
                <polyline points="8 17 12 21 16 17" />
                <line x1="12" y1="12" x2="12" y2="21" />
              </svg>
            </button>

            <button
              type="button"
              className={buttonClass}
              onClick={() => {
                setIsOpen(false);
                onOpenNewLink();
              }}
              title="Yeni Bağlantı Ekle"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </button>

            <button
              type="button"
              className={`${buttonClass} bg-[#282828] text-white hover:text-red-400`}
              onClick={() => setIsOpen(false)}
              title="Menüyü Kapat"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        ) : (
          /* Kapalıyken Tetikleyici Buton */
          <button
            type="button"
            className="w-10 h-10 rounded-[12px] bg-[#252526] hover:bg-[#333333] border border-white/10 text-white hover:text-[var(--linkC,#9aa0a6)] flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95"
            onClick={() => setIsOpen(true)}
            title="Hızlı İşlemler Menüsü"
            aria-label="Hızlı İşlemler"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
        )}

        {/* Scroll to Top / Bottom (.tTb - Screenshot 1 1:1 Yuvarlak Buton) */}
        <button
          type="button"
          onClick={handleScrollToggle}
          className="w-10 h-10 rounded-full bg-[#252526] hover:bg-[#333333] border border-white/15 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95 shrink-0"
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
