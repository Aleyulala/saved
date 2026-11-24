import { createPortal } from 'react-dom';
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Check, 
  Copy, 
  ChevronLeft, 
  ChevronRight,
  FileText
} from 'lucide-react';
import { CollectionItem, LinkItem } from '../types';
import { formatDate, getDomain, getFaviconUrl } from '../utils/favicon';
import { 
  Verify1Icon, 
  ArchiveIcon,
  ArchiveAddIcon, 
  ArchiveTickIcon, 
  EmojiHappyIcon, 
  BloggerEyeIcon,
  ChatBloggerIcon,
  Share1Icon,
  CloseIcon,
  FacebookIcon,
  WhatsappIcon,
  TwitterIcon,
  TelegramIcon,
  MailIcon
} from './BloggerIcons';
import { MediaItem } from './UniversalMediaModal';
import { getAuthorData } from '../utils/bloggerAuthors';
import { extractPostMedia } from '../utils/mediaExtractor';
import { LinkCard } from './LinkCard';
import { BrandLogoCard } from './BrandLogoCard';

interface BloggerPostViewProps {
  link: LinkItem;
  allLinks: LinkItem[];
  collection?: CollectionItem;
  onBack: () => void;
  onNavigatePost: (link: LinkItem) => void;
  onTogglePin: (id: number, current: boolean) => void;
  onToggleRead: (id: number, current: boolean) => void;
  onToggleArchive: (id: number, current: boolean) => void;
  onMoveToTrash: (id: number) => void;
  onEdit: (link: LinkItem) => void;
  onOpenMedia?: (items: MediaItem[], initialIndex?: number) => void;
}

export const BloggerPostView: React.FC<BloggerPostViewProps> = ({
  link,
  allLinks,
  collection,
  onBack,
  onNavigatePost,
  onTogglePin,
  onOpenMedia
}) => {
  const [copied, setCopied] = useState(false);
  // Otomatik Medya ve Video Çıkarıcı (Extractor: Asla Central Cinema fallback kullanmaz)
  const postMedia = useMemo(() => extractPostMedia(link), [link]);
  const primaryImage = postMedia.primaryImage;
  const mediaItems = postMedia.items;
  const hasRealMedia = mediaItems.some((it: MediaItem) => !!it.url && it.url.trim().length > 0) || (!!primaryImage && primaryImage.trim().length > 0);
  const [activeTab, setActiveTab] = useState<'medya' | 'yazi'>('medya');
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number>(0);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const activeLinks = allLinks.filter(l => !l.isTrash && !l.isArchived);
  const currentIndex = activeLinks.findIndex(l => l.id === link.id);
  const prevLink = currentIndex > 0 ? activeLinks[currentIndex - 1] : (activeLinks.length > 1 ? activeLinks[1] : null);

  const currentAuthor = getAuthorData(link.authorName || 'Ali');
  const [authorImgError, setAuthorImgError] = useState(false);
  const authorInitial = (currentAuthor.name || 'A').charAt(0).toUpperCase();

  // Greeting
  // Blogdaki saat kuralı: <4 İyi uykular, <12 Günaydın, <17 İyi günler, <22 İyi akşamlar, sonrası İyi geceler
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 4) return 'İyi uykular!';
    if (h < 12) return 'Günaydın!';
    if (h < 17) return 'İyi günler!';
    if (h < 22) return 'İyi akşamlar!';
    return 'İyi geceler!';
  })();

  // Ticker bar states
  const otherPosts = allLinks.filter(l => l.id !== link.id && !l.isTrash);
  const [tickerIndex, setTickerIndex] = useState(0);
  const [isTickerVisible, setIsTickerVisible] = useState(true);
  const currentTickerPost = otherPosts.length > 0 ? otherPosts[tickerIndex % otherPosts.length] : null;

  const handleNextTicker = () => {
    if (otherPosts.length > 0) {
      setTickerIndex(prev => (prev + 1) % otherPosts.length);
    }
  };

  const handlePrevTicker = () => {
    if (otherPosts.length > 0) {
      setTickerIndex(prev => (prev - 1 + otherPosts.length) % otherPosts.length);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(link.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareUrl = encodeURIComponent(link.url);
  const shareTitle = encodeURIComponent(link.title);

  const currentMedia = mediaItems[selectedMediaIndex] || mediaItems[0] || (primaryImage ? { type: 'image' as const, url: primaryImage, title: link.title } : null);

  useEffect(() => {
    setActiveTab('medya');
    setSelectedMediaIndex(0);
  }, [link.id]);

  // Benzer Yazılar: Önce aynı kategori/etikete sahip yazılar, yetmezse diğer aktif yazılar
  const relatedPosts = useMemo(() => {
    const others = activeLinks.filter(l => l.id !== link.id);
    const primaryTag = link.tags && link.tags[0];
    if (!primaryTag) return others.slice(0, 3);

    const sameTag = others.filter(l => l.tags && l.tags.includes(primaryTag));
    const differentTag = others.filter(l => !l.tags || !l.tags.includes(primaryTag));
    return [...sameTag, ...differentTag].slice(0, 3);
  }, [activeLinks, link.id, link.tags]);

  return (
    <article className="space-y-5 max-w-[840px] mx-auto animate-in fade-in duration-200 select-none pb-12">
      
      {/* 1. Ticker Paneli (#ticker-wrapper - Screenshot 4 & 8: 1:1 Fedora / Linux Adobe Stili) */}
      {isTickerVisible && currentTickerPost && (
        <div className="ntfC ntfBar select-none" style={{ marginBottom: 47 }}>
          <button
            type="button"
            onClick={() => setIsTickerVisible(false)}
            className="c ntfClose"
            title="Kapat"
            aria-label="Kapat"
          >
            <CloseIcon className="" />
          </button>

          <div className="bar-slider">
            <span
              onClick={() => onNavigatePost(currentTickerPost)}
              className="ntf-contact-text bar-slide-in"
              title={currentTickerPost.title}
            >
              {currentTickerPost.title}
            </span>
          </div>

          <div className="panel-slider-dots" aria-hidden="true">
            <button type="button" onClick={handlePrevTicker} className="dot" aria-label="Önceki" />
            <button type="button" onClick={handleNextTicker} className="dot active" aria-label="Sonraki" />
          </div>
        </div>
      )}

      {/* 2. Page Views & Greetings Rozetleri (.pGV - Screenshot 1 & 4 1:1) */}
      <div className="pGV flex items-center pt-0.5">
        <span className="pgChip">
          <BloggerEyeIcon />
          <span>{link.views || 78} views</span>
        </span>

        <span className="pgChip">
          <EmojiHappyIcon />
          <span>{greeting}</span>
        </span>
      </div>

      {/* 3. Blogger XML 1:1 Breadcrumbs (.brdCmb) */}
      <div className="brdCmb">
        <button type="button" onClick={onBack} className="brdHm">Ana Sayfa</button>
        <span className="brdLb">{link.tags[0] || collection?.name || 'videolar'}</span>
      </div>

      {/* 4. Gönderi Ana Başlığı (.pTtl - Screenshot 1 & 4 1:1) */}
      <h1 className="pTtl">
        {link.title}
      </h1>

      {/* 5. Sekmeler: Medya / Yazı (Screenshot 1 & 4 1:1) */}
      <div className="pTabs">
        <button type="button" onClick={() => setActiveTab('medya')} className={activeTab === 'medya' ? 'on' : ''}>Medya</button>
        <button type="button" onClick={() => setActiveTab('yazi')} className={activeTab === 'yazi' ? 'on' : ''}>Yazı</button>
      </div>

      {/* 6. Medya Sekmesi İçeriği (Screenshot 4: Thumbnail Seçici + Büyük Görsel + Tam Ekran Butonu) */}
      {activeTab === 'medya' && (
        <div className="space-y-4 pt-1">
          {/* Üst Küçük Önizleme Kutucukları (Fotoğraf / Video Seçici) - Blogger Plu$ UI: Yalnızca 2 veya daha fazla farklı medya varsa gösterilir */}
          {mediaItems.length >= 2 && (
            <div className="flex items-center gap-3">
              {mediaItems.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedMediaIndex(idx)}
                  className={`w-[108px] h-[62px] rounded-[10px] overflow-hidden border-2 transition-all cursor-pointer relative ${
                    selectedMediaIndex === idx ? 'border-[#e8eaed]' : 'border-transparent opacity-90 hover:opacity-100'
                  }`}
                  title={item.type === 'image' ? 'Görseli Göster' : 'Videoyu Oynat'}
                >
                  {item.type === 'image' ? (
                    <img 
                      src={item.url} 
                      alt={item.title || `Görsel ${idx + 1}`} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (target.src.includes('maxresdefault.jpg')) {
                          target.src = target.src.replace('maxresdefault.jpg', 'hqdefault.jpg');
                        } else {
                          target.style.display = 'none';
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-[#252526] flex items-center justify-center relative">
                      <svg viewBox="0 0 24 24" className="w-5 h-5 text-white/90 fill-white/80">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Büyük Görsel / Medya Alanı */}
          <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-[16px] overflow-hidden bg-[#18181b] border border-white/5 shadow-2xl group">
            {hasRealMedia && currentMedia?.url ? (
              currentMedia.type === 'image' ? (
                <img
                  src={currentMedia.url}
                  alt={currentMedia.title || link.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center cursor-pointer"
                  onClick={() => onOpenMedia && onOpenMedia(mediaItems, selectedMediaIndex)}
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src.includes('maxresdefault.jpg')) {
                      target.src = target.src.replace('maxresdefault.jpg', 'hqdefault.jpg');
                    }
                  }}
                />
              ) : (currentMedia.type === 'youtube' || currentMedia.type === 'shorts') ? (
                <iframe
                  src={currentMedia.url}
                  title={currentMedia.title || link.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <video
                  src={currentMedia.url}
                  controls
                  autoPlay
                  className="w-full h-full object-contain bg-black"
                />
              )
            ) : (
              /* Medya Yoksa: Karta basınca doğrudan web sitesine gider (Web Sitesine Git butonu kaldırıldı) */
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-full relative block cursor-pointer group no-underline transition-all duration-200 active:scale-[0.99]"
                title={`${link.title || link.url} Sitesine Git`}
              >
                <BrandLogoCard url={link.url} title={link.title} size="detail" />
              </a>
            )}

            {/* Sağ Üst Köşe: Tam Ekran Genişlet Butonu (Screenshot 4 & 5 1:1) - Sadece gerçek medya varsa gösterilir */}
            {hasRealMedia && currentMedia?.url && (
              <div className="absolute top-3 right-3 z-10">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onOpenMedia) {
                      onOpenMedia(mediaItems, selectedMediaIndex);
                    }
                  }}
                  className="w-8 h-8 rounded-lg bg-[rgba(28,30,38,0.85)] hover:bg-[#333333] border border-white/15 text-white flex items-center justify-center transition-all cursor-pointer shadow-md backdrop-blur-md active:scale-95"
                  title="Görseli Tam Ekran Yap"
                  aria-label="Tam Ekran"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                  </svg>
                </button>
              </div>
            )}

            {/* Alt Çizgi / Slayt Noktaları */}
            {mediaItems.length >= 2 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 pointer-events-none">
                {mediaItems.map((_, dotIdx) => (
                  <span
                    key={dotIdx}
                    className={`transition-all rounded-full ${
                      dotIdx === selectedMediaIndex ? 'w-5 h-1.5 bg-white/90' : 'w-1.5 h-1.5 bg-white/40'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6.1. Yazı Sekmesi İçeriği (Makale Metni) */}
      {activeTab === 'yazi' && (
        <div className="rounded-[16px] bg-[#252526] border border-white/5 p-6 sm:p-8 space-y-4 shadow-md text-sm text-[#d4d4d4] leading-relaxed whitespace-pre-wrap">
          <p>{link.description}</p>
          {link.notes && (
            <div className="mt-4 p-4 rounded-xl bg-[#1e1e1e] border border-white/5 text-xs text-[#a1a1aa]">
              <span className="font-bold text-[var(--linkC,#9aa0a6)] block mb-1">Not:</span>
              {link.notes}
            </div>
          )}
        </div>
      )}

      {/* 7. Paylaş Barı (Screenshot 1 & 4 1:1: Facebook, Whatsapp, X / Twitter, +) */}
      <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-[#989b9f] font-medium mr-1 text-xs">Paylaş:</span>

        {/* Facebook Butonu (Mavi) */}
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1877f2] hover:bg-[#166fe5] text-white font-semibold transition-all shadow-sm active:scale-95 no-underline"
        >
          <FacebookIcon className="w-3.5 h-3.5 fill-white" />
          <span>Facebook</span>
        </a>

        {/* Whatsapp Butonu (Yeşil) */}
        <a
          href={`https://api.whatsapp.com/send?text=${shareTitle}%20${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#00a884] hover:bg-[#008f6f] text-white font-semibold transition-all shadow-sm active:scale-95 no-underline"
        >
          <WhatsappIcon className="w-3.5 h-3.5 fill-white" />
          <span>Whatsapp</span>
        </a>

        {/* X / Twitter Butonu (Siyah) */}
        <a
          href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#000000] hover:bg-[#111111] border border-white/10 text-white font-semibold transition-all shadow-sm active:scale-95 no-underline"
        >
          <TwitterIcon className="w-3.5 h-3.5 fill-white" />
          <span>X / Twitter</span>
        </a>

        {/* + Diğer Uygulamalarla Paylaş Butonu (Screenshot 7 Modalını Açar) */}
        <button
          type="button"
          onClick={() => setIsShareModalOpen(true)}
          className="w-9 h-8 rounded-xl bg-[#282828] hover:bg-[#333333] border border-white/10 text-white font-bold flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-sm"
          title="Diğer uygulamalarla paylaş"
          aria-label="Daha fazla paylaşım seçeneği"
        >
          <span className="text-base leading-none">+</span>
        </button>
      </div>

      {/* 8. Yazar & Meta Bilgileri Satırı (Screenshot 1 & 4 1:1) */}
      <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs text-[#989b9f]">
        
        {/* Sol: Yazar Avatarı + İsim + Tarih + Okuma Süresi */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2">
            {authorImgError ? (
              <span className="w-7 h-7 rounded-full bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center text-xs font-bold ring-1 ring-white/10 shrink-0">
                {authorInitial}
              </span>
            ) : (
              <img
                src={currentAuthor.avatar}
                alt={currentAuthor.name}
                className="w-7 h-7 rounded-full object-cover ring-1 ring-white/10 shrink-0"
                onError={() => setAuthorImgError(true)}
              />
            )}
            <span className="text-white font-bold">{currentAuthor.name}</span>
          </div>

          <span className="text-[#52525b]">•</span>

          <span className="text-[#71717a]">Eki 29, 2026</span>
          <span className="text-[#52525b]">•</span>
          <span className="text-[#71717a]">Kas 8, 2026</span>
          <span className="text-[#52525b]">•</span>
          <span className="text-[#71717a]">Estimated read time: 6 min</span>
        </div>

        {/* Sağ: Yer İmi, Yorum Sayısı, Paylaş İkonu (Blogger XML 1:1) */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => link.id && onTogglePin(link.id, link.isPinned)}
            className="text-[#989b9f] hover:text-white transition-colors cursor-pointer"
            title={link.isPinned ? 'Kaydedildi' : 'Kaydet'}
          >
            {link.isPinned ? (
              <ArchiveTickIcon className="w-4 h-4" />
            ) : (
              <ArchiveAddIcon className="w-4 h-4" />
            )}
          </button>

          <div className="flex items-center gap-1.5 text-[#989b9f]" title={`${link.commentsCount ?? 0} Yorum`}>
            <ChatBloggerIcon className="w-4 h-4" />
            <span className="text-[11px] font-bold">{link.commentsCount ?? 0}</span>
          </div>

          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className="text-[#989b9f] hover:text-white transition-colors cursor-pointer"
            title="Paylaş"
          >
            <Share1Icon className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* 9. Önceki Gönderi Bloğu (Screenshot 1 1:1) */}
      {prevLink && (
        <div 
          onClick={() => onNavigatePost(prevLink)}
          className="p-4 rounded-xl bg-[#252526] hover:bg-[#28282b] border border-white/5 transition-all cursor-pointer group space-y-1"
        >
          <div className="flex items-center gap-1.5 text-xs text-[#989b9f] group-hover:text-white font-bold">
            <ChevronLeft className="w-4 h-4" />
            <span>Önceki</span>
          </div>
          <div className="text-xs sm:text-[13px] font-semibold text-white/90 group-hover:text-[var(--linkC,#9aa0a6)] transition-colors truncate">
            {prevLink.title}
          </div>
        </div>
      )}

      {/* 10. Etiket Rozeti (Screenshot 1 1:1) */}
      <div className="pt-1">
        <span className="inline-block px-3 py-1.5 rounded-xl bg-[#252526] text-xs font-semibold text-white/80">
          {link.tags[0] || 'videolar'}
        </span>
      </div>

      {/* 11. Benzer Yazılar (1:1 Blogger Plu$ UI LinkCard Grid) */}
      {relatedPosts.length > 0 && (
        <section className="space-y-3.5 pt-6 border-t border-white/5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              <span className="w-1.5 h-3.5 rounded-full bg-[var(--linkC,#60cdff)]" />
              Benzer Yazılar
            </h3>
            <span className="text-xs text-[#989b9f] lowercase">
              {link.tags[0] ? `#${link.tags[0]}` : 'öneriler'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {relatedPosts.map((post) => (
              <LinkCard
                key={post.id || post.url}
                link={post}
                onOpenPostPage={onNavigatePost}
                onTogglePin={onTogglePin}
              />
            ))}
          </div>
        </section>
      )}

      {/* 12. Diğer Uygulamalarla Paylaş Tam Ekran Sekmesi (negron-v3.xml .shBr.fixL 1:1 — bulanık kenarsız, karanlık/aydınlık tam ekran) */}
      {isShareModalOpen && createPortal(
        <div
          id="ShareFullscreenModal"
          className="sh-fullscreen fixed inset-0 z-[999999] w-screen h-[100dvh] bg-[#1e1e1e] flex flex-col justify-between animate-in fade-in duration-150"
        >
          {/* Ortalanmış Paylaşım İçeriği */}
          <div className="flex-1 w-full flex items-center justify-center p-6 overflow-y-auto">
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[540px] space-y-6 text-white"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                <span className="text-sm font-bold text-[#989b9f]">
                  Diğer uygulamalarla paylaşın
                </span>
              </div>

              {/* Post Preview Box */}
              <div className="flex items-center gap-3.5 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <img
                  src={primaryImage}
                  alt={link.title}
                  className="w-12 h-12 rounded-lg object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-white truncate">{link.title}</h4>
                  <span className="text-xs text-[#989b9f] lowercase">{link.tags[0] || 'videolar'}</span>
                </div>
              </div>

              {/* Share Grid */}
              <div className="grid grid-cols-4 gap-3 py-2 text-center text-xs text-[#d4d4d4]">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center gap-2 p-2.5 rounded-xl hover:bg-white/5 cursor-pointer no-underline text-inherit transition-colors"
                >
                  <div className="w-11 h-11 rounded-full bg-[#1877f2] flex items-center justify-center shadow-md">
                    <FacebookIcon className="w-4 h-4 fill-white" />
                  </div>
                  <span>Facebook</span>
                </a>

                <a
                  href={`https://api.whatsapp.com/send?text=${shareTitle}%20${shareUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center gap-2 p-2.5 rounded-xl hover:bg-white/5 cursor-pointer no-underline text-inherit transition-colors"
                >
                  <div className="w-11 h-11 rounded-full bg-[#00a884] flex items-center justify-center shadow-md">
                    <WhatsappIcon className="w-4 h-4 fill-white" />
                  </div>
                  <span>WhatsApp</span>
                </a>

                <a
                  href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center gap-2 p-2.5 rounded-xl hover:bg-white/5 cursor-pointer no-underline text-inherit transition-colors"
                >
                  <div className="w-11 h-11 rounded-full bg-[#000000] border border-white/10 flex items-center justify-center shadow-md">
                    <TwitterIcon className="w-4 h-4 fill-white" />
                  </div>
                  <span>X / Twitter</span>
                </a>

                <a
                  href={`https://t.me/share/url?url=${shareUrl}&text=${shareTitle}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center gap-2 p-2.5 rounded-xl hover:bg-white/5 cursor-pointer no-underline text-inherit transition-colors"
                >
                  <div className="w-11 h-11 rounded-full bg-[#229ed9] flex items-center justify-center shadow-md">
                    <TelegramIcon className="w-4 h-4 fill-white" />
                  </div>
                  <span>Telegram</span>
                </a>
              </div>

              {/* Copy Link Row */}
              <div className="pt-2 space-y-2">
                <span className="text-xs text-[#989b9f]">veya bağlantıyı kopyalayın</span>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#252526] border border-white/[0.08]">
                  <input
                    type="text"
                    readOnly
                    value={link.url}
                    className="bg-transparent text-xs text-white/90 flex-1 outline-none px-1.5 font-mono truncate"
                  />
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
                    title="Kopyala"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Alt Kapatma Çubuğu (#Sohbet / #Paylaş 1:1 .shH) */}
          <div className="sh-bottom-bar w-full px-6 py-3.5 border-t border-white/[0.06] bg-transparent flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 text-[14px] font-bold text-[#fffdfc]">
              <span>#Paylaş</span>
            </div>
            <button
              type="button"
              onClick={() => setIsShareModalOpen(false)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#989b9f] hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
              title="Kapat"
              aria-label="Kapat"
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      , document.body)}

    </article>
  );
};
