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
      className="group relative bg-transparent border-0 shadow-none transition-all duration-200 flex flex-col justify-between cursor-pointer select-none"
    >
      
      {/* 1. Blogger Post Thumbnail (.pThmb — Temiz köşesiz rozetsiz Blogger 1:1 görsel) */}
      <div className="relative w-full aspect-[16/9] rounded-[10px] bg-[#1e1e1e] overflow-hidden">
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

        {/* Blogger XML 1:1 Yer İmleri / Kaydet Butonu (.bm-button — yalnızca hover veya kayıtlıyken) */}
        <div className={`absolute top-2 right-2 z-10 transition-opacity duration-200 ${link.isPinned ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
          <button
            type="button"
            onClick={(e) => {
              if (onTogglePin && link.id) {
                e.stopPropagation();
                onTogglePin(link.id, link.isPinned);
              }
            }}
            className={`tIc bm-button w-7 h-7 rounded-full backdrop-blur-md shadow-sm transition-all duration-200 active:scale-90 cursor-pointer flex items-center justify-center ${
              link.isPinned 
                ? 'bg-black/75 text-amber-400' 
                : 'bg-black/65 text-white hover:bg-black/80'
            }`}
            data-save="Kaydet"
            data-saved="Kaydedildi"
            title={link.isPinned ? 'Kaydedildi' : 'Kaydet'}
            aria-label={link.isPinned ? 'Kaydedildi' : 'Kaydet'}
          >
            {link.isPinned ? (
              <ArchiveTickIcon className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <ArchiveAddIcon className="w-3.5 h-3.5 text-white" />
            )}
          </button>
        </div>

      </div>

      {/* 2. Blogger Post Content (.pCntn) */}
      <div className="pt-3 flex flex-col justify-between flex-1 gap-2">
        
        <div className="space-y-1">
          {/* Alan Adı & Kategori (.pLbls — kutusuz temiz akış) */}
          <div className="flex items-center gap-1.5 text-[11px] text-[#989b9f]">
            <img
              src={faviconUrl}
              alt={domain}
              className="w-3.5 h-3.5 object-contain shrink-0 rounded-xs"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <span className="truncate max-w-[120px] font-medium">{domain}</span>
            <span>·</span>
            <span className="text-[var(--linkC,#9aa0a6)] lowercase font-medium truncate">
              {collection?.name.toLowerCase() || (link.tags[0] || 'genel')}
            </span>
          </div>

          {/* Başlık (.pTtl) */}
          <h3 className="text-[14px] font-bold text-white group-hover:text-[var(--linkC,#9aa0a6)] line-clamp-2 leading-snug transition-colors">
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
        <div className="pt-1 flex items-center justify-between text-[11px] text-[#71717a]">
          <span>{formatDate(link.createdAt)}</span>

          <span className="text-xs text-[#989b9f] group-hover:text-[var(--linkC,#9aa0a6)] opacity-0 group-hover:opacity-100 transition-opacity font-medium">
            Daha
          </span>
        </div>

      </div>

    </article>
  );
};
