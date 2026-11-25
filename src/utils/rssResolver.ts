/**
 * Automatic RSS / Atom Resolver Helper
 * Birebir saved-main/index.html motoru ve genişletilmiş RSS tespit mantığı
 */

/** Alan adı -> bilinen akış (GitHub sürümleri veya resmi blog) */
const KNOWN_FEEDS: Record<string, string> = {
  'news.ycombinator.com': 'https://hnrss.org/frontpage',
  'immich.app': 'https://github.com/immich-app/immich/releases.atom',
  'navidrome.org': 'https://github.com/navidrome/navidrome/releases.atom',
  'penpot.app': 'https://github.com/penpot/penpot/releases.atom',
  'chatwoot.com': 'https://github.com/chatwoot/chatwoot/releases.atom',
  'jellyfin.org': 'https://github.com/jellyfin/jellyfin/releases.atom',
  'umami.is': 'https://github.com/umami-software/umami/releases.atom',
  'plausible.io': 'https://github.com/plausible/analytics/releases.atom',
  'excalidraw.com': 'https://github.com/excalidraw/excalidraw/releases.atom',
  'ollama.com': 'https://github.com/ollama/ollama/releases.atom',
  'openwebui.com': 'https://github.com/open-webui/open-webui/releases.atom',
  'matomo.org': 'https://matomo.org/blog/feed/',
  'home-assistant.io': 'https://www.home-assistant.io/atom.xml',
  'huggingface.co': 'https://huggingface.co/blog/feed.xml',
  'lutris.net': 'https://github.com/lutris/lutris/releases.atom',
  'heroicgameslauncher.com': 'https://github.com/Heroic-Games-Launcher/HeroicGamesLauncher/releases.atom',
  'audiobookshelf.org': 'https://github.com/advplyr/audiobookshelf/releases.atom'
};

export function resolveRss(urlOrLink: string | { url?: string; rss?: string }, guess?: { value: boolean }): string {
  if (!urlOrLink) return '';
  
  if (typeof urlOrLink !== 'string') {
    if (urlOrLink.rss && String(urlOrLink.rss).trim()) {
      return String(urlOrLink.rss).trim();
    }
    return resolveRss(urlOrLink.url || '', guess);
  }

  const u = String(urlOrLink).trim();
  if (!u) return '';

  try {
    const parsed = new URL(/^https?:\/\//i.test(u) ? u : 'https://' + u);
    const host = parsed.hostname.toLowerCase();
    const origin = parsed.origin;
    const pathname = parsed.pathname.replace(/\/+$/, '');

    // 1. YouTube (kanal, kullanıcı, oynatma listesi; @kullanıcıadı için discoverRss sayfadan bulur)
    if (host.includes('youtube.com') || host === 'youtu.be') {
      if (pathname.includes('/channel/')) {
        const id = pathname.split('/channel/')[1]?.split('/')[0];
        if (id) return `https://www.youtube.com/feeds/videos.xml?channel_id=${id}`;
      }
      if (pathname.includes('/user/')) {
        const user = pathname.split('/user/')[1]?.split('/')[0];
        if (user) return `https://www.youtube.com/feeds/videos.xml?user=${user}`;
      }
      const list = parsed.searchParams.get('list');
      if (list) return `https://www.youtube.com/feeds/videos.xml?playlist_id=${list}`;
      return '';
    }

    // 2. Reddit
    if (host.includes('reddit.com')) {
      return pathname ? `${origin}${pathname}/.rss` : `${origin}/.rss`;
    }

    // 3. Blogger & Blogspot
    if (host.includes('blogspot.com') || host.includes('blogger.com')) {
      return `${origin}/feeds/posts/default?alt=rss`;
    }

    // 4. Medium
    if (host.includes('medium.com')) {
      return pathname ? `${origin}/feed${pathname}` : `${origin}/feed`;
    }

    // 5. GitHub: depo -> sürümler, kullanıcı -> etkinlik, github.io -> /feed.xml
    if (host === 'github.com' || host === 'www.github.com') {
      const parts = pathname.split('/').filter(Boolean);
      if (parts.length >= 2 && !['topics', 'orgs', 'trending', 'features', 'sponsors'].includes(parts[0])) {
        return `${origin}/${parts[0]}/${parts[1]}/releases.atom`;
      }
      if (parts.length === 1 && !['trending', 'explore', 'topics', 'features', 'about'].includes(parts[0])) {
        return `${origin}/${parts[0]}.atom`;
      }
      return '';
    }
    if (host.endsWith('.github.io')) {
      if (guess) guess.value = true;
      const first = pathname.split('/').filter(Boolean)[0];
      return `${origin}${first ? '/' + first : ''}/feed.xml`;
    }
    if (host === 'gitlab.com') {
      const projectPath = pathname.split('/-/')[0].split('/').filter(Boolean);
      if (projectPath.length >= 2) return `${origin}/${projectPath.join('/')}/-/tags?format=atom`;
      return '';
    }

    // 5b. Bilinen siteler için doğrudan akış (sürüm / blog)
    const known = KNOWN_FEEDS[host.replace(/^www\./, '')];
    if (known) return known;

    // 6. Bilinen Platformlar & Servisler (saved-main birebir)
    if (host.includes('dropbox.com')) return 'https://blog.dropbox.com/feed';
    if (host.includes('fiverr.com')) return 'https://blog.fiverr.com/feed';
    if (host.includes('shopify.com')) return 'https://www.shopify.com/blog.atom';
    if (host.includes('hubspot.com')) return 'https://blog.hubspot.com/rss.xml';
    if (host.includes('trello.com')) return 'https://blog.trello.com/feed';
    if (host.includes('toptal.com')) return 'https://www.toptal.com/blog.rss';
    if (host.includes('matrix.org')) return 'https://matrix.org/blog/feed.xml';
    if (host.includes('pcloud.com')) return 'https://blog.pcloud.com/feed/';
    if (host.includes('multcloud.com')) return 'https://www.multcloud.com/rss.xml';
    if (host.includes('terabox.com')) return 'https://www.terabox.com/rss.xml';
    if (host.includes('sync.com')) return 'https://www.sync.com/rss.xml';
    if (host.includes('nextcloud.com')) return 'https://nextcloud.com/blog/feed/';
    if (host.includes('substack.com')) return `${origin}/feed`;
    if (host.includes('dev.to')) {
      const parts = pathname.split('/').filter(Boolean);
      return parts.length >= 1 ? `https://dev.to/feed/${parts[0]}` : 'https://dev.to/feed';
    }

    // 7. Popüler Türk & Global Web Siteleri / CMS
    if (
      host.includes('wordpress') || 
      host.includes('shiftdelete') || 
      host.includes('webtekno') || 
      host.includes('donanimhaber') || 
      host.includes('bundlehaber') || 
      host.includes('bebarbilim') || 
      host.includes('siberkurs') || 
      host.includes('yazbel') || 
      host.includes('r10.net') ||
      host.includes('spunkram') ||
      host.includes('tulinkayalar') ||
      host.includes('inxanitylabs') ||
      host.includes('rasulov')
    ) {
      if (guess) guess.value = true;
      return `${origin}/feed/`;
    }

    if (host.includes('deviantart.com')) {
      return 'https://backend.deviantart.com/rss.xml?q=boost%3Apopular+max_age%3A8h';
    }

    // 8. Standart Blog / Haber URL Desenleri
    if (pathname.includes('/blog') || pathname.includes('/news') || pathname.includes('/articles')) {
      if (guess) guess.value = true;
      return `${origin}/feed/`;
    }

    return '';
  } catch {
    return '';
  }
}

/**
 * Site için alternatif RSS / Atom aday bağlantıları listeler
 */
export function getCandidateRssUrls(url: string): string[] {
  if (!url) return [];
  try {
    const parsed = new URL(/^https?:\/\//i.test(url) ? url : 'https://' + url);
    const origin = parsed.origin;
    const resolved = resolveRss(url);
    const candidates = new Set<string>();

    if (resolved) candidates.add(resolved);
    candidates.add(`${origin}/feed/`);
    candidates.add(`${origin}/feed`);
    candidates.add(`${origin}/rss.xml`);
    candidates.add(`${origin}/atom.xml`);
    candidates.add(`${origin}/feeds/posts/default?alt=rss`);
    candidates.add(`${origin}/feed.xml`);
    
    return Array.from(candidates);
  } catch {
    return [];
  }
}

/* ------------------------------------------------------------------ */
/* Sayfadan akış keşfi (RSS Bul düğmesi)                              */
/* ------------------------------------------------------------------ */

/** Metin gerçekten bir RSS / Atom / RDF akışına benziyor mu */
export function looksLikeFeed(text: string): boolean {
  const head = (text || '').trimStart().slice(0, 600).toLowerCase();
  return /<(rss|feed|rdf:rdf)[\s>]/.test(head) || (head.startsWith('<?xml') && /<(rss|feed|rdf:rdf)[\s>]/.test((text || '').slice(0, 2000).toLowerCase()));
}

/** HTML içindeki <link rel="alternate" type="application/rss+xml|atom+xml"> adreslerini mutlak URL olarak döndürür */
export function extractFeedLinks(html: string, baseUrl: string): string[] {
  const out: string[] = [];
  const add = (href: string) => {
    try {
      const abs = new URL(href.replace(/&amp;/g, '&'), baseUrl).href;
      if (!out.includes(abs)) out.push(abs);
    } catch { /* geçersiz adres */ }
  };
  const tags = html.match(/<link\b[^>]*>/gi) || [];
  for (const tag of tags) {
    if (!/rel\s*=\s*["']?[^"'>]*alternate/i.test(tag)) continue;
    if (!/type\s*=\s*["']?application\/(rss|atom)\+xml/i.test(tag)) continue;
    const m = tag.match(/href\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
    const href = m && (m[1] || m[2] || m[3]);
    if (href) add(href);
  }
  // YouTube sayfaları (@kullanıcıadı): kanal kimliğinden akış
  const ch = html.match(/"(?:channelId|externalId)"\s*:\s*"(UC[\w-]{20,24})"/) || html.match(/channel_id=(UC[\w-]{20,24})/);
  if (ch && /youtube\.com/i.test(baseUrl)) add(`https://www.youtube.com/feeds/videos.xml?channel_id=${ch[1]}`);
  return out;
}

const PROXIES: Array<(u: string) => string> = [
  (u) => u,
  (u) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
  (u) => `https://corsproxy.io/?url=${encodeURIComponent(u)}`
];

async function fetchText(url: string, timeoutMs = 7000): Promise<string> {
  for (const wrap of PROXIES) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const res = await fetch(wrap(url), { signal: ctrl.signal });
      if (res.ok) {
        const text = await res.text();
        if (text) return text;
      }
    } catch { /* sıradaki yolu dene */ } finally {
      clearTimeout(timer);
    }
  }
  return '';
}

/**
 * Önce bilinen kurallara bakar; yoksa sayfayı açıp <link rel="alternate"> arar;
 * o da yoksa yaygın adresleri (/feed, /rss.xml ...) yoklayıp gerçekten akış olanı döndürür.
 */
export async function discoverRss(url: string): Promise<string> {
  if (!url) return '';
  const g = { value: false };
  const quick = resolveRss(url, g);
  if (quick && !g.value) return quick;
  let full = url.trim();
  if (!/^https?:\/\//i.test(full)) full = 'https://' + full;

  const html = await fetchText(full);
  if (html) {
    if (looksLikeFeed(html)) return full;
    const links = extractFeedLinks(html, full);
    if (links.length) return links[0];
  }
  // Tahmini adres doğrulanabiliyorsa onu, doğrulanamıyorsa (ağ yok) yine de tahmini döndür
  const tryList = getCandidateRssUrls(full);
  for (const cand of tryList) {
    const text = await fetchText(cand, 5000);
    if (text && looksLikeFeed(text)) return cand;
  }
  return quick;
}
