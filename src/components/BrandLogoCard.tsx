import React from 'react';
import { getDomain } from '../utils/favicon';

interface BrandLogoCardProps {
  url: string;
  title?: string;
  size?: 'card' | 'detail';
}

interface BrandDefinition {
  name: string;
  gradient: string;
  svg: React.ReactNode;
}

// Crisp, razor-sharp SVGs for popular services
const BRAND_MAP: Record<string, BrandDefinition> = {
  'matrix.to': {
    name: 'Matrix',
    gradient: 'from-emerald-950/70 via-[#0e2118]/80 to-[#191e24]',
    svg: (
      <svg viewBox="0 0 24 24" className="w-full h-full text-[#0dbd8b] fill-current drop-shadow-md">
        <path d="M.632.55v22.9H2.28V24H0V0h2.28v.55zm7.043 7.26v1.157h.058c.222-.446.543-.807.965-1.082.42-.275.931-.413 1.533-.413.65 0 1.228.163 1.735.488.508.326.87.801 1.087 1.427.254-.457.62-.835 1.099-1.134.48-.3 1.04-.45 1.68-.45.69 0 1.306.166 1.848.498.542.333.948.81 1.218 1.433.27.623.406 1.401.406 2.334V20.4H16.8v-6.07c0-.662-.058-1.192-.174-1.59-.117-.398-.328-.7-.633-.906-.305-.205-.72-.308-1.246-.308-.49 0-.904.108-1.243.324-.34.216-.582.527-.726.932-.145.405-.217.954-.217 1.647V20.4H10.1v-6.07c0-.648-.057-1.173-.17-1.576-.114-.403-.322-.708-.624-.914-.303-.207-.714-.31-1.233-.31-.504 0-.93.109-1.278.326-.348.217-.597.53-.746.938-.15.409-.224.965-.224 1.668V20.4H3.36V7.81zm15.693 15.64V.55H21.72V0H24v24h-2.28v-.55z" />
      </svg>
    )
  },
  'matrix.org': {
    name: 'Matrix',
    gradient: 'from-emerald-950/70 via-[#0e2118]/80 to-[#191e24]',
    svg: (
      <svg viewBox="0 0 24 24" className="w-full h-full text-[#0dbd8b] fill-current drop-shadow-md">
        <path d="M.632.55v22.9H2.28V24H0V0h2.28v.55zm7.043 7.26v1.157h.058c.222-.446.543-.807.965-1.082.42-.275.931-.413 1.533-.413.65 0 1.228.163 1.735.488.508.326.87.801 1.087 1.427.254-.457.62-.835 1.099-1.134.48-.3 1.04-.45 1.68-.45.69 0 1.306.166 1.848.498.542.333.948.81 1.218 1.433.27.623.406 1.401.406 2.334V20.4H16.8v-6.07c0-.662-.058-1.192-.174-1.59-.117-.398-.328-.7-.633-.906-.305-.205-.72-.308-1.246-.308-.49 0-.904.108-1.243.324-.34.216-.582.527-.726.932-.145.405-.217.954-.217 1.647V20.4H10.1v-6.07c0-.648-.057-1.173-.17-1.576-.114-.403-.322-.708-.624-.914-.303-.207-.714-.31-1.233-.31-.504 0-.93.109-1.278.326-.348.217-.597.53-.746.938-.15.409-.224.965-.224 1.668V20.4H3.36V7.81zm15.693 15.64V.55H21.72V0H24v24h-2.28v-.55z" />
      </svg>
    )
  },
  'github.com': {
    name: 'GitHub',
    gradient: 'from-slate-900/90 via-[#161b26]/90 to-[#1f2430]',
    svg: (
      <svg viewBox="0 0 24 24" className="w-full h-full text-white fill-current drop-shadow-md">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    )
  },
  'telegram.org': {
    name: 'Telegram',
    gradient: 'from-sky-950/70 via-[#0d2235]/80 to-[#18202a]',
    svg: (
      <svg viewBox="0 0 24 24" className="w-full h-full text-[#229ed9] fill-current drop-shadow-md">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.19-.08-.05-.19-.02-.27 0-.12.03-1.99 1.27-5.62 3.72-.53.36-1.01.54-1.44.53-.47-.01-1.38-.27-2.06-.49-.83-.27-1.49-.42-1.43-.88.03-.24.37-.49 1.02-.75 3.98-1.73 6.64-2.88 7.97-3.44 3.8-1.58 4.59-1.86 5.1-1.87.11 0 .37.03.54.17.14.12.18.28.2.45-.02.07-.02.13-.03.22z" />
      </svg>
    )
  },
  'web.telegram.org': {
    name: 'Telegram',
    gradient: 'from-sky-950/70 via-[#0d2235]/80 to-[#18202a]',
    svg: (
      <svg viewBox="0 0 24 24" className="w-full h-full text-[#229ed9] fill-current drop-shadow-md">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.19-.08-.05-.19-.02-.27 0-.12.03-1.99 1.27-5.62 3.72-.53.36-1.01.54-1.44.53-.47-.01-1.38-.27-2.06-.49-.83-.27-1.49-.42-1.43-.88.03-.24.37-.49 1.02-.75 3.98-1.73 6.64-2.88 7.97-3.44 3.8-1.58 4.59-1.86 5.1-1.87.11 0 .37.03.54.17.14.12.18.28.2.45-.02.07-.02.13-.03.22z" />
      </svg>
    )
  },
  'reddit.com': {
    name: 'Reddit',
    gradient: 'from-orange-950/70 via-[#271712]/80 to-[#1c1d24]',
    svg: (
      <svg viewBox="0 0 24 24" className="w-full h-full text-[#ff4500] fill-current drop-shadow-md">
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.56 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.702zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.197-2.512-.73a.326.326 0 0 0-.232-.095z" />
      </svg>
    )
  },
  'eksisozluk.com': {
    name: 'Ekşi Sözlük',
    gradient: 'from-emerald-950/70 via-[#12241b]/80 to-[#191d24]',
    svg: (
      <div className="w-full h-full rounded-full bg-[#82bc41] flex items-center justify-center text-white font-serif font-black text-2xl select-none shadow-md">
        e
      </div>
    )
  },
  'donanimhaber.com': {
    name: 'DonanımHaber',
    gradient: 'from-blue-950/70 via-[#101b2d]/80 to-[#191c26]',
    svg: (
      <div className="w-full h-full rounded-xl bg-gradient-to-tr from-[#0047ba] to-[#0072ff] flex items-center justify-center text-white font-sans font-black text-xs tracking-tighter shadow-md">
        DH
      </div>
    )
  },
  'technopat.net': {
    name: 'Technopat',
    gradient: 'from-sky-950/70 via-[#10202e]/80 to-[#191e28]',
    svg: (
      <div className="w-full h-full rounded-xl bg-gradient-to-tr from-[#0088cc] to-[#00bfff] flex items-center justify-center text-white font-sans font-black text-sm shadow-md">
        TP
      </div>
    )
  },
  'mail.google.com': {
    name: 'Gmail',
    gradient: 'from-red-950/60 via-[#261719]/80 to-[#1e1e24]',
    svg: (
      <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-md">
        <path fill="#4285F4" d="M1.5 5.5v13a2 2 0 0 0 2 2h3v-9.5L1.5 7.5z" />
        <path fill="#34A853" d="M22.5 5.5v13a2 2 0 0 1-2 2h-3v-9.5l5-3.5z" />
        <path fill="#EA4335" d="M6.5 11V4l5.5 4.5L17.5 4v7z" />
        <path fill="#FBBC04" d="M1.5 5.5l5 3.5V4l-3-2a2 2 0 0 0-2 2v1.5zM22.5 5.5l-5 3.5V4l3-2a2 2 0 0 1 2 2v1.5z" />
      </svg>
    )
  },
  'calendar.google.com': {
    name: 'Google Calendar',
    gradient: 'from-blue-950/60 via-[#121e33]/80 to-[#1c1f28]',
    svg: (
      <div className="w-full h-full rounded-xl bg-white flex flex-col items-center justify-between p-1.5 shadow-md">
        <div className="w-full text-center text-[9px] font-black text-[#1a73e8] uppercase tracking-wider border-b border-slate-100 pb-0.5">
          Eki
        </div>
        <div className="text-base font-black text-slate-800 leading-none pb-0.5">
          31
        </div>
      </div>
    )
  },
  'turkiye.gov.tr': {
    name: 'e-Devlet',
    gradient: 'from-red-950/70 via-[#2a1315]/80 to-[#1e1c22]',
    svg: (
      <div className="w-full h-full rounded-full bg-[#e30a17] flex items-center justify-center text-white text-base font-bold shadow-md">
        ☪
      </div>
    )
  },
  'nextcloud.com': {
    name: 'Nextcloud',
    gradient: 'from-blue-950/60 via-[#0e1d32]/80 to-[#181f28]',
    svg: (
      <svg viewBox="0 0 24 24" className="w-full h-full text-[#0082c9] fill-current drop-shadow-md">
        <path d="M12 4.5A7.5 7.5 0 0 0 4.5 12 7.5 7.5 0 0 0 12 19.5 7.5 7.5 0 0 0 19.5 12 7.5 7.5 0 0 0 12 4.5zm0 2A5.5 5.5 0 0 1 17.5 12 5.5 5.5 0 0 1 12 17.5 5.5 5.5 0 0 1 6.5 12 5.5 5.5 0 0 1 12 6.5zM3 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zm18 0a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z" />
      </svg>
    )
  },
  'feedly.com': {
    name: 'Feedly',
    gradient: 'from-emerald-950/60 via-[#102419]/80 to-[#191d24]',
    svg: (
      <div className="w-full h-full rounded-xl bg-[#2bb24c] flex items-center justify-center text-white font-sans font-black text-base shadow-md">
        f
      </div>
    )
  },
  'rss.app': {
    name: 'RSS',
    gradient: 'from-amber-950/60 via-[#271b12]/80 to-[#1c1d24]',
    svg: (
      <svg viewBox="0 0 24 24" className="w-full h-full text-[#ff6600] fill-current drop-shadow-md">
        <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19 7.38 20 6.18 20C5 20 4 19 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z" />
      </svg>
    )
  },
  'x.com': {
    name: 'X',
    gradient: 'from-slate-950 via-[#12141a] to-[#181a20]',
    svg: (
      <svg viewBox="0 0 24 24" className="w-full h-full text-white fill-current drop-shadow-md">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    )
  },
  'twitter.com': {
    name: 'Twitter',
    gradient: 'from-slate-950 via-[#12141a] to-[#181a20]',
    svg: (
      <svg viewBox="0 0 24 24" className="w-full h-full text-white fill-current drop-shadow-md">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    )
  },
  'youtube.com': {
    name: 'YouTube',
    gradient: 'from-red-950/70 via-[#271214]/80 to-[#1c1c24]',
    svg: (
      <svg viewBox="0 0 24 24" className="w-full h-full text-[#ff0000] fill-current drop-shadow-md">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    )
  }
};

// Generates an aesthetic, deterministic color gradient for any generic domain
function getGenericTheme(domain: string) {
  let hash = 0;
  for (let i = 0; i < domain.length; i++) {
    hash = (hash << 5) - hash + domain.charCodeAt(i);
    hash |= 0;
  }
  const themes = [
    {
      gradient: 'from-indigo-950/60 via-[#18172b]/70 to-[#222432]',
      accent: '#818cf8',
      spot: 'bg-indigo-500/15'
    },
    {
      gradient: 'from-sky-950/60 via-[#141e2e]/70 to-[#1e2330]',
      accent: '#38bdf8',
      spot: 'bg-sky-500/15'
    },
    {
      gradient: 'from-emerald-950/60 via-[#12241e]/70 to-[#1c2422]',
      accent: '#34d399',
      spot: 'bg-emerald-500/15'
    },
    {
      gradient: 'from-purple-950/60 via-[#23152d]/70 to-[#261f2c]',
      accent: '#c084fc',
      spot: 'bg-purple-500/15'
    },
    {
      gradient: 'from-amber-950/50 via-[#261d15]/70 to-[#28231c]',
      accent: '#fbbf24',
      spot: 'bg-amber-500/15'
    }
  ];
  return themes[Math.abs(hash) % themes.length];
}

// Extracts clean 1-2 letter monogram from domain
function getMonogram(domain: string): string {
  const clean = domain.replace(/^www\./, '').split('.')[0] || domain;
  if (clean.length <= 2) return clean.toUpperCase();
  return (clean.charAt(0) + clean.charAt(1)).toUpperCase();
}

export const BrandLogoCard: React.FC<BrandLogoCardProps> = ({
  url,
  title,
  size = 'card'
}) => {
  const domain = getDomain(url).toLowerCase();
  
  // Find brand by matching domain or subdomains
  let brand: BrandDefinition | undefined;
  for (const [key, val] of Object.entries(BRAND_MAP)) {
    if (domain === key || domain.endsWith('.' + key)) {
      brand = val;
      break;
    }
  }

  // Also check if domain contains google services
  if (!brand && domain.includes('google.')) {
    brand = {
      name: 'Google',
      gradient: 'from-blue-950/60 via-[#151d2c]/80 to-[#1e222e]',
      svg: (
        <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-md">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
      )
    };
  }

  const generic = getGenericTheme(domain);
  const monogram = getMonogram(domain);
  const isLarge = size === 'detail';

  return (
    <div className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr ${brand ? brand.gradient : generic.gradient} relative p-4 select-none overflow-hidden group`}>
      {/* Dynamic Background Spot Glow */}
      <div className={`absolute w-36 h-36 rounded-full blur-3xl pointer-events-none opacity-40 ${generic.spot}`} />
      
      {/* Micro-dot grid pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />

      {/* Glassmorphic Logo Emblem */}
      <div 
        className={`relative z-10 rounded-2xl bg-white/[0.08] hover:bg-white/[0.12] backdrop-blur-xl border border-white/15 shadow-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-108 group-hover:border-white/30 ${
          isLarge ? 'w-20 h-20 p-4 mb-3' : 'w-14 h-14 p-3 shadow-lg'
        }`}
      >
        {brand ? (
          <div className="w-full h-full flex items-center justify-center">
            {brand.svg}
          </div>
        ) : (
          <span 
            className="font-sans font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-tr from-white via-slate-100 to-sky-300 drop-shadow select-none"
            style={{ fontSize: isLarge ? '24px' : '17px' }}
          >
            {monogram}
          </span>
        )}
      </div>

      {/* Domain Badge Pill */}
      <div className="relative z-10 mt-2 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 shadow-sm max-w-[200px] group-hover:border-white/20 transition-colors">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--linkC,#60cdff)] shrink-0" />
        <span className="text-[11px] font-semibold text-slate-200 tracking-wide truncate group-hover:text-white transition-colors">
          {domain}
        </span>
      </div>

      {/* Optional Post Title snippet for detail view */}
      {isLarge && title && (
        <span className="relative z-10 text-xs text-[#989b9f] mt-1.5 max-w-[360px] text-center truncate px-4">
          {title}
        </span>
      )}
    </div>
  );
};
