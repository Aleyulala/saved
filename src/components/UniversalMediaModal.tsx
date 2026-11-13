import React, { useState, useEffect, useRef } from 'react';

export interface MediaItem {
  type: 'image' | 'youtube' | 'shorts' | 'video';
  url: string;
  title?: string;
  author?: string;
}

interface UniversalMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: MediaItem[];
  initialIndex?: number;
}

export const UniversalMediaModal: React.FC<UniversalMediaModalProps> = ({
  isOpen,
  onClose,
  items,
  initialIndex = 0
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isWidescreen, setIsWidescreen] = useState(false);
  const [panPos, setPanPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, posX: 0, posY: 0 });
  const didDragRef = useRef(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(Math.max(0, Math.min(initialIndex, items.length - 1)));
      setIsZoomed(false);
      setIsWidescreen(false);
      setPanPos({ x: 0, y: 0 });
      didDragRef.current = false;
    }
  }, [isOpen, initialIndex, items]);

  const currentItem = items[currentIndex];

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
        return;
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
        return;
      }
      if (e.key === 'z' || e.key === 'Z') {
        e.preventDefault();
        handleToggleZoom();
        return;
      }
      if (e.key === 'w' || e.key === 'W' || e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        setIsWidescreen(prev => !prev);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, items.length, currentIndex]);

  if (!isOpen || !currentItem) return null;

  const handlePrev = () => {
    if (items.length <= 1) return;
    setIsZoomed(false);
    setIsWidescreen(false);
    setPanPos({ x: 0, y: 0 });
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
  };

  const handleNext = () => {
    if (items.length <= 1) return;
    setIsZoomed(false);
    setIsWidescreen(false);
    setPanPos({ x: 0, y: 0 });
    setCurrentIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isZoomed) return;
    setIsDragging(true);
    didDragRef.current = false;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      posX: panPos.x,
      posY: panPos.y
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !isZoomed) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      didDragRef.current = true;
    }
    setPanPos({
      x: dragStartRef.current.posX + dx,
      y: dragStartRef.current.posY + dy
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleToggleZoom = () => {
    setIsZoomed((prev) => !prev);
    setPanPos({ x: 0, y: 0 });
  };

  // YouTube embed url formatter
  const getEmbedUrl = (url: string) => {
    try {
      if (url.includes('youtube.com/embed/')) return url;
      if (url.includes('youtube.com/shorts/')) {
        const id = url.split('/shorts/')[1]?.split(/[?#&]/)[0];
        return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
      }
      if (url.includes('watch?v=')) {
        const id = new URL(url).searchParams.get('v');
        return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
      }
      if (url.includes('youtu.be/')) {
        const id = url.split('youtu.be/')[1]?.split(/[?#&]/)[0];
        return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
      }
    } catch {
      // ignore
    }
    return url;
  };

  const isVideo = currentItem.type === 'youtube' || currentItem.type === 'shorts' || currentItem.type === 'video';
  const isShorts = currentItem.type === 'shorts';

  return (
    <div
      id="fsMediaModal"
      className="fixed inset-0 z-[1000000] bg-black flex items-center justify-center select-none animate-in fade-in duration-200"
      style={{ backgroundColor: '#000000' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Blogger Medya Vitrini"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Sağ Üst Kontrol Butonları (Büyüteç / Zoom + Kapat Butonu - Screenshot 1:1) */}
      <div className="fixed top-4 right-4 sm:top-5 sm:right-6 z-[1000005] flex items-center gap-2">
        {!isVideo ? (
          <button
            type="button"
            onClick={handleToggleZoom}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#181a20]/80 hover:bg-[#252832] border border-white/10 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg backdrop-blur-md active:scale-95 ${
              isZoomed ? 'text-[var(--linkC,#9aa0a6)] border-[var(--linkC,#9aa0a6)]/50' : ''
            }`}
            title={isZoomed ? 'Küçült (Z)' : 'Büyüt (Z)'}
            aria-label="Yakınlaştırma"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              {isZoomed ? (
                <line x1="8" y1="11" x2="14" y2="11" />
              ) : (
                <>
                  <line x1="11" y1="8" x2="11" y2="14" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </>
              )}
            </svg>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIsWidescreen(prev => !prev)}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#181a20]/80 hover:bg-[#252832] border border-white/10 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg backdrop-blur-md active:scale-95"
            title={isWidescreen ? 'Standart Boyut (W)' : 'Geniş Ekran (W)'}
            aria-label="Geniş Ekran Modu"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 3 21 3 21 9" />
              <polyline points="9 21 3 21 3 15" />
              <line x1="21" y1="3" x2="14" y2="10" />
              <line x1="3" y1="21" x2="10" y2="14" />
            </svg>
          </button>
        )}

        {/* Kapat Butonu (Screenshot 1:1) */}
        <button
          type="button"
          onClick={onClose}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#181a20]/80 hover:bg-[#252832] border border-white/10 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg backdrop-blur-md active:scale-95"
          title="Kapat (Esc)"
          aria-label="Kapat"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Sol Ok Butonu (Screenshot 1:1) */}
      {items.length > 1 && (
        <button
          type="button"
          onClick={handlePrev}
          className="fixed left-3 sm:left-6 top-1/2 -translate-y-1/2 z-[1000005] w-8 h-10 sm:w-9 sm:h-12 rounded-xl bg-[#181a20]/75 hover:bg-[#252832] border border-white/10 text-white/90 hover:text-white flex items-center justify-center text-xl font-bold transition-all cursor-pointer shadow-lg backdrop-blur-md active:scale-95"
          title="Önceki (Sol Ok)"
          aria-label="Önceki"
        >
          ‹
        </button>
      )}

      {/* Sağ Ok Butonu (Screenshot 1:1) */}
      {items.length > 1 && (
        <button
          type="button"
          onClick={handleNext}
          className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-[1000005] w-8 h-10 sm:w-9 sm:h-12 rounded-xl bg-[#181a20]/75 hover:bg-[#252832] border border-white/10 text-white/90 hover:text-white flex items-center justify-center text-xl font-bold transition-all cursor-pointer shadow-lg backdrop-blur-md active:scale-95"
          title="Sonraki (Sağ Ok)"
          aria-label="Sonraki"
        >
          ›
        </button>
      )}

      {/* Alt Orta Sayaç & Başlık (Screenshot 1:1: "1 / 10 · Videolar & Sinema") */}
      {items.length > 0 && (
        <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-[1000005] text-xs sm:text-[13px] text-white/70 font-medium tracking-wide pointer-events-none select-none text-center">
          {currentIndex + 1} / {items.length} · {currentItem.title || 'Videolar & Sinema'}
        </div>
      )}

      {/* Medya İçeriği (Screenshot 1:1: Ortalanmış, rounded-[18px] sm:rounded-[22px] köşe yuvarlaklığı) */}
      <div 
        className="relative flex items-center justify-center max-w-[88vw] max-h-[82vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {currentItem.type === 'image' && (
          <img
            src={currentItem.url}
            alt={currentItem.title || 'Blogger Görsel'}
            className={`max-w-[86vw] max-h-[82vh] rounded-[18px] sm:rounded-[22px] object-contain shadow-2xl transition-transform duration-300 select-none ${
              isZoomed ? 'scale-150 sm:scale-175 cursor-grab active:cursor-grabbing' : 'cursor-zoom-in'
            }`}
            style={
              isZoomed
                ? {
                    transform: `scale(1.75) translate(${panPos.x / 1.75}px, ${panPos.y / 1.75}px)`
                  }
                : undefined
            }
            onMouseDown={handleMouseDown}
            onClick={(e) => {
              e.stopPropagation();
              if (didDragRef.current) {
                didDragRef.current = false;
                return;
              }
              handleToggleZoom();
            }}
            draggable={false}
          />
        )}

        {(currentItem.type === 'youtube' || currentItem.type === 'shorts') && (
          <div
            className={`relative rounded-[18px] overflow-hidden bg-black shadow-2xl ${
              isShorts && !isWidescreen 
                ? 'w-[min(85vh*9/16,400px)] aspect-[9/16]' 
                : isWidescreen 
                  ? 'w-[min(94vw,1200px)] aspect-video' 
                  : 'w-[min(88vw,960px)] aspect-video'
            }`}
          >
            <iframe
              src={getEmbedUrl(currentItem.url)}
              title={currentItem.title || 'Blogger Video Player'}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        )}

        {currentItem.type === 'video' && (
          <div
            className={`relative rounded-[18px] overflow-hidden bg-black shadow-2xl ${
              isWidescreen 
                ? 'w-[min(94vw,1200px)] aspect-video' 
                : 'w-[min(88vw,960px)] aspect-video'
            }`}
          >
            <video
              src={currentItem.url}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-contain"
            />
          </div>
        )}
      </div>
    </div>
  );
};
