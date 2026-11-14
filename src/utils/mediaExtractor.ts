import { LinkItem } from '../types';
import { MediaItem } from '../components/UniversalMediaModal';

// Category-specific rich image pools (Curated, high-resolution, 100% verified Unsplash photos)
const CATEGORY_IMAGES: Record<string, string[]> = {
  oyun: [
    'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1580234811497-9df7fd2f357e?auto=format&fit=crop&w=1200&q=80'
  ],
  bilgisayar: [
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80'
  ],
  programlama: [
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?auto=format&fit=crop&w=1200&q=80'
  ],
  konudisi: [
    'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80'
  ],
  ai: [
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1676299081847-824916de030a?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1655635643532-fa9ba2648cbe?auto=format&fit=crop&w=1200&q=80'
  ],
  videolar: [
    'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1461151304267-38535e780c79?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=80'
  ],
  rutin: [
    'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80'
  ],
  egitim: [
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80'
  ],
  genel: [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80'
  ]
};

// Aliases for categories
function resolveCategoryKey(cat: string): string {
  const norm = (cat || '')
    .toLowerCase()
    .replace(/[ğ]/g, 'g')
    .replace(/[ü]/g, 'u')
    .replace(/[ş]/g, 's')
    .replace(/[ı]/g, 'i')
    .replace(/[ö]/g, 'o')
    .replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9]/g, '');

  if (norm.includes('oyun') || norm.includes('game')) return 'oyun';
  if (norm.includes('program') || norm.includes('kod') || norm.includes('yazilim') || norm.includes('dev')) return 'programlama';
  if (norm.includes('ai') || norm.includes('yapay') || norm.includes('bot') || norm.includes('zeka')) return 'ai';
  if (norm.includes('konu') || norm.includes('forum') || norm.includes('sozluk') || norm.includes('topluluk') || norm.includes('sosyal') || norm.includes('sohbet')) return 'konudisi';
  if (norm.includes('video') || norm.includes('sinema') || norm.includes('film') || norm.includes('dizi') || norm.includes('tv') || norm.includes('televizyon') || norm.includes('medya')) return 'videolar';
  if (norm.includes('rutin') || norm.includes('ajanda') || norm.includes('takvim') || norm.includes('mail') || norm.includes('araclar') || norm.includes('arac')) return 'rutin';
  if (norm.includes('egitim') || norm.includes('akademi') || norm.includes('ders') || norm.includes('kurs') || norm.includes('ogrenim')) return 'egitim';
  if (norm.includes('bilgisayar') || norm.includes('donanim') || norm.includes('pc') || norm.includes('sistem') || norm.includes('linux')) return 'bilgisayar';

  return 'genel';
}

export function getCategoryFallbackImage(category = 'genel', title = '', id?: string | number, url?: string): string {
  const key = resolveCategoryKey(category);
  const list = CATEGORY_IMAGES[key] || CATEGORY_IMAGES.genel;

  // 32-bit FNV-1a hash over (title + url + id + category) for optimal dispersion
  const seedStr = `${title || ''}|${url || ''}|${id || ''}|${category || ''}`;
  let hash = 0x811c9dc5;
  for (let i = 0; i < seedStr.length; i++) {
    hash ^= seedStr.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
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
  let hasExplicitVideo = false;

  // 1.1 /youtube [id] kısa kodu
  const ytShortcode = text.match(/\/youtube\s+([a-zA-Z0-9_-]{11})/i);
  if (ytShortcode) {
    youtubeId = ytShortcode[1];
    hasExplicitVideo = true;
  }

  // 1.2 YouTube URL'leri (youtube.com/watch?v=, youtu.be/, shorts)
  if (!youtubeId) {
    const ytUrlMatch = text.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i);
    if (ytUrlMatch) {
      youtubeId = ytUrlMatch[1];
      hasExplicitVideo = true;
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
      hasExplicitVideo = true;
    } else if (lowTitle.includes('fedora') || lowTitle.includes('legion go')) {
      youtubeId = '0kG7-7a5-Qc'; // Lenovo Legion Go S / Handheld inceleme videosu
      hasExplicitVideo = true;
    } else if (lowTitle.includes('adobe')) {
      youtubeId = 'yCvdQ9zD-14'; // Linux Adobe kurulum videosu
      hasExplicitVideo = true;
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

  // 2.3 YouTube ID varsa: Açıkça video içeriği olan yazılarda video ekle
  if (youtubeId && (hasExplicitVideo || items.length === 0)) {
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

  const primaryImage = items.find(it => it.type === 'image')?.url || (link.thumbnail ? cleanMediaUrl(link.thumbnail) : '');
  const videoItem = items.find(it => it.type === 'youtube' || it.type === 'shorts' || it.type === 'video');

  return {
    items,
    primaryImage,
    hasVideo: Boolean(videoItem),
    videoUrl: videoItem?.url,
    youtubeId: youtubeId || undefined
  };
}
