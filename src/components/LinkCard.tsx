import React, { useState, useMemo } from 'react';
import { CollectionItem, LinkItem } from '../types';
import { formatDate, getDomain, getFaviconUrl } from '../utils/favicon';
import { getAuthorData } from '../utils/bloggerAuthors';
import { extractPostMedia, cleanMediaUrl } from '../utils/mediaExtractor';
import { 
  Verify1Icon, 
  EyeIcon, 
  ChatBloggerIcon,
  ArchiveIcon,
  ArchiveAddIcon,
  ArchiveTickIcon
} from './BloggerIcons';
import { BrandLogoCard } from './BrandLogoCard';

interface LinkCardProps {
  link: LinkItem;
  collection?: CollectionItem;
  onOpenPostPage?: (link: LinkItem) => void;
  onOpenDetail?: (link: LinkItem) => void;
  onTogglePin?: (id: number, current: boolean) => void;
  onToggleRead?: (id: number, current: boolean) => void;
  onToggleArchive?: (id: number, current: boolean) => void;
  onMoveToTrash?: (id: number) => void;
  onRestoreFromTrash?: (id: number) => void;
  onPermanentDelete?: (id: number) => void;
  onEdit?: (link: LinkItem) => void;
  isCompact?: boolean;
}

export const LinkCard: React.FC<LinkCardProps> = ({
  link,
  collection,
  onOpenPostPage,
  onOpenDetail,
  onTogglePin,
  isCompact = false
}) => {
  const [imgError, setImgError] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [faviconError, setFaviconError] = useState(false);
  const initial = (link.authorName || 'A').charAt(0).toUpperCase();
  const domain = getDomain(link.url);
  const faviconUrl = getFaviconUrl(link.url);

  const handleCardClick = () => {
    if (onOpenPostPage) {
      onOpenPostPage(link);
    } else if (onOpenDetail) {
      onOpenDetail(link);
    }
  };

  // Fallback views & comments if not set
  const views = link.views || Math.abs(link.title.length * 3 + 12);
  const comments = link.commentsCount !== undefined ? link.commentsCount : (link.isPinned ? 3 : Math.abs(link.title.length % 3));
  const author = link.authorName || 'NEGRONN';
  const authorData = getAuthorData(author);

  // Automatic Cover Photo resolution: link.thumbnail OR extracted from /resim or /youtube in content
  const displayThumb = useMemo(() => {
    if (link.thumbnail) return cleanMediaUrl(link.thumbnail);
    const media = extractPostMedia(link);
    return media.primaryImage ? cleanMediaUrl(media.primaryImage) : '';
  }, [link]);

  // Thumbnail fallback: use displayThumb if available, else curated aesthetic background
  const hasThumbnail = Boolean(displayThumb && !imgError);

  return (
    <article 
      onClick={handleCardClick}
      className="group relative rounded-lg bg-[#252526] hover:bg-[#28282b] border border-transparent hover:border-[#60cdff]/30 transition-all duration-200 hover:-translate-y-1 shadow-md hover:shadow-xl hover:shadow-black/60 flex flex-col justify-between overflow-hidden cursor-pointer select-none"
    >
      
      {/* 1. Blogger Post Thumbnail (.pThmb) */}
      <div className="relative w-full aspect-[16/9] bg-[#1e1e1e] overflow-hidden">
        {hasThumbnail ? (
          <img
            src={displayThumb}
            alt={link.title}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        ) : (
          <BrandLogoCard url={link.url} title={link.title} size="card" />
        )}

        {/* Gradient shadow overlay for crystal clear badge contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/60 pointer-events-none" />

        {/* Sol Üst: Görüntülenme Sayısı (👁 74) */}
        <div className="absolute top-2 left-2 z-10">
          <div className="h-[22px] px-2 flex items-center gap-1 rounded-lg bg-black/65 backdrop-blur-md text-white text-[10px] font-medium shadow-sm">
            <EyeIcon className="w-3.5 h-3.5 text-[#60cdff]" />
            <span>{views}</span>
          </div>
        </div>

        {/* Sağ Üst: Yorum Sayısı (💬 0) & Sabitleme/Yer İmi (🔖) — Image 4 1:1 Tam Eşit Boyut */}
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1.5">
          <div className="h-[22px] px-2 flex items-center gap-1 rounded-lg bg-black/65 backdrop-blur-md text-white text-[10px] font-medium shadow-sm">
            <ChatBloggerIcon className="w-3.5 h-3.5 text-white/90" />
            <span>{comments}</span>
          </div>

          {/* Blogger XML 1:1 Yer İmleri / Kaydet Butonu (.bm-button) — Yorum kutucuğuyla tam eşit h-[22px] */}
          <button
            type="button"
            onClick={(e) => {
              if (onTogglePin && link.id) {
                e.stopPropagation();
                onTogglePin(link.id, link.isPinned);
              }
            }}
            className={`tIc bm-button h-[22px] px-2 rounded-lg bg-black/65 backdrop-blur-md shadow-sm transition-all duration-200 active:scale-90 cursor-pointer flex items-center justify-center ${
              link.isPinned 
                ? 'text-amber-400' 
                : 'text-white/80 hover:text-[#60cdff]'
            }`}
            data-save="Kaydet"
            data-saved="Kaydedildi"
            title={link.isPinned ? 'Kaydedildi' : 'Kaydet'}
            aria-label={link.isPinned ? 'Kaydedildi' : 'Kaydet'}
          >
            {link.isPinned ? (
              <ArchiveTickIcon className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <ArchiveAddIcon className="w-3.5 h-3.5 text-white/90" />
            )}
          </button>
        </div>

        {/* Sol Alt: Yazar / Marka Rozeti (.aNm - XML 1:1) */}
        <div className="absolute bottom-2 left-2 z-10">
          <div className="h-[22px] inline-flex items-center gap-1.5 px-2 rounded-lg bg-black/75 backdrop-blur-md text-white text-[10px] font-bold shadow-sm tracking-wide">
            {avatarError ? (
              <span className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center text-[8px] font-bold ring-1 ring-white/20 shrink-0">
                {initial}
              </span>
            ) : (
              <img
                src={authorData.avatar}
                alt={author}
                className="w-3.5 h-3.5 rounded-full object-cover shrink-0 ring-1 ring-white/20"
                loading="lazy"
                onError={() => setAvatarError(true)}
              />
            )}
            <span>{author}</span>
            <Verify1Icon className="w-3 h-3 text-[#60cdff]" />
          </div>
        </div>

        {/* Sağ Alt: Web Sitesi Logosu & Alan Adı Rozeti (Kapaklı Gönderilerde) */}
        {hasThumbnail && (
          <div className="absolute bottom-2 right-2 z-10">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-black/75 backdrop-blur-md text-white text-[10px] font-medium shadow-sm border border-white/10">
              {!faviconError ? (
                <img
                  src={faviconUrl}
                  alt={domain}
                  onError={() => setFaviconError(true)}
                  className="w-3.5 h-3.5 object-contain shrink-0"
                />
              ) : null}
              <span className="max-w-[100px] truncate text-slate-200">{domain}</span>
            </div>
          </div>
        )}

      </div>

      {/* 2. Blogger Post Content (.pCntn) */}
      <div className="p-3.5 flex flex-col justify-between flex-1 gap-2.5">
        
        <div className="space-y-1">
          {/* Web Sitesi Logosu & Kategori Adı (.pLbls / Domain Pill) */}
          <div className="flex items-center gap-2 text-[11px]">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300">
              <img
                src={faviconUrl}
                alt={domain}
                className="w-3.5 h-3.5 object-contain shrink-0"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="truncate max-w-[120px] font-medium text-white/90">{domain}</span>
            </div>
            <span className="text-[#60cdff] lowercase font-medium">
              {collection?.name.toLowerCase() || (link.tags[0] || 'genel')}
            </span>
          </div>

          {/* Başlık (.pTtl) */}
          <h3 className="text-[14px] font-bold text-white group-hover:text-[#60cdff] line-clamp-2 leading-snug transition-colors">
            {link.title || link.url}
          </h3>

          {/* Açıklama / Özet (.pSnpt) */}
          {link.description && (
            <p className="text-xs text-[#989b9f] line-clamp-2 leading-relaxed pt-0.5">
              {link.description}
            </p>
          )}
        </div>

        {/* Alt Bilgi: Tarih + Daha (.pInf) */}
        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-[#71717a]">
          <div className="flex items-center gap-1.5">
            <span>{formatDate(link.createdAt)}</span>
          </div>

          <span className="text-xs text-[#60cdff] opacity-0 group-hover:opacity-100 transition-opacity font-medium">
            Daha →
          </span>
        </div>

      </div>

    </article>
  );
};
