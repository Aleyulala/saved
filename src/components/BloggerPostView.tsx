import { createPortal } from 'react-dom';
import React, { useState, useEffect, useMemo } from 'react';
import { PostReactions } from './PostReactions';
import { PostMediaSlider } from './PostMediaSlider';
import { getCategoryFallbackImages } from '../utils/mediaExtractor';
import { 
  Check, 
  Copy, 
  ChevronLeft, 
  ChevronRight,
  FileText,
  Mail,
  Link2 as LinkIcon2
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
  onOpenMedia?: (items: MediaItem[], initialIndex?: number, opts?: { floating?: boolean }) => void;
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

  const fallbackMediaItems: MediaItem[] = useMemo(
    () => getCategoryFallbackImages(link.tags?.[0] || '', link.title, link.id, link.url, 3).map(u => ({ type: 'image' as const, url: u, title: link.title })),
    [link]
  );
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
          {/* Fotoğrafı olmayan gönderilerde kategori görselleriyle slayt + hikaye şeridi */}
          <PostMediaSlider
            items={hasRealMedia && mediaItems.length > 0 ? mediaItems : fallbackMediaItems}
            index={Math.min(selectedMediaIndex, (hasRealMedia && mediaItems.length > 0 ? mediaItems : fallbackMediaItems).length - 1)}
            onIndexChange={setSelectedMediaIndex}
            title={link.title}
            onOpenMedia={onOpenMedia}
          />
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

      {/* Yazı altı tepki satırı */}
      {link.id != null && <PostReactions postKey={`post_${link.id}`} />}

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
          {/* Paylaşım içeriği — Blogger .shBr 1:1: başlık, yazı kartı, 4×2 yuvarlak düğme, bağlantı kopyala */}
          <div className="shBody flex-1 w-full flex items-center justify-center py-6 px-[21px] overflow-y-auto">
            <div onClick={(e) => e.stopPropagation()} className="w-full max-w-[540px] text-white">
              <div className="shTitle">Diğer uygulamalarla paylaşın</div>

              <div className="shCard">
                <img src={primaryImage} alt={link.title} className="shThumb" />
                <div className="min-w-0 flex-1">
                  <h4 className="shCardT">{link.title}</h4>
                  <span className="shCardS">{link.tags[0] || 'videolar'}</span>
                </div>
              </div>

              <div className="shGrid">
                <a className="shBtn" target="_blank" rel="noreferrer" href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}>
                  <span className="shCirc" style={{ background: '#1877f2' }}><FacebookIcon className="w-[26px] h-[26px] fill-white" /></span>
                  <span>Facebook</span>
                </a>
                <a className="shBtn" target="_blank" rel="noreferrer" href={`https://api.whatsapp.com/send?text=${shareTitle}%20${shareUrl}`}>
                  <span className="shCirc" style={{ background: '#25d366' }}><WhatsappIcon className="w-[26px] h-[26px] fill-white" /></span>
                  <span>WhatsApp</span>
                </a>
                <a className="shBtn" target="_blank" rel="noreferrer" href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`}>
                  <span className="shCirc" style={{ background: '#000', border: '1px solid rgba(255,255,255,0.1)' }}><TwitterIcon className="w-[26px] h-[26px] fill-white" /></span>
                  <span>X / Twitter</span>
                </a>
                <a className="shBtn" target="_blank" rel="noreferrer" href={`https://t.me/share/url?url=${shareUrl}&text=${shareTitle}`}>
                  <span className="shCirc" style={{ background: '#229ed9' }}><TelegramIcon className="w-[26px] h-[26px] fill-white" /></span>
                  <span>Telegram</span>
                </a>
                <a className="shBtn" target="_blank" rel="noreferrer" href={`https://pinterest.com/pin/create/button/?url=${shareUrl}&description=${shareTitle}`}>
                  <span className="shCirc shGray"><svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M12.6 6.2c-3 0-4.6 2-4.6 4.1 0 1 .5 2.2 1.3 2.6.2.1.3 0 .3-.1l.2-.8c0-.2 0-.3-.1-.4-.4-.5-.7-1.100-.7-1.900 0-1.900 1.400-3.700 3.800-3.700 2.100 0 3.300 1.300 3.300 3 0 2.200-1 4.100-2.400 4.100-.8 0-1.400-.7-1.200-1.500.2-1 .7-2 .7-2.700 0-.6-.3-1.100-1-1.100-.8 0-1.500.8-1.500 2 0 .7.2 1.200.2 1.200l-1 4.100c-.2.900-.1 2 0 2.800 0 .1.100.1.200 0 .1-.1.900-1.200 1.200-2.300l.5-1.800c.3.500 1 .9 1.800.9 2.400 0 4-2.200 4-5.100 0-2.200-1.900-4.300-4.800-4.300z" /></svg></span>
                  <span>Pinterest</span>
                </a>
                <a className="shBtn" target="_blank" rel="noreferrer" href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}>
                  <span className="shCirc shGray"><svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M4.500 9h3.200v10.500H4.500zM6.100 3.900a1.900 1.900 0 110 3.800 1.900 1.900 0 010-3.800zM9.800 9h3v1.400h.1c.4-.8 1.500-1.700 3.100-1.700 3.300 0 3.900 2.200 3.900 5v5.800h-3.200v-5.100c0-1.200 0-2.800-1.700-2.800s-2 1.300-2 2.700v5.200H9.800z" /></svg></span>
                  <span>LinkedIn</span>
                </a>
                <a className="shBtn" target="_blank" rel="noreferrer" href={`https://social-plugins.line.me/lineit/share?url=${shareUrl}`}>
                  <span className="shCirc shGray"><svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M12 3C6.800 3 2.600 6.400 2.600 10.600c0 3.700 3.300 6.800 7.800 7.400.3.100.7.200.8.500.1.300.1.700 0 1l-.1.900c0 .3-.2 1 .9.500s5.800-3.400 7.900-5.800c1.400-1.600 2.100-3.200 2.100-4.500C20.000 6.400 16.800 3 12 3z" /><text x="12" y="12.600" textAnchor="middle" fontSize="5.200" fontWeight="800" fill="#2b2b2b" fontFamily="Arial,sans-serif">LINE</text></svg></span>
                  <span>Line</span>
                </a>
                <a className="shBtn" href={`mailto:?subject=${shareTitle}&body=${shareUrl}`}>
                  <span className="shCirc shGray"><Mail className="w-[26px] h-[26px]" /></span>
                  <span>Email</span>
                </a>
              </div>

              <div className="shOr">or copy link</div>
              <div className="shCopy">
                <LinkIcon2 className="w-5 h-5 shrink-0 opacity-70" />
                <input type="text" readOnly value={link.url} className="shUrl" />
                <button type="button" onClick={handleCopy} className="shCopyBtn" title="Kopyala" aria-label="Kopyala">
                  {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                </button>
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
