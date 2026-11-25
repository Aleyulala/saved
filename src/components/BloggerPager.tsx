import React from 'react';

interface BloggerPagerProps {
  current: number;
  total: number;
  onChange: (page: number) => void;
}

const ArrowLeft = () => (
  <svg className="line" viewBox="0 0 24 24">
    <path d="M9.57 5.92993L3.5 11.9999L9.57 18.0699" stroke="currentColor" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M20.5 12H3.67004" stroke="currentColor" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowRight = () => (
  <svg className="line" viewBox="0 0 24 24">
    <path d="M14.4301 5.92993L20.5001 11.9999L14.4301 18.0699" stroke="currentColor" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.5 12H20.33" stroke="currentColor" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * Blogger Plus UI numaralı sayfalama (numP) ile birebir aynı mantık ve düzen.
 *  - 1. sayfadaysa en başta soluk "←" kutusu, son sayfadaysa en sonda soluk "→" kutusu
 *  - Geçerli sayfa koyu kutu; önceki sayfa "← n", sonraki sayfa "n →" tek düğme
 *  - Geçerli sayfanın ±3 komşusu, ilk ve son sayfa gösterilir; ±4 uzaklıkta "..." çıkar
 */
export const BloggerPager: React.FC<BloggerPagerProps> = ({ current: l, total: r, onChange }) => {
  if (r <= 1) return null;
  const items: React.ReactNode[] = [];

  if (l - 1 === 0) {
    items.push(
      <div key="prev-off" className="nwLnk nPst disabled" aria-disabled="true" title="İlk Sayfadasınız">
        <ArrowLeft />
      </div>
    );
  }

  for (let t = 1; t <= r; t++) {
    if (t === l) {
      items.push(
        <div key={`cur-${t}`} className="nPst active" data-text={String(t)} aria-current="page">
          {t}
        </div>
      );
    } else if (t === l - 1) {
      items.push(
        <button key={`p-${t}`} type="button" className="nwLnk" data-text={String(t)} aria-label="Önceki Sayfa" title="Önceki Sayfa" onClick={() => onChange(t)}>
          <ArrowLeft />
        </button>
      );
    } else if (t === l + 1) {
      items.push(
        <button key={`p-${t}`} type="button" className="olLnk" data-text={String(t)} aria-label="Sonraki Sayfa" title="Sonraki Sayfa" onClick={() => onChange(t)}>
          <ArrowRight />
        </button>
      );
    } else if ((t >= l - 3 && t <= l + 3) || t === 1 || t === r) {
      items.push(
        <button key={`p-${t}`} type="button" aria-label={`Sayfa ${t}`} onClick={() => onChange(t)}>
          {t}
        </button>
      );
    } else if (t === l - 4 || t === l + 4) {
      items.push(
        <div key={`el-${t}`} className="nPst ellipsis" aria-hidden="true">
          ...
        </div>
      );
    }
  }

  if (l + 1 > r) {
    items.push(
      <div key="next-off" className="olLnk nPst disabled" aria-disabled="true" title="Son Sayfadasınız">
        <ArrowRight />
      </div>
    );
  }

  return (
    <nav id="blog-pager" aria-label="Sayfalama" className="blogN numP">
      {items}
    </nav>
  );
};
