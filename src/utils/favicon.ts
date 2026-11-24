export function getDomain(urlStr: string): string {
  try {
    const parsed = new URL(urlStr.startsWith('http://') || urlStr.startsWith('https://') ? urlStr : `https://${urlStr}`);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return urlStr;
  }
}

export function getFaviconUrl(urlStr: string): string {
  const domain = getDomain(urlStr);
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`;
}

const TR_MONTHS = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];

/** Blogger temasıyla aynı tarih biçimi: "Eki 13" (withYear=true ise "Eki 23, 2026"). */
export function formatBlogDate(timestamp: number, withYear = false): string {
  if (!timestamp) return '';
  const d = new Date(timestamp);
  const base = `${TR_MONTHS[d.getMonth()]} ${d.getDate()}`;
  return withYear ? `${base}, ${d.getFullYear()}` : base;
}

export function formatDate(timestamp: number): string {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const now = new Date();
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffSec < 60) return 'Az önce';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)} dk önce`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} saat önce`;
  if (diffSec < 86400 * 7) return `${Math.floor(diffSec / 86400)} gün önce`;

  return date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
}
