import { BloggerPager } from './BloggerPager';
import React, { useRef, useState, useMemo, useEffect } from 'react';
import { 
  Home, 
  Hash, 
  Clock, 
  ChevronLeft,
  ChevronRight, 
  SlidersHorizontal,
  Plus,
  Calendar,
  Newspaper
} from 'lucide-react';
import { CollectionItem, LinkItem } from '../types';
import { formatBlogDate, getDomain, getFaviconUrl } from '../utils/favicon';
import { getAuthorData } from '../utils/bloggerAuthors';
import { DashboardItem } from './DashboardItem';
import { LinkCard } from './LinkCard';
import { BloggerHeroSlider } from './BloggerHeroSlider';
import { BloggerOffTopicSlider } from './BloggerOffTopicSlider';
import { BloggerNotificationBar } from './BloggerNotificationBar';
import { MediaItem } from './UniversalMediaModal';
import { 
  Link21Icon, 
  Folder2Icon, 
  FolderFavoriteIcon,
  Verify1Icon,
  EyeIcon,
  ChatBloggerIcon,
  MessageNotif1Icon,
  ArchiveIcon,
  ArchiveAddIcon,
  ArchiveTickIcon,
  RankingIcon,
  DocumentIcon
} from './BloggerIcons';
import { BrandLogoCard } from './BrandLogoCard';

interface DashboardViewProps {
  links: LinkItem[];
  collections: CollectionItem[];
  tagsCount: number;
  pinnedCount: number;
  collectionMap: Map<number, CollectionItem>;
  resetPageTrigger?: number;
  onViewAllRecent: () => void;
  onViewCollection: (id: number) => void;
  onNavigateTab?: (tab: 'links' | 'pinned' | 'collections_list' | 'tags_list') => void;
  onSelectTag?: (tag: string) => void;
  onOpenNewLink: () => void;
  onOpenDetail: (link: LinkItem) => void;
  onOpenPostPage: (link: LinkItem) => void;
  onTogglePin: (id: number, current: boolean) => void;
  onToggleRead: (id: number, current: boolean) => void;
  onToggleArchive: (id: number, current: boolean) => void;
  onMoveToTrash: (id: number) => void;
  onEditLink: (link: LinkItem) => void;
  onOpenMedia?: (items: MediaItem[], initialIndex?: number) => void;
  onOpenChat?: () => void;
  onOpenContact?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  links,
  collections,
  tagsCount,
  pinnedCount,
  collectionMap,
  resetPageTrigger,
  onViewAllRecent,
  onViewCollection,
  onNavigateTab,
  onSelectTag,
  onOpenNewLink,
  onOpenDetail,
  onOpenPostPage,
  onTogglePin,
  onToggleRead,
  onToggleArchive,
  onMoveToTrash,
  onEditLink,
  onOpenMedia,
  onOpenChat,
  onOpenContact
}) => {
  const activeLinks = links.filter(l => !l.isTrash && !l.isArchived);
  
  // 1. Kategoriler: "Konu Dışı" her zaman ilk sırada (Sayfa 1'de) yer alır
  const sortedCollections = useMemo(() => {
    const list = [...collections];
    list.sort((a, b) => {
      const isA = a.name.toLowerCase().includes('konu');
      const isB = b.name.toLowerCase().includes('konu');
      if (isA && !isB) return -1;
      if (!isA && isB) return 1;
      return 0;
    });

    if (!list.some(c => c.name.toLowerCase().includes('konu'))) {
      list.unshift({
        id: -999,
        name: 'Konu Dışı',
        color: '#9aa0a6',
        icon: 'messages-square',
        description: 'Genel sohbet, öneriler ve konu dışı paylaşımlar',
        createdAt: Date.now()
      });
    }
    return list;
  }, [collections]);

  // Featured Pinned Post (first pinned Linkwarden bookmark)
  const pinnedPost = activeLinks.find(l => l.isPinned && l.thumbnail) || activeLinks.find(l => l.isPinned) || activeLinks[0];

  // Group links by collection with Konu Dışı fallback guarantee
  const linksByCollection = useMemo(() => {
    const map: Record<number, LinkItem[]> = {};
    activeLinks.forEach(l => {
      if (l.collectionId) {
        if (!map[l.collectionId]) map[l.collectionId] = [];
        map[l.collectionId].push(l);
      }
    });

    // Konu Dışı koleksiyonunun bağlantılarını garantile
    const konuCol = sortedCollections.find(c => c.name.toLowerCase().includes('konu'));
    if (konuCol && konuCol.id) {
      if (!map[konuCol.id] || map[konuCol.id].length === 0) {
        const fallback = activeLinks.filter(l => 
          l.tags.some(t => t.toLowerCase().includes('konu') || t.toLowerCase().includes('forum') || t.toLowerCase().includes('sozluk') || t.toLowerCase().includes('topluluk')) ||
          l.title.toLowerCase().includes('forum') ||
          l.title.toLowerCase().includes('sohbet') ||
          (l.collectionId && collectionMap.get(l.collectionId)?.name.toLowerCase() === 'forum')
        );
        map[konuCol.id] = fallback.length > 0 ? fallback : activeLinks.slice(0, 10);
      }
    }
    return map;
  }, [activeLinks, sortedCollections, collectionMap]);

  // Sayfalama (Blogger Plus UI 1 2 3 4 5... Pager Motoru)
  const POSTS_PER_PAGE = 6;
  const [currentPage, setCurrentPage] = useState<number>(() => {
    try {
      const p = new URLSearchParams(window.location.search).get('page');
      const n = parseInt(p || '1', 10);
      return !isNaN(n) && n >= 1 ? n : 1;
    } catch {
      return 1;
    }
  });

  // SAVED logosu veya harici Home tetiklendiğinde sayfa 1'e dön
  useEffect(() => {
    if (resetPageTrigger) {
      setCurrentPage(1);
    }
  }, [resetPageTrigger]);

  // URL değişikliklerini dinle
  useEffect(() => {
    const handleUrlChange = () => {
      try {
        const p = new URLSearchParams(window.location.search).get('page');
        const n = parseInt(p || '1', 10);
        setCurrentPage(!isNaN(n) && n >= 1 ? n : 1);
      } catch {}
    };
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  // Toplam sayfa sayısı (en az 5 sayfa sekmesi sunacak şekilde dinamik)
  const totalPages = useMemo(() => {
    const availableCount = activeLinks.filter(l => pinnedPost ? l.id !== pinnedPost.id : true).length;
    const postPages = Math.ceil(Math.max(1, availableCount) / POSTS_PER_PAGE);
    const catPages = Math.max(1, sortedCollections.length);
    return Math.max(5, Math.min(catPages, postPages));
  }, [activeLinks, pinnedPost, sortedCollections.length]);

  // Geçerli sayfanın gönderileri (En Son Yayınlar: Sayfaya göre 6'şar 6'şar değişir)
  const latestPosts = useMemo(() => {
    const available = activeLinks.filter(l => pinnedPost ? l.id !== pinnedPost.id : true);
    const startIdx = (currentPage - 1) * POSTS_PER_PAGE;
    const slice = available.slice(startIdx, startIdx + POSTS_PER_PAGE);
    if (slice.length === 0) {
      return available.slice(0, POSTS_PER_PAGE);
    }
    return slice;
  }, [activeLinks, pinnedPost, currentPage]);

  // "Konu Dışı" slaydı: Blogger'daki gibi her sayfada, En Son Yayınlar ile sayfalama arasında görünür
  const konuCollection = useMemo(
    () => sortedCollections.find(c => c.name.toLowerCase().includes('konu')),
    [sortedCollections]
  );
  const konuLinks = useMemo(
    () => (konuCollection?.id ? (linksByCollection[konuCollection.id] || []).slice(0, 12) : []),
    [konuCollection, linksByCollection]
  );

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;
    setCurrentPage(newPage);
    try {
      const url = new URL(window.location.href);
      if (newPage === 1) {
        url.searchParams.delete('page');
      } else {
        url.searchParams.set('page', String(newPage));
      }
      window.history.pushState({}, '', url.toString());
    } catch {}

    const anchor = document.getElementById('latestPostsAnchor');
    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* 1. Blogger Üst Bildiri Çubuğu (.ntcW) */}
      <BloggerNotificationBar onOpenChat={onOpenChat} onOpenContact={onOpenContact} />

      {/* 2. Blogger Plus UI Hero Showcase Carousel (.sldW) */}
      <section aria-label="Hero Carousel" className="w-full">
        <BloggerHeroSlider
          collections={collections}
          onSelectCollection={onViewCollection}
          onFilterTag={onSelectTag}
          onOpenMedia={onOpenMedia}
        />
      </section>

      {/* 3. Sabitlenmiş Gönderi (Pinned Post - 1:1 Blogger Stili) */}
      {pinnedPost && (
        <section aria-label="Sabitlenmiş Gönderi" className="space-y-[21px] pb-4">
          <div className="flex items-center gap-2">
            <RankingIcon className="w-5 h-5 text-[var(--linkC,#9aa0a6)]" />
            <h2 className="text-sm sm:text-base font-bold text-white">
              Sabitlenmiş Gönderi
            </h2>
          </div>

          <article 
            onClick={() => onOpenPostPage(pinnedPost)}
            className="group relative bg-transparent border-0 transition-all duration-200 cursor-pointer flex flex-col md:flex-row gap-4 md:gap-[17px] select-none items-stretch"
          >
            {/* Sol Görsel / Thumbnail (Blogger FeaturedPost01 1:1 — Temiz görsel, köşe rozet yığını yok) */}
            <div className="relative w-full md:w-[300px] aspect-[16/9] rounded-[12px] bg-[#1e1e1e] overflow-hidden shrink-0">
              <div className="pinGrd" aria-hidden="true" />
              {pinnedPost.thumbnail ? (
                <img
                  src={pinnedPost.thumbnail}
                  alt={pinnedPost.title}
                  className="w-full h-full object-cover thmb-zoom"
                  loading="lazy"
                />
              ) : (
                <BrandLogoCard url={pinnedPost.url} title={pinnedPost.title} size="card" />
              )}

              {/* Blogger XML 1:1 Yer İmleri / Kaydet Butonu (.bm-button — yalnızca üzerine gelince veya kaydedilmişse) */}
              <div className="tfxM T">
                <div className="tfxC">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onTogglePin && pinnedPost.id) onTogglePin(pinnedPost.id, pinnedPost.isPinned);
                    }}
                    className={`bM bm-button${pinnedPost.isPinned ? ' added' : ''}`}
                    title={pinnedPost.isPinned ? 'Kaydedildi' : 'Kaydet'}
                    aria-label={pinnedPost.isPinned ? 'Kaydedildi' : 'Kaydet'}
                  >
                    {pinnedPost.isPinned ? <ArchiveTickIcon className="" /> : <ArchiveAddIcon className="" />}
                    <span className="bMt">{pinnedPost.isPinned ? 'Kaydedildi' : 'Kaydet'}</span>
                  </button>
                </div>
                <div className="tfxC">
                  <div className="cmnt" title="Yorumlar">
                    <MessageNotif1Icon className="" />
                    <span>{pinnedPost.commentsCount ?? 0}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sağ Metin İçeriği (negron.xml 1:1 kutusuz doğrudan akış) */}
            <div className="pt-0.5 md:pt-4 md:pb-[13px] flex flex-col justify-between flex-1 gap-2.5 min-w-0">
              <div className="space-y-1.5">
                <div className="text-[13px] text-[var(--linkC,#9aa0a6)] hover:underline lowercase font-medium">
                  {pinnedPost.tags[0] || (pinnedPost.collectionId ? collectionMap.get(pinnedPost.collectionId)?.name.toLowerCase() : 'genel')}
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-[var(--linkC,#9aa0a6)] leading-snug transition-colors line-clamp-2">
                  {pinnedPost.title}
                </h3>

                {pinnedPost.description && (
                  <p className="text-[14px] text-[#989b9f] leading-[21px] line-clamp-2">
                    {pinnedPost.description}
                  </p>
                )}
              </div>

              {/* Alt Satır: Güncellendi Rozeti + Tarih + Daha */}
              <div className="pt-2 flex items-center justify-between text-xs text-[#9ca3af]">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#5f6368] text-white font-semibold">
                    Güncellendi
                  </span>
                  <span className="text-[11px] text-[#71717a]">{formatBlogDate(pinnedPost.createdAt, true)}</span>
                </div>

                <span className="text-xs text-[#989b9f] group-hover:text-[var(--linkC,#9aa0a6)] group-hover:underline font-medium">
                  Daha
                </span>
              </div>
            </div>
          </article>
        </section>
      )}

      {/* Çapa: Sayfa Değiştiğinde Buraya Kay */}
      <div id="latestPostsAnchor" className="scroll-mt-24" />

      {/* 5. En Son Yayınlar (Latest Posts - 3 Sütunlu Blogger Grid) */}
      <section aria-label="En Son Yayınlar" className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DocumentIcon className="w-5 h-5 text-[var(--linkC,#9aa0a6)]" />
            <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">
              En Son Yayınlar
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-[18px] gap-y-[36px]">
          {latestPosts.map((post) => (
            <LinkCard
              key={post.id}
              link={post}
              collection={post.collectionId ? collectionMap.get(post.collectionId) : undefined}
              onOpenPostPage={onOpenPostPage}
              onTogglePin={onTogglePin}
            />
          ))}
        </div>
      </section>

      {/* 5b. Konu Dışı Slaytı (Blogger .sldW kart kaydırıcısı) */}
      {konuCollection && konuLinks.length > 0 && (
        <BloggerOffTopicSlider
          collection={konuCollection}
          links={konuLinks}
          onViewAll={() => {
            if (konuCollection.id && konuCollection.id > 0) onViewCollection(konuCollection.id);
            else onViewAllRecent();
          }}
          onOpenPostPage={onOpenPostPage}
        />
      )}

      {/* 6. Blogger Plus UI numaralı sayfalama ile birebir aynı (BloggerPager) */}
      <BloggerPager current={currentPage} total={totalPages} onChange={handlePageChange} />

    </div>
  );
};
