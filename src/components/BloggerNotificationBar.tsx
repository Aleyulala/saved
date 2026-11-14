import React, { useState, useEffect, useRef } from 'react';
import { X, MessageCircle, Send } from 'lucide-react';

/**
 * nsone.xml LinkList06 'Bildiri' birebir karşılığı:
 * - Slayt 0: ALİ & NSONE sekmeleri (LinkList05 'Sekmeli Menü')
 * - Slayt 1: #Sohbet (href='#comments') → yorumlar/sohbet çekmecesini açar
 * - Slayt 2: #İletişim (href='#ContactForm2') → iletişim formunu açar
 * - Kapatınca localStorage'a yazılır, 1 gün (86400 sn) boyunca gizli kalır
 */
const DISMISS_KEY = 'SAVED_NOTIFICATION_DISMISS';
const DISMISS_MAX_AGE_MS = 86400 * 1000;

interface BloggerNotificationBarProps {
  onOpenChat?: () => void;
  onOpenContact?: () => void;
}

const isDismissed = (): boolean => {
  try {
    const raw = localStorage.getItem(DISMISS_KEY);
    if (raw) {
      const ts = Number(raw);
      if (Number.isFinite(ts) && Date.now() - ts < DISMISS_MAX_AGE_MS) return true;
      localStorage.removeItem(DISMISS_KEY);
    }
  } catch {
    /* localStorage yoksa bildiri her zaman gösterilir */
  }
  return false;
};

export const BloggerNotificationBar: React.FC<BloggerNotificationBarProps> = ({
  onOpenChat,
  onOpenContact
}) => {
  const [isVisible, setIsVisible] = useState(() => !isDismissed());
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const totalSlides = 3;

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % totalSlides);
    }, 7000);
    return () => clearInterval(timer);
  }, [totalSlides, isPaused]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 35) {
      setActiveSlide((prev) => (prev + 1) % totalSlides);
    } else if (diff < -35) {
      setActiveSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    }
    touchStartX.current = null;
  };

  const handleDismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      /* yoksay */
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="w-full mb-4">
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="ntfC flex items-center justify-between gap-3 px-4 py-2 rounded-[14px] bg-[#252526] border border-transparent shadow-sm select-none min-h-[46px] touch-pan-y"
      >

        {/* Sol Kapat Butonu */}
        <button
          onClick={handleDismiss}
          className="p-1 rounded-full text-[#9ca3af] opacity-75 hover:opacity-100 hover:text-white hover:bg-[#333333] transition-colors shrink-0 cursor-pointer"
          title="Bildirimi Gizle (1 gün)"
          aria-label="Kapat"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Orta Slayt İçeriği (.bar-slider) */}
        <div className="flex-1 overflow-hidden flex items-center justify-center text-center">

          {/* SLAYT 0: ALİ & NSONE (LinkList05 'Sekmeli Menü' 1:1) */}
          {activeSlide === 0 && (
            <div className="ali-nsone-text-wrap inline-flex items-center justify-center gap-3 sm:gap-4 select-none animate-in fade-in duration-300">
              <a
                href="https://aleyulala.blogspot.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="ali-nsone-slide-btn font-bold text-sm sm:text-[15px] tracking-[0.12em] uppercase text-white hover:text-[var(--linkC,#9aa0a6)] transition-colors cursor-pointer"
                title="ALİ"
              >
                ALİ
              </a>
              <a
                href="https://aleyulala.github.io/saved/"
                className="ali-nsone-amp font-bold text-sm sm:text-[15px] text-[var(--linkC,#9aa0a6)] px-1.5 py-0.5 rounded-md hover:bg-white/10 transition-all cursor-pointer"
                title="ALİ &amp; NSONE"
              >
                &amp;
              </a>
              <a
                href="https://negronshow.blogspot.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="ali-nsone-slide-btn font-bold text-sm sm:text-[15px] tracking-[0.12em] uppercase text-white hover:text-[var(--linkC,#9aa0a6)] transition-colors cursor-pointer"
                title="NSONE"
              >
                NSONE
              </a>
            </div>
          )}

          {/* SLAYT 1: #Sohbet (href='#comments') → sohbet çekmecesini açar */}
          {activeSlide === 1 && (
            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm animate-in fade-in duration-300">
              <a
                href={onOpenChat ? '#Sohbet' : 'https://matrix.to/#/#negronn-show:matrix.org'}
                target={onOpenChat ? undefined : '_blank'}
                rel={onOpenChat ? undefined : 'noopener noreferrer'}
                onClick={onOpenChat ? (e) => { e.preventDefault(); onOpenChat(); } : undefined}
                className="ntf-contact-text inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--linkC,#9aa0a6)] hover:text-white transition-colors cursor-pointer"
                title="#Sohbet — Sohbet çekmecesini açar"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span className="font-bold">#</span>
                <span className="text-white">Sohbet</span>
              </a>
            </div>
          )}

          {/* SLAYT 2: #İletişim → Google Apps Script İletişim & Katıl Kapısı */}
          {activeSlide === 2 && (
            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm animate-in fade-in duration-300">
              <a
                href="https://script.google.com/macros/s/AKfycbwcZprdS6F_jJ6nin0YalTKweQKP4t936UgrTnme-d5gA-qHbi986vh6HxdzvA236Of/exec"
                target="_blank"
                rel="noopener noreferrer"
                className="ntf-contact-text inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--linkC,#9aa0a6)] hover:text-white transition-colors cursor-pointer"
                title="#İletişim — İletişim & Katıl Kapısını Açar"
              >
                <Send className="w-4 h-4 shrink-0" />
                <span className="font-bold">#</span>
                <span className="text-white">İletişim</span>
              </a>
            </div>
          )}

        </div>

        {/* Sağ Çizgi Butonlar (.panel-slider-dots .ntfSliderDots) — Blogger 1:1: 2 tırnak, sağa/sola çevirir */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setActiveSlide((prev) => (prev - 1 + totalSlides) % totalSlides)}
            className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
              activeSlide === 0
                ? 'w-6 bg-[var(--linkC,#9aa0a6)]'
                : 'w-3.5 bg-white/20 hover:bg-white/40'
            }`}
            title="Önceki (Sekmeler)"
            aria-label="Önceki Slayt"
          />
          <button
            onClick={() => setActiveSlide((prev) => (prev + 1) % totalSlides)}
            className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
              activeSlide !== 0
                ? 'w-6 bg-[var(--linkC,#9aa0a6)]'
                : 'w-3.5 bg-white/20 hover:bg-white/40'
            }`}
            title="Sonraki (İletişim)"
            aria-label="Sonraki Slayt"
          />
        </div>

      </div>
    </div>
  );
};
