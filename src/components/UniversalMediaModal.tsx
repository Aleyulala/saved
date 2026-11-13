import React, { useState, useEffect, useRef } from 'react';

export interface MediaItem {
  type: 'image' | 'youtube' | 'shorts' | 'video';
  url: string;
  title?: string;
  author?: string;
  thumbnail?: string;
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
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isWidescreen, setIsWidescreen] = useState(false);
  const [panPos, setPanPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, posX: 0, posY: 0 });
  const didDragRef = useRef(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(Math.max(0, Math.min(initialIndex, items.length - 1)));
      setZoomLevel(1);
      setRotation(0);
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
        setZoomLevel(prev => prev > 1 ? 1 : 1.8);
        setPanPos({ x: 0, y: 0 });
        return;
      }
      if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        handleZoomIn();
        return;
      }
      if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        handleZoomOut();
        return;
      }
      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleRotateRight();
        return;
      }
      if (e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        handleRotateLeft();
        return;
      }
      if (e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        setIsWidescreen(prev => !prev);
        return;
      }
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        handleToggleFullscreen();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, items.length, currentIndex, zoomLevel]);

  if (!isOpen || !currentItem) return null;

  const handlePrev = () => {
    if (items.length <= 1) return;
    setZoomLevel(1);
    setRotation(0);
    setPanPos({ x: 0, y: 0 });
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
  };

  const handleNext = () => {
    if (items.length <= 1) return;
    setZoomLevel(1);
    setRotation(0);
    setPanPos({ x: 0, y: 0 });
    setCurrentIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.35, 3.5));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => {
      const next = Math.max(prev - 0.35, 1);
      if (next === 1) setPanPos({ x: 0, y: 0 });
      return next;
    });
  };

  const handleRotateRight = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleRotateLeft = () => {
    setRotation(prev => (prev - 90 + 360) % 360);
  };

  const handleDownload = () => {
    if (!currentItem) return;
    const a = document.createElement('a');
    a.href = currentItem.url;
    a.download = (currentItem.title || 'gorsel').replace(/[^a-zA-Z0-9_-]/g, '_') + '.jpg';
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyLink = () => {
    if (!currentItem) return;
    navigator.clipboard.writeText(currentItem.url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel <= 1) return;
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
    if (!isDragging || zoomLevel <= 1) return;
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
      {/* Sağ Üst Araç Çubuğu (Screenshot 3 & 10 1:1: Zoom+, Zoom-, Döndür, İndir, Link, Tam Ekran, Kapat) */}
      <div className="fixed top-3 right-3 sm:top-5 sm:right-6 z-[1000005] flex items-center gap-1.5 sm:gap-2">
        {!isVideo && (
          <>
            {/* Zoom In */}
            <button
              type="button"
              onClick={handleZoomIn}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#181a20]/80 hover:bg-[#252832] border border-white/10 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg backdrop-blur-md active:scale-95"
              title="Yakınlaştır (+)"
              aria-label="Yakınlaştır"
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="11" y1="8" x2="11" y2="14" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </button>

            {/* Zoom Out */}
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoomLevel <= 1}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#181a20]/80 hover:bg-[#252832] border border-white/10 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg backdrop-blur-md active:scale-95 ${
                zoomLevel <= 1 ? 'opacity-40 cursor-not-allowed' : ''
              }`}
              title="Uzaklaştır (-)"
              aria-label="Uzaklaştır"
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </button>

            {/* Sola Döndür */}
            <button
              type="button"
              onClick={handleRotateLeft}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#181a20]/80 hover:bg-[#252832] border border-white/10 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg backdrop-blur-md active:scale-95"
              title="Sola Döndür (L)"
              aria-label="Sola Döndür"
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2.5 2v6h6M2.66 15.57a10 10 0 0 0 .57-8.38l-5.67-5.67" style={{ transform: 'scaleX(-1)', transformOrigin: 'center' }} />
              </svg>
            </button>

            {/* Sağa Döndür */}
            <button
              type="button"
              onClick={handleRotateRight}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#181a20]/80 hover:bg-[#252832] border border-white/10 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg backdrop-blur-md active:scale-95"
              title="Sağa Döndür (R)"
              aria-label="Sağa Döndür"
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
              </svg>
            </button>

            {/* Download */}
            <button
              type="button"
              onClick={handleDownload}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#181a20]/80 hover:bg-[#252832] border border-white/10 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg backdrop-blur-md active:scale-95"
              title="İndir"
              aria-label="İndir"
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
            </button>

            {/* Link / Copy */}
            <button
              type="button"
              onClick={handleCopyLink}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#181a20]/80 hover:bg-[#252832] border border-white/10 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg backdrop-blur-md active:scale-95 ${
                copiedLink ? 'text-[var(--linkC,#9aa0a6)] border-[var(--linkC,#9aa0a6)]' : ''
              }`}
              title={copiedLink ? 'Kopyalandı!' : 'Bağlantıyı Kopyala'}
              aria-label="Bağlantıyı Kopyala"
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </button>
          </>
        )}

        {/* Fullscreen / Widescreen */}
        <button
          type="button"
          onClick={handleToggleFullscreen}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#181a20]/80 hover:bg-[#252832] border border-white/10 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg backdrop-blur-md active:scale-95"
          title="Tam Ekran (F)"
          aria-label="Tam Ekran"
        >
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 3 21 3 21 9" />
            <polyline points="9 21 3 21 3 15" />
            <line x1="21" y1="3" x2="14" y2="10" />
            <line x1="3" y1="21" x2="10" y2="14" />
          </svg>
        </button>

        {/* Kapat Butonu (Screenshot 1:1) */}
        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#181a20]/80 hover:bg-[#252832] border border-white/10 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg backdrop-blur-md active:scale-95"
          title="Kapat (Esc)"
          aria-label="Kapat"
        >
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

      {/* Alt Orta Sayaç & Başlık (Screenshot 3 & 10 1:1: "2 / 10 · Fotoğraf — Videolar & Sinema") */}
      {items.length > 0 && (
        <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-[1000005] text-xs sm:text-[13px] text-white/75 font-medium tracking-wide pointer-events-none select-none text-center">
          {currentIndex + 1} / {items.length} · {currentItem.type === 'image' ? 'Fotoğraf — ' : ''}{currentItem.title || 'Videolar & Sinema'}
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
            className={`max-w-[86vw] max-h-[82vh] rounded-[18px] sm:rounded-[22px] object-contain shadow-2xl transition-transform duration-200 select-none ${
              zoomLevel > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in'
            }`}
            style={{
              transform: `scale(${zoomLevel}) rotate(${rotation}deg) translate(${panPos.x / zoomLevel}px, ${panPos.y / zoomLevel}px)`
            }}
            onMouseDown={handleMouseDown}
            onClick={(e) => {
              e.stopPropagation();
              if (didDragRef.current) {
                didDragRef.current = false;
                return;
              }
              if (zoomLevel === 1) {
                setZoomLevel(1.8);
              } else {
                setZoomLevel(1);
                setPanPos({ x: 0, y: 0 });
              }
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