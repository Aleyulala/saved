import { LinkItem } from '../types';
import { MediaItem } from '../components/UniversalMediaModal';

// Category-specific distinct wallpapers (NEVER Central Cinema slide image!)
const CATEGORY_IMAGES: Record<string, string[]> = {
  oyun: [
    'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1612287233207-67995f5f4b46?auto=format&fit=crop&w=1200&q=80'
  ],
  bilgisayar: [
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80'
  ],
  programlama: [
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80'
  ],
  teknoloji: [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80'
  ],
  videolar: [
    'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80'
  ],
  televizyon: [
    'https://images.unsplash.com/photo-1461151304267-38535e780c79?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=1200&q=80'
  ],
  öneri: [
    'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80'
  ]
};

export function getCategoryFallbackImage(category = 'genel', title = ''): string {
  const cat = (category || 'genel').toLowerCase().trim();
  const list = CATEGORY_IMAGES[cat] || CATEGORY_IMAGES.bilgisayar;
  let hash = 0;
  for (let i = 0; i < (title || '').length; i++) {
    hash = (hash << 5) - hash + title.charCodeAt(i);
  }
  const idx = Math.abs(hash) % list.length;
  return list[idx];
}

export function cleanMediaUrl(u: string): string {
  if (!u) return '';
  let res = u.replace(/&amp;/g, '&').trim();

  // 1. Google Redirects (e.g. google.com/url?q=...&source=gmail)
  if (res.includes('google.com/url?')) {
    try {
      const qMatch = res.match(/[?&]q=([^&]+)/);
      if (qMatch && qMatch[1]) {
        res = decodeURIComponent(qMatch[1]);
      } else {
        const urlMatch = res.match(/[?&]url=([^&]+)/);
        if (urlMatch && urlMatch[1]) {
          res = decodeURIComponent(urlMatch[1]);
        }
      }
    } catch {}
  }

  // 2. Wikimedia thumbnail normalizasyonu
  if (res.includes('upload.wikimedia.org') && res.includes('/thumb/')) {
    res = res.replace(/\/thumb(\/.*)\/[^\/]+$/i, '$1');
  }

  // 3. Google Drive direkt link
  if (res.includes('drive.google.com')) {
    const dMatch = res.match(/\/d\/([a-zA-Z0-9_-]+)/) || res.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (dMatch && dMatch[1]) {
      res = `https://lh3.googleusercontent.com/d/${dMatch[1]}`;
    }
  }

  // 4. Dropbox
  if (res.includes('dropbox.com')) {
    res = res.replace(/[?&]dl=0/, '?raw=1');
    if (!res.includes('raw=1') && !res.includes('?')) res += '?raw=1';
  }

  return res;
}

export interface PostMedia {
  items: MediaItem[];
  primaryImage: string;
  hasVideo: boolean;
  videoUrl?: string;
  youtubeId?: string;
}

export function extractPostMedia(link: LinkItem): PostMedia {
  const items: MediaItem[] = [];
  const text = `${link.description || ''} ${link.notes || ''} ${link.url || ''}`;

  // 1. YouTube Video ID Bulma
  let youtubeId: string | null = null;

  // 1.1 /youtube [id] kısa kodu
  const ytShortcode = text.match(/\/youtube\s+([a-zA-Z0-9_-]{11})/i);
  if (ytShortcode) {
    youtubeId = ytShortcode[1];
  }

  // 1.2 YouTube URL'leri (youtube.com/watch?v=, youtu.be/, shorts)
  if (!youtubeId) {
    const ytUrlMatch = text.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i);
    if (ytUrlMatch) {
      youtubeId = ytUrlMatch[1];
    }
  }

  // 1.3 Thumbnail URL'si içindeki YouTube ID (örn: krrAIoRVKSU-HD.jpg)
  if (!youtubeId && link.thumbnail) {
    const thumbYtMatch = link.thumbnail.match(/([a-zA-Z0-9_-]{11})-(?:HD|SD|default|hqdefault)\.jpg/i);
    if (thumbYtMatch) {
      youtubeId = thumbYtMatch[1];
    }
  }

  // 1.4 Özel bilinen gönderiler için video eşleştirmesi
  if (!youtubeId) {
    const lowTitle = (link.title || '').toLowerCase();
    if (lowTitle.includes('notbook lm') || lowTitle.includes('notebook lm')) {
      youtubeId = 'Gbk_p_tPjfg'; // NotebookLM Tanıtım ve Audio Overview videosu
    } else if (lowTitle.includes('fedora') || lowTitle.includes('legion go')) {
      youtubeId = '0kG7-7a5-Qc'; // Lenovo Legion Go S / Handheld inceleme videosu
    } else if (lowTitle.includes('adobe')) {
      youtubeId = 'yCvdQ9zD-14'; // Linux Adobe kurulum videosu
    }
  }

  // 2. Görselleri Çıkarma
  // 2.1 /resim [url] kısa kodu (hem standart url hem de <a href="..."> desteği)
  const resimMatches = text.matchAll(/\/resim\s+(?:<a\s+[^>]*href=["']([^"']+)["'][^>]*>[\s\S]*?<\/a>|([^\s<"']+))/gi);
  for (const m of resimMatches) {
    const rawUrl = m[1] || m[2];
    if (rawUrl) {
      const cleaned = cleanMediaUrl(rawUrl);
      if (cleaned && !items.some(it => it.url === cleaned)) {
        items.push({
          type: 'image',
          url: cleaned,
          title: link.title
        });
      }
    }
  }

  // 2.2 Gönderinin kendi thumbnail'ı
  if (link.thumbnail) {
    const cleanedThumb = cleanMediaUrl(link.thumbnail);
    if (cleanedThumb && !items.some(it => it.url === cleanedThumb)) {
      items.unshift({
        type: 'image',
        url: cleanedThumb,
        title: link.title
      });
    }
  }

  // 2.3 YouTube ID varsa YouTube videosunu ve HD kapağını ekle
  if (youtubeId) {
    const ytEmbedUrl = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`;
    const ytThumb = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;

    if (items.length === 0) {
      items.push({
        type: 'image',
        url: ytThumb,
        title: link.title
      });
    }

    items.push({
      type: 'youtube',
      url: ytEmbedUrl,
      title: link.title
    });
  }

  // 2.4 Eğer hiç görsel bulunamadıysa kategoriye özel benzersiz görsel ata (ASLA Central Cinema kullanma)
  if (items.length === 0) {
    const fallback = getCategoryFallbackImage(link.tags?.[0] || 'genel', link.title);
    items.push({
      type: 'image',
      url: fallback,
      title: link.title
    });
  }

  const primaryImage = items.find(it => it.type === 'image')?.url || link.thumbnail || getCategoryFallbackImage(link.tags?.[0], link.title);
  const videoItem = items.find(it => it.type === 'youtube' || it.type === 'shorts' || it.type === 'video');

  return {
    items,
    primaryImage,
    hasVideo: Boolean(videoItem),
    videoUrl: videoItem?.url,
    youtubeId: youtubeId || undefined
  };
}
