export function getDomain(urlStr: string): string {
  try {
    const parsed = new URL(urlStr.startsWith('http://') || urlStr.startsWith('https://') ? urlStr : `https://${urlStr}`);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return urlStr;
  }
}

/** Matrix [m] işareti (Matrix ve Element aynı ağ olduğu için ikisi de bunu kullanır) */
const MATRIX_PATH = "M.632.55v22.9H2.28V24H0V0h2.28v.55zm7.043 7.26v1.157h.058c.222-.446.543-.807.965-1.082.42-.275.931-.413 1.533-.413.65 0 1.228.163 1.735.488.508.326.87.801 1.087 1.427.254-.457.62-.835 1.099-1.134.48-.3 1.04-.45 1.68-.45.69 0 1.306.166 1.848.498.542.333.948.81 1.218 1.433.27.623.406 1.401.406 2.334V20.4H16.8v-6.07c0-.662-.058-1.192-.174-1.59-.117-.398-.328-.7-.633-.906-.305-.205-.72-.308-1.246-.308-.49 0-.904.108-1.243.324-.34.216-.582.527-.726.932-.145.405-.217.954-.217 1.647V20.4H10.1v-6.07c0-.648-.057-1.173-.17-1.576-.114-.403-.322-.708-.624-.914-.303-.207-.714-.31-1.233-.31-.504 0-.93.109-1.278.326-.348.217-.597.53-.746.938-.15.409-.224.965-.224 1.668V20.4H3.36V7.81zm15.693 15.64V.55H21.72V0H24v24h-2.28v-.55z";
const MATRIX_ICON =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" rx="5" fill="#0b1f18"/><g transform="translate(3.6 3.6) scale(.7)"><path fill="#0dbd8b" d="${MATRIX_PATH}"/></g></svg>`
  );

/** Google'ın simge servisinin boş/genel simge döndürdüğü bilinen siteler için gömülü logolar */
const BRAND_ICONS: Record<string, string> = {
  'matrix.to': MATRIX_ICON,
  'matrix.org': MATRIX_ICON,
  'element.io': MATRIX_ICON
};

export function getFaviconUrl(urlStr: string): string {
  const domain = getDomain(urlStr).toLowerCase();
  for (const [host, icon] of Object.entries(BRAND_ICONS)) {
    if (domain === host || domain.endsWith('.' + host)) return icon;
  }
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
