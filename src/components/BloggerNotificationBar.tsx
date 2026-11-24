import React, { useState, useEffect, useRef } from 'react';
import { CloseIcon, ChatBloggerIcon, SmsEditIcon } from './BloggerIcons';

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
    <div className="w-full mb-[23px]">
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="ntfC ntfBar select-none touch-pan-y"
      >

        {/* Sol Kapat Butonu */}
        <button
          type="button"
          onClick={handleDismiss}
          className="c ntfClose"
          title="Bildirimi Gizle (1 gün)"
          aria-label="Kapat"
        >
          <CloseIcon className="" />
        </button>

        {/* Orta Slayt İçeriği (.bar-slider) */}
        <div className="bar-slider">

          {/* SLAYT 0: ALİ & NSONE (LinkList05 'Sekmeli Menü' 1:1) */}
          {activeSlide === 0 && (
            <div className="ali-nsone-text-wrap select-none bar-slide-in">
              <a
                href="https://aleyulala.blogspot.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="ali-nsone-slide-btn"
                title="ALİ"
              >
                ALİ
              </a>
              <a
                href="https://aleyulala.github.io/saved/"
                className="ali-nsone-amp"
                title="ALİ &amp; NSONE"
              >
                &amp;
              </a>
              <a
                href="https://negronshow.blogspot.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="ali-nsone-slide-btn"
                title="NSONE"
              >
                NSONE
              </a>
            </div>
          )}

          {/* SLAYT 1: #Sohbet (href='#comments') → sohbet çekmecesini açar */}
          {activeSlide === 1 && (
            <div className="bar-slide-in">
              <a
                href={onOpenChat ? '#Sohbet' : 'https://matrix.to/#/#negronn-show:matrix.org'}
                target={onOpenChat ? undefined : '_blank'}
                rel={onOpenChat ? undefined : 'noopener noreferrer'}
                onClick={onOpenChat ? (e) => { e.preventDefault(); onOpenChat(); } : undefined}
                className="ntf-contact-text"
                title="#Sohbet — Sohbet çekmecesini açar"
              >
                <ChatBloggerIcon className="" />
                <span><span className="punct-mark">#</span>Sohbet</span>
              </a>
            </div>
          )}

          {/* SLAYT 2: #İletişim → Google Apps Script İletişim & Katıl Kapısı */}
          {activeSlide === 2 && (
            <div className="bar-slide-in">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  onOpenContact?.();
                }}
                className="ntf-contact-text"
                title="#İletişim — İletişim & Katıl Kapısını Açar"
              >
                <SmsEditIcon className="" />
                <span><span className="punct-mark">#</span>İletişim</span>
              </button>
            </div>
          )}

        </div>

        {/* Sağ Çizgi Butonlar (.panel-slider-dots .ntfSliderDots) — Blogger 1:1: 2 tırnak, sağa/sola çevirir */}
        <div className="panel-slider-dots" aria-hidden="true" title="Sekmeler & Bildiri Slaytı">
          <button
            type="button"
            onClick={() => setActiveSlide((prev) => (prev - 1 + totalSlides) % totalSlides)}
            className={`dot${activeSlide === 0 ? ' active' : ''}`}
            title="Önceki (Sekmeler)"
            aria-label="Önceki Slayt"
          />
          <button
            type="button"
            onClick={() => setActiveSlide((prev) => (prev + 1) % totalSlides)}
            className={`dot${activeSlide !== 0 ? ' active' : ''}`}
            title="Sonraki (İletişim)"
            aria-label="Sonraki Slayt"
          />
        </div>

      </div>
    </div>
  );
};
