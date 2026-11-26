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
  /** true ise doğrudan kayan pencerede açılır */
  initialFloating?: boolean;
}

export const UniversalMediaModal: React.FC<UniversalMediaModalProps> = ({
  isOpen,
  onClose,
  items,
  initialIndex = 0,
  initialFloating = false
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isWidescreen, setIsWidescreen] = useState(false);
  const [panPos, setPanPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const [isFloating, setIsFloating] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  // Kayan pencerenin sürüklenmiş konumu (sağ/alt boşluk, px); cihazda hatırlanır
  const [floatPos, setFloatPos] = useState<{ right: number; bottom: number } | null>(() => {
    try {
      const raw = localStorage.getItem('saved_float_pos_v1');
      if (raw) {
        const v = JSON.parse(raw);
        if (typeof v.right === 'number' && typeof v.bottom === 'number') return v;
      }
    } catch { /* yok say */ }
    return null;
  });
  const floatBoxRef = useRef<HTMLDivElement>(null);
  const floatDragRef = useRef<{ x: number; y: number; right: number; bottom: number } | null>(null);
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
      setIsFloating(!!initialFloating);
    } else {
      setIsFloating(false);
    }
  }, [isOpen, initialIndex, items, initialFloating]);

  const currentItem = items[currentIndex];

  // Başka bir ögeye geçilince görsel hata durumunu sıfırla
  useEffect(() => { setImgFailed(false); }, [currentIndex, currentItem?.url]);

  // Çalan medyayı bildir: yazı içi slaytta o kartın üstünde "Oynatılıyor" görünür
  const nowUrl = isOpen && currentItem && currentItem.type !== 'image' ? currentItem.url : null;
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('saved-now', { detail: nowUrl }));
  }, [nowUrl]);
  useEffect(() => () => { window.dispatchEvent(new CustomEvent('saved-now', { detail: null })); }, []);
  // Ana sayfa slaytı tam ekran açıkken durur
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('saved-modal', { detail: { open: isOpen, floating: isFloating } }));
  }, [isOpen, isFloating]);

  // Medya açıkken arkadaki sayfa kaymasın
  useEffect(() => {
    if (!isOpen || isFloating) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [isOpen, isFloating]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFloating) {
        // Kayan pencere açıkken sayfa kullanılıyor: yalnızca odak pencerenin içindeyse Esc kapatır
        if (e.key === 'Escape' && rootRef.current && rootRef.current.contains(document.activeElement)) {
          e.preventDefault();
          onClose();
        }
        return;
      }
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
  }, [isOpen, items.length, currentIndex, zoomLevel, isFloating]);

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

  const handleTouchStart = (e: React.TouchEvent) => {
    if (zoomLevel <= 1 || e.touches.length !== 1) return;
    setIsDragging(true);
    didDragRef.current = false;
    dragStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      posX: panPos.x,
      posY: panPos.y
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || zoomLevel <= 1 || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - dragStartRef.current.x;
    const dy = e.touches[0].clientY - dragStartRef.current.y;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      didDragRef.current = true;
    }
    setPanPos({
      x: dragStartRef.current.posX + dx,
      y: dragStartRef.current.posY + dy
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
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
      ref={rootRef}
      className={
        isFloating
          ? 'is-floating fixed inset-0 z-[999000] pointer-events-none select-none'
          : 'fixed inset-0 z-[1000000] bg-black flex items-center justify-center select-none animate-in fade-in duration-200'
      }
      style={
        isFloating
          ? undefined
          : { backgroundColor: 'rgba(0, 0, 0, 0.94)', paddingBottom: 'calc(55px + env(safe-area-inset-bottom, 0px))' }
      }
      onClick={(e) => {
        if (!isFloating && e.target === e.currentTarget) {
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
      {!isFloating && (
      <div className="fsToolbar">
        {!isVideo && (
          <>
            {/* Zoom Out */}
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoomLevel <= 1}
              className={`fsToolBtn ${
                zoomLevel <= 1 ? 'opacity-40 cursor-not-allowed' : ''
              }`}
              title="Uzaklaştır (-)"
              aria-label="Uzaklaştır"
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </button>

            {/* Zoom In */}
            <button
              type="button"
              onClick={handleZoomIn}
              className="fsToolBtn"
              title="Yakınlaştır (+)"
              aria-label="Yakınlaştır"
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="11" y1="8" x2="11" y2="14" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </button>

            {/* Sola Döndür (RotateCcw) */}
            <button
              type="button"
              onClick={handleRotateLeft}
              className="fsToolBtn"
              title="Sola Döndür (L)"
              aria-label="Sola Döndür"
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9c-2.52 0-4.93 1-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
            </button>

            {/* Sağa Döndür (RotateCw) */}
            <button
              type="button"
              onClick={handleRotateRight}
              className="fsToolBtn"
              title="Sağa Döndür (R)"
              aria-label="Sağa Döndür"
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
              </svg>
            </button>

            {/* Download */}
            <button
              type="button"
              onClick={handleDownload}
              className="fsToolBtn"
              title="İndir"
              aria-label="İndir"
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </button>

            {/* Link / Copy */}
            <button
              type="button"
              onClick={handleCopyLink}
              className={`fsToolBtn ${
                copiedLink ? 'text-[var(--linkC,#9aa0a6)] border-[var(--linkC,#9aa0a6)]' : ''
              }`}
              title={copiedLink ? 'Kopyalandı!' : 'Bağlantıyı Kopyala'}
              aria-label="Bağlantıyı Kopyala"
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </button>
          </>
        )}

        {/* Kayan pencere: videoyu/fotoğrafı durdurmadan küçük pencereye al, sayfada gezinmeye devam et */}
        <button
          type="button"
          onClick={() => setIsFloating(true)}
          className="fsToolBtn"
          title="Kayan Pencere"
          aria-label="Kayan Pencere"
        >
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="14" rx="2" />
            <rect x="12" y="11" width="7" height="5" rx="1" />
          </svg>
        </button>

        {/* Fullscreen / Widescreen */}
        <button
          type="button"
          onClick={handleToggleFullscreen}
          className="fsToolBtn"
          title="Tam Ekran (F)"
          aria-label="Tam Ekran"
        >
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 3 21 3 21 9" />
            <polyline points="9 21 3 21 3 15" />
            <line x1="21" y1="3" x2="14" y2="10" />
            <line x1="3" y1="21" x2="10" y2="14" />
          </svg>
        </button>
      </div>
      )}

      {/* Sol Ok Butonu (Screenshot 1:1) */}
      {!isFloating && items.length > 1 && (
        <button
          type="button"
          onClick={handlePrev}
          className="fsNavBtn fsPrev"
          title="Önceki (Sol Ok)"
          aria-label="Önceki"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-white/90" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}

      {/* Sağ Ok Butonu (Screenshot 1:1) */}
      {!isFloating && items.length > 1 && (
        <button
          type="button"
          onClick={handleNext}
          className="fsNavBtn fsNext"
          title="Sonraki (Sağ Ok)"
          aria-label="Sonraki"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-white/90" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      )}

      {/* Alt çubuk: #Medya + kapat (paylaş, arama ve diğer pencerelerle aynı) */}
      {!isFloating && (
      <div className="advBottomBar">
        <span className="advBottomTitle">#Medya</span>
        <button
          type="button"
          onClick={onClose}
          className="advBottomClose"
          title="Kapat (Esc)"
          aria-label="Kapat (Esc)"
        >
          <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      )}

      {/* Alt Orta Sayaç & Başlık (Screenshot 3 & 10 1:1: "2 / 10 · Fotoğraf — Videolar & Sinema") */}
      {!isFloating && items.length > 0 && (
        <div className="fsCounter">
          <span>{currentIndex + 1} / {items.length}</span>
          <span>•</span>
          <span>{currentItem.type === 'image' ? 'Fotoğraf — ' : ''}{currentItem.title || 'Videolar & Sinema'}</span>
        </div>
      )}

      {/* Medya İçeriği (Screenshot 1:1: Ortalanmış, rounded-[18px] sm:rounded-[22px] köşe yuvarlaklığı) */}
      <div 
        className={
          isFloating
            ? `fixed z-10 ${isShorts ? 'w-[160px] aspect-[9/16]' : 'w-[260px] min-[897px]:w-[330px] aspect-video'} max-w-[calc(100vw-32px)] pointer-events-auto rounded-2xl overflow-hidden bg-black border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.6)] flex items-center justify-center ${floatPos ? '' : 'right-4 bottom-[calc(66px+env(safe-area-inset-bottom,0px))] min-[897px]:right-6 min-[897px]:bottom-6'}`
            : 'relative flex items-center justify-center max-w-[88vw] max-h-[82vh] overflow-hidden'
        }
        ref={floatBoxRef}
        style={isFloating && floatPos ? { right: floatPos.right, bottom: floatPos.bottom } : undefined}
        onClick={(e) => e.stopPropagation()}
      >
        {currentItem.type === 'image' && imgFailed && (
          <div className="flex flex-col items-center gap-3 px-6 py-10 rounded-[18px] bg-[#1e1e1e] text-center text-[#e8eaed]">
            <p className="text-sm">Görsel yüklenemedi.</p>
            <a
              href={currentItem.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 h-7 inline-flex items-center rounded-[8px] bg-[#56595e] hover:bg-[#62666b] text-[12px] text-white"
            >
              Yeni sekmede aç
            </a>
          </div>
        )}

        {currentItem.type === 'image' && !imgFailed && (
          <img
            onError={() => setImgFailed(true)}
            src={currentItem.url}
            alt={currentItem.title || 'Blogger Görsel'}
            className={`${isFloating ? 'w-full h-full object-cover rounded-none' : 'max-w-[86vw] max-h-[82vh] rounded-[18px] sm:rounded-[22px]'} object-contain shadow-2xl transition-transform duration-200 select-none ${
              zoomLevel > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in'
            }`}
            style={{
              transform: `scale(${zoomLevel}) rotate(${rotation}deg) translate(${panPos.x / zoomLevel}px, ${panPos.y / zoomLevel}px)`,
              touchAction: zoomLevel > 1 ? 'none' : 'pan-y pinch-zoom'
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
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
              isFloating
                ? (isShorts ? 'w-[150px] aspect-[9/16]' : 'w-full aspect-video')
                : isShorts && !isWidescreen 
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
              isFloating ? 'w-full aspect-video' : isWidescreen 
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

        {isFloating && (
          <>
            {/* Sürükleme tutacağı (iframe'ler dokunmayı yuttuğu için üst şerit) */}
            <div
              className="absolute top-0 left-0 right-0 h-9 z-10 cursor-grab active:cursor-grabbing touch-none bg-gradient-to-b from-black/55 to-transparent"
              onPointerDown={(e) => {
                const box = floatBoxRef.current;
                if (!box || (e.target as HTMLElement).closest('button')) return;
                const r = box.getBoundingClientRect();
                floatDragRef.current = {
                  x: e.clientX, y: e.clientY,
                  right: window.innerWidth - r.right,
                  bottom: window.innerHeight - r.bottom
                };
                (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
              }}
              onPointerMove={(e) => {
                const d = floatDragRef.current;
                const box = floatBoxRef.current;
                if (!d || !box) return;
                const w = box.offsetWidth, h = box.offsetHeight;
                const right = Math.max(8, Math.min(window.innerWidth - w - 8, d.right - (e.clientX - d.x)));
                const bottom = Math.max(8, Math.min(window.innerHeight - h - 8, d.bottom - (e.clientY - d.y)));
                setFloatPos({ right, bottom });
              }}
              onPointerUp={() => {
                if (floatDragRef.current) {
                  floatDragRef.current = null;
                  try { if (floatPos) localStorage.setItem('saved_float_pos_v1', JSON.stringify(floatPos)); } catch { /* yok say */ }
                }
              }}
              onPointerCancel={() => { floatDragRef.current = null; }}
            >
              <div className="mx-auto mt-1.5 w-8 h-1 rounded-full bg-white/40" />
            </div>
            <div className="absolute top-1.5 right-1.5 z-20 flex items-center gap-1.5">
              {items.length > 1 && (
                <>
                  <button type="button" onClick={() => setCurrentIndex((currentIndex - 1 + items.length) % items.length)} className="w-7 h-7 inline-flex items-center justify-center rounded-lg bg-black/65 hover:bg-black/85 text-white border border-white/15 cursor-pointer" title="Önceki" aria-label="Önceki">
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                  </button>
                  <button type="button" onClick={() => setCurrentIndex((currentIndex + 1) % items.length)} className="w-7 h-7 inline-flex items-center justify-center rounded-lg bg-black/65 hover:bg-black/85 text-white border border-white/15 cursor-pointer" title="Sonraki" aria-label="Sonraki">
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                  </button>
                </>
              )}
              <button type="button" onClick={() => setIsFloating(false)} className="w-7 h-7 inline-flex items-center justify-center rounded-lg bg-black/65 hover:bg-black/85 text-white border border-white/15 cursor-pointer" title="Tam ekrana büyüt" aria-label="Tam ekrana büyüt">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" /></svg>
              </button>
              <button type="button" onClick={onClose} className="w-7 h-7 inline-flex items-center justify-center rounded-lg bg-black/65 hover:bg-red-500/90 text-white border border-white/15 cursor-pointer" title="Kapat" aria-label="Kayan pencereyi kapat">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};