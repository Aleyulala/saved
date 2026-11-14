import React, { useState, useEffect, useRef } from 'react';
import { CollectionItem } from '../types';
import { TagBloggerIcon } from './BloggerIcons';
import { MediaItem } from './UniversalMediaModal';

export interface BloggerSlide {
  id: string;
  title: string;
  subtitle?: string;
  note?: string;
  category: string;
  collectionName?: string;
  imageUrl: string;
  link?: string;
}

export const BLOGGER_SLIDES: BloggerSlide[] = [
  {
    id: 'Image01',
    title: 'Sinema',
    subtitle: 'Video',
    note: '*Seçkin video kanalları ve oynatma listeleri',
    category: 'videolar',
    collectionName: 'Medya',
    imageUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1920&q=85',
    link: 'https://negronshow.blogspot.com/search/label/videolar'
  },
  {
    id: 'Image02',
    title: 'NSONE',
    subtitle: 'Keşif',
    note: '*Ali Yıldız & Nsone Resmi Bilgi ve Dijital Arşiv Merkezi',
    category: 'öneri',
    collectionName: 'Genel',
    imageUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1920&q=85',
    link: 'https://negronshow.blogspot.com/search/label/%C3%B6neri'
  },
  {
    id: 'Image03',
    title: 'Oyun',
    subtitle: 'Eğlence',
    note: '*Oyun arşivleri ve kaynak bağlantıları',
    category: 'Oyun',
    collectionName: 'Oyun',
    imageUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1920&q=85',
    link: 'https://negronshow.blogspot.com/search/label/oyun'
  },
  {
    id: 'Image04',
    title: 'Sistem',
    subtitle: 'Terminal',
    note: '*Masaüstü ve sistem araçları deposu',
    category: 'Bilgisayar',
    collectionName: 'Araçlar',
    imageUrl: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1920&q=85',
    link: 'https://negronshow.blogspot.com/search/label/bilgisayar'
  },
  {
    id: 'Image05',
    title: 'YapayZeka',
    subtitle: 'İnovasyon',
    note: '*Yapay zeka ve teknoloji yer imleri',
    category: 'Teknoloji',
    collectionName: 'AI',
    imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1920&q=85',
    link: 'https://negronshow.blogspot.com/search/label/teknoloji'
  },
  {
    id: 'Image06',
    title: 'Mobil',
    subtitle: 'Android',
    note: '*Mobil platform rehberleri',
    category: 'Telefon',
    collectionName: 'Web Uygulamaları',
    imageUrl: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=1920&q=85',
    link: 'https://negronshow.blogspot.com/search/label/telefon'
  },
  {
    id: 'Image07',
    title: 'Kod',
    subtitle: 'Yazılım',
    note: '*Küratörlü kod ve programlama kaynakları',
    category: 'Programlama',
    collectionName: 'Programlama',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1920&q=85',
    link: 'https://negronshow.blogspot.com/search/label/programlama'
  },
  {
    id: 'Image08',
    title: 'Medya',
    subtitle: 'Televizyon',
    note: '*Televizyon ve ev eğlence teknolojileri',
    category: 'Televizyon',
    collectionName: 'Medya',
    imageUrl: 'https://images.unsplash.com/photo-1461151304267-38535e780c79?auto=format&fit=crop&w=1920&q=85',
    link: 'https://negronshow.blogspot.com/search/label/televizyon'
  },
  {
    id: 'Image09',
    title: 'Tasarım',
    subtitle: 'Sanat',
    note: '*Dijital sanat ve estetik portfolyolar',
    category: 'Sanat',
    collectionName: 'Genel',
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1920&q=85',
    link: 'https://negronshow.blogspot.com/search/label/sanat'
  },
  {
    id: 'Image10',
    title: 'Finans',
    subtitle: 'Ekonomi',
    note: '*Finans ve e-ticaret araçları',
    category: 'Ticaret',
    collectionName: 'Alışveriş',
    imageUrl: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=1920&q=85',
    link: 'https://negronshow.blogspot.com/search/label/ticaret'
  },
  {
    id: 'Image11',
    title: 'Güvenlik',
    subtitle: 'Kripto',
    note: '*Güvenlik ve gizlilik rehberleri',
    category: 'Güvenlik',
    collectionName: 'Araçlar',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1920&q=85',
    link: 'https://negronshow.blogspot.com/search/label/bilgisayar'
  },
  {
    id: 'Image12',
    title: 'Linux',
    subtitle: 'Çekirdek',
    note: '*Açık kaynak yazılım deposu',
    category: 'Linux',
    collectionName: 'Programlama',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1920&q=85',
    link: 'https://negronshow.blogspot.com/search/label/bilgisayar'
  },
  {
    id: 'Image13',
    title: 'Bilim',
    subtitle: 'Uzay',
    note: '*Bilim ve evren kütüphanesi',
    category: 'Bilim',
    collectionName: 'Genel',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=85',
    link: 'https://negronshow.blogspot.com/search/label/teknoloji'
  },
  {
    id: 'Image14',
    title: 'Müzik',
    subtitle: 'Akustik',
    note: '*Müzik ve ses prodüksiyon araçları',
    category: 'Müzik',
    collectionName: 'Medya',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1920&q=85',
    link: 'https://negronshow.blogspot.com/search/label/videolar'
  },
  {
    id: 'Image15',
    title: 'Sinema',
    subtitle: 'Kamera',
    note: '*Sinema ve kamera rehberleri',
    category: 'Sinema',
    collectionName: 'Medya',
    imageUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1920&q=85',
    link: 'https://negronshow.blogspot.com/search/label/videolar'
  },
  {
    id: 'Image16',
    title: 'Donanım',
    subtitle: 'İşlemci',
    note: '*Donanım mimarisi ve işlemciler',
    category: 'Donanım',
    collectionName: 'Araçlar',
    imageUrl: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1920&q=85',
    link: 'https://negronshow.blogspot.com/search/label/bilgisayar'
  },
  {
    id: 'Image17',
    title: 'VR',
    subtitle: 'Simülasyon',
    note: '*Sanal gerçeklik ve 3D teknolojileri',
    category: 'VR',
    collectionName: 'AI',
    imageUrl: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=1920&q=85',
    link: 'https://negronshow.blogspot.com/search/label/teknoloji'
  },
  {
    id: 'Image18',
    title: 'Espor',
    subtitle: 'Turnuva',
    note: '*E-spor ve rekabetçi oyun kaynakları',
    category: 'Espor',
    collectionName: 'Oyun',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1920&q=85',
    link: 'https://negronshow.blogspot.com/search/label/oyun'
  },
  {
    id: 'Image19',
    title: 'Robotik',
    subtitle: 'Otomasyon',
    note: '*Robotik ve otonom sistemler',
    category: 'Robotik',
    collectionName: 'Teknoloji',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1920&q=85',
    link: 'https://negronshow.blogspot.com/search/label/teknoloji'
  },
  {
    id: 'Image20',
    title: 'Doğa',
    subtitle: 'Manzara',
    note: '*Doğa ve çevre belgeselleri',
    category: 'Doğa',
    collectionName: 'Genel',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=85',
    link: 'https://negronshow.blogspot.com/search/label/genel'
  },
  {
    id: 'Image21',
    title: 'Şehir',
    subtitle: 'Neon',
    note: '*Şehir estetiği ve mimari fotoğraflar',
    category: 'Metropol',
    collectionName: 'Genel',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1920&q=85',
    link: 'https://negronshow.blogspot.com/search/label/genel'
  },
  {
    id: 'Image22',
    title: 'Rutin',
    subtitle: 'Odak',
    note: '*Üretkenlik ve çalışma alışkanlıkları',
    category: 'Rutin',
    collectionName: 'Rutin',
    imageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1920&q=85',
    link: 'https://negronshow.blogspot.com/search/label/rutin'
  },
  {
    id: 'Image23',
    title: 'Arşiv',
    subtitle: 'Kütüphane',
    note: '*Akademi ve dijital kütüphaneler',
    category: 'Eğitim',
    collectionName: 'Eğitim',
    imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1920&q=85',
    link: 'https://negronshow.blogspot.com/search/label/egitim'
  },
  {
    id: 'Image24',
    title: 'Metropol',
    subtitle: 'Mimari',
    note: '*Modern dünya ve şehir portreleri',
    category: 'Kentsel',
    collectionName: 'Genel',
    imageUrl: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1920&q=85',
    link: 'https://negronshow.blogspot.com/search/label/genel'
  },
  {
    id: 'Image25',
    title: 'Retro',
    subtitle: 'Nostalji',
    note: '*Retro teknoloji ve nostalji köşesi',
    category: 'Retro',
    collectionName: 'Oyun',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1920&q=85',
    link: 'https://negronshow.blogspot.com/search/label/oyun'
  }
];

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1920&q=85';


// Tek kelimeye indirgeme yardımcısı
const toSingleWord = (str?: string): string => {
  if (!str) return '';
  const cleaned = str.replace(/&amp;/g, '').replace(/&/g, '').trim();
  const words = cleaned.split(/\s+/).filter(Boolean);
  return words[0] ? words[0].replace(/[,.;:!?]/g, '') : '';
};

interface BloggerHeroSliderProps {
  collections?: CollectionItem[];
  onSelectCollection?: (id: number) => void;
  onFilterTag?: (tag: string) => void;
  onOpenMedia?: (items: MediaItem[], initialIndex?: number) => void;
}

export const BloggerHeroSlider: React.FC<BloggerHeroSliderProps> = ({
  collections = [],
  onSelectCollection,
  onFilterTag,
  onOpenMedia
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  // Blogger .sld-car-nav (updateHeroNav) 1:1: aktif çizgi butonu gezinme YÖNÜNÜ gösterir
  const [navDir, setNavDir] = useState<1 | -1>(1);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const didDrag = useRef(false);

  const activeSlide = BLOGGER_SLIDES[currentIndex];

  // Auto-play interval
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BLOGGER_SLIDES.length);
      setNavDir(1);
    }, 6000);

    return () => clearInterval(timer);
  }, [isPaused]);

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setNavDir(-1);
    setCurrentIndex((prev) => (prev - 1 + BLOGGER_SLIDES.length) % BLOGGER_SLIDES.length);
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setNavDir(1);
    setCurrentIndex((prev) => (prev + 1) % BLOGGER_SLIDES.length);
  };

  // Touch Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
    didDrag.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
    if (touchStartX.current !== null && Math.abs(touchStartX.current - touchEndX.current) > 10) {
      didDrag.current = true;
    }
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 40;

    if (diff > threshold) {
      handleNext();
    } else if (diff < -threshold) {
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Mouse Drag handlers for desktop
  const mouseStartX = useRef<number | null>(null);
  const isMouseDown = useRef(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    isMouseDown.current = true;
    mouseStartX.current = e.clientX;
    didDrag.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown.current || mouseStartX.current === null) return;
    const diff = mouseStartX.current - e.clientX;
    if (Math.abs(diff) > 10) {
      didDrag.current = true;
    }
    if (Math.abs(diff) > 45) {
      if (diff > 0) handleNext();
      else handlePrev();
      isMouseDown.current = false;
      mouseStartX.current = null;
    }
  };

  const handleMouseUp = () => {
    isMouseDown.current = false;
    mouseStartX.current = null;
  };

  const handleOpenViewer = (index: number) => {
    if (onOpenMedia) {
      const items: MediaItem[] = BLOGGER_SLIDES.map((s) => ({
        type: 'image',
        url: s.imageUrl,
        title: s.title
      }));
      onOpenMedia(items, index);
    }
  };

  const handleSlideClick = (index: number) => {
    if (didDrag.current) return;
    handleOpenViewer(index);
  };

  // Navigate to category/collection on click
  const handleCategoryClick = (e: React.MouseEvent, slide: BloggerSlide) => {
    e.stopPropagation();
    if (slide.collectionName && onSelectCollection && collections.length > 0) {
      const targetCol = collections.find(
        (c) => c.name.toLowerCase() === slide.collectionName?.toLowerCase()
      );
      if (targetCol && targetCol.id) {
        onSelectCollection(targetCol.id);
        return;
      }
    }
    if (onFilterTag) {
      onFilterTag(slide.category);
    }
  };

  return (
    <div className="w-full relative select-none">
      <div 
        className="relative w-full overflow-hidden rounded-[14px] bg-[#000000] shadow-lg group aspect-video cursor-pointer touch-pan-y"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => {
          setIsPaused(false);
          handleMouseUp();
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={() => handleSlideClick(currentIndex)}
      >
        {/* Slides list */}
        {BLOGGER_SLIDES.map((slide, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Wallpaper Image (Responsive, razor-sharp, cover) */}
              <img
                src={slide.imageUrl}
                alt={slide.title}
                className="w-full h-full object-cover object-center transform scale-100 group-hover:scale-102 transition-transform duration-700 ease-out"
                loading={idx === 0 ? 'eager' : 'lazy'}
                draggable={false}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src !== FALLBACK_IMAGE) {
                    target.src = FALLBACK_IMAGE;
                  }
                }}
              />

              {/* Gradient overlay for contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/15 pointer-events-none" />
              <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-black/35 to-transparent pointer-events-none" />
            </div>
          );
        })}

        {/* Top-Right: Fullscreen / Zoom Lightbox Action Button (.zmVideoBtn 1:1 Blogger) */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenViewer(currentIndex);
            }}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[rgba(28,30,38,0.78)] hover:bg-[#333333] border border-white/10 text-white flex items-center justify-center transition-all duration-200 active:scale-95 shadow-md backdrop-blur-md cursor-pointer"
            title="Tam Ekran Vitrini"
            aria-label="Tam Ekran Vitrini"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
            </svg>
          </button>
        </div>

        {/* Bottom-Left: Blogger Slider Title & Subtitle (Tek Kelime - Screenshot 1:1) */}
        <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-5 z-20 pointer-events-none text-left">
          <h2 className="text-sm sm:text-base lg:text-lg font-bold text-white tracking-wide drop-shadow-md">
            {toSingleWord(activeSlide.title)}
          </h2>
          {activeSlide.subtitle && (
            <p className="text-[11px] sm:text-xs text-white/80 mt-0.5 max-w-md line-clamp-1 drop-shadow">
              {toSingleWord(activeSlide.subtitle)}
            </p>
          )}
        </div>

        {/* Bottom-Center: Blogger Saved 2 Line Pills (.sld-car-nav) — aktif çizgi YÖNÜ gösterir (Blogger 1:1) */}
        <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {/* Sol Çizgi Buton (car-prev) */}
          <button
            onClick={handlePrev}
            className={`h-2 rounded-full transition-all duration-300 shadow-md backdrop-blur-md cursor-pointer ${
              navDir === -1
                ? 'w-9 bg-[var(--linkC,#9aa0a6)] shadow-[0_0_10px_var(--linkC,#9aa0a6)]'
                : 'w-7 bg-white/40 hover:bg-white/60 hover:scale-110'
            }`}
            aria-label="Önceki Çizgi Buton"
            title="Önceki Slayt"
          />
          {/* Sağ Çizgi Buton (car-next) */}
          <button
            onClick={handleNext}
            className={`h-2 rounded-full transition-all duration-300 shadow-md backdrop-blur-md cursor-pointer ${
              navDir === 1
                ? 'w-9 bg-[var(--linkC,#9aa0a6)] shadow-[0_0_10px_var(--linkC,#9aa0a6)]'
                : 'w-7 bg-white/40 hover:bg-white/60 hover:scale-110'
            }`}
            aria-label="Sonraki Çizgi Buton"
            title="Sonraki Slayt"
          />
        </div>

      </div>
    </div>
  );
};
