import React, { useState } from 'react';
import { 
  HomeIcon,
  Hierarchy4Icon,
  FlashIcon,
  FolderCodeIcon,
  MessageNotif1Icon,
  Edit3Icon,
  Profile2UserIcon,
  EyeIcon,
  Verify1Icon,
  SmsEditIcon,
  ArrowSwapHorizontalIcon,
  SearchNormalIcon,
  SpeedometerIcon,
  ChevronDownIcon,
  InstagramIcon, 
  TelegramIcon, 
  MailIcon, 
  VkIcon,
  MatrixIcon,
  WhatsappIcon,
  GoogleChatIcon,
  TiktokIcon,
  LabsIcon
} from './BloggerIcons';
import { CollectionItem, TagItem } from '../types';

interface BloggerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentTab: string;
  onSelectTab: (tab: any) => void;
  collections?: CollectionItem[];
  tags?: TagItem[];
  counts: {
    all: number;
    pinned: number;
    trash: number;
    collections: Record<number, number>;
    tags: Record<string, number>;
  };
  activeCollectionId?: number | null;
  activeTag?: string | null;
  onSelectCollection?: (id: number) => void;
  onSelectTag?: (tag: string) => void;
  onOpenNewLink: () => void;
  onOpenManageCollections?: () => void;
  onOpenManageTags?: () => void;
  onOpenImportExport?: () => void;
  onOpenSettings?: () => void;
  onSearchSubmit?: (query: string) => void;
  onOpenSearchModal?: () => void;
}

export const BloggerDrawer: React.FC<BloggerDrawerProps> = ({
  isOpen,
  onClose,
  currentTab,
  onSelectTab,
  counts,
  onOpenSearchModal
}) => {
  const [hizmetlerOpen, setHizmetlerOpen] = useState(false);
  const [klasorOpen, setKlasorOpen] = useState(false);
  const [gelistiriciOpen, setGelistiriciOpen] = useState(false);
  const [localSearch] = useState('');
  const [footerSlideIndex, setFooterSlideIndex] = useState(0);
  const [socSlideIndex, setSocSlideIndex] = useState(0);

  const drawerSocialLinks = [
    { name: 'Instagram', href: 'https://www.instagram.com/aleyul.ala/', icon: InstagramIcon },
    { name: 'Telegram', href: 'https://t.me/aleyyulala', icon: TelegramIcon },
    { name: 'TikTok', href: 'https://www.tiktok.com/@Aleyyu.Ala', icon: TiktokIcon },
    { name: 'Matrix', href: 'https://matrix.to/#/#negronn-show:matrix.org', icon: MatrixIcon },
    { name: 'VKontakte', href: 'https://vk.com/negronn', icon: VkIcon },
    { name: 'WhatsApp', href: 'tel:05446412904', icon: WhatsappIcon }
  ];

  React.useEffect(() => {
    const timer = setInterval(() => {
      setFooterSlideIndex(prev => (prev + 1) % 3);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setSocSlideIndex(prev => (prev + 1) % 6);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex select-none">
      {/* Backdrop overlay (.fCls) */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* Drawer Panel (.mainL / .mnBr) */}
      <aside 
        className="blogger-drawer relative w-[85vw] max-w-[360px] bg-[#1e1e1e] border-r border-[#252526] h-full flex flex-col justify-between shadow-2xl z-10 overflow-hidden transform transition-transform duration-300 ease-out"
      >
        {/* Drawer Header (.mnH - XML 1:1: Çarpı kaldırıldı, NSONE Yazı Logo) */}
        <div className="h-[52px] px-4 border-b border-[#252526] flex items-center bg-[#1e1e1e]">
          <div className="flex items-center">
            <span className="font-sans font-extrabold text-[16px] tracking-[0.22em] uppercase text-white">
              NESCİONE
            </span>
          </div>
        </div>

        {/* Drawer Scrollable Content (.mnMen) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          
          {/* Fast Search input */}
          <div 
            onClick={() => {
              if (onOpenSearchModal) {
                onClose();
                onOpenSearchModal();
              }
            }}
            className="relative cursor-pointer group"
            title="Gelişmiş Arama & Bul Paneli (Ctrl+K)"
          >
            <input
              type="text"
              value={localSearch}
              readOnly
              placeholder="Bul... (Ctrl+K)"
              className="w-full bg-[#252526] border border-transparent rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-[#737373] outline-none cursor-pointer"
            />
            <SearchNormalIcon className="w-[18px] h-[18px] text-[#737373] group-hover:text-[var(--linkC,#9aa0a6)] transition-colors absolute left-2.5 top-2.5 pointer-events-none" />
          </div>

          {/* Blogger Gezinme Menüsü (.mnMn) */}
          <ul className="space-y-1 mnMn">
            
            {/* 1. KÖK BUTON: Ana Sayfa (svg.home) - XML 1:1: Sadece ana sayfa DIŞINDAKİ sayfalarda gözükür (!data:view.isHomepage) */}
            {currentTab !== 'dashboard' && (
              <li>
                <button
                  onClick={() => {
                    onClose();
                    onSelectTab('dashboard');
                  }}
                  className="w-full group flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition-colors cursor-pointer outline-none text-[#d4d4d4] hover:bg-transparent hover:text-[var(--linkC,#9aa0a6)]"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-semibold text-xs">Ana Sayfa</span>
                    <HomeIcon className="w-[18px] h-[18px] shrink-0 opacity-80 text-[var(--linkC,#9aa0a6)]" />
                  </div>
                </button>
              </li>
            )}

            {/* 2. KLASÖR 1: Uygulamalar (svg.hierarchy-4) */}
            <li className="pt-1 relative">
              <div 
                onClick={() => setHizmetlerOpen(!hizmetlerOpen)}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold text-[#d4d4d4] hover:bg-transparent hover:text-[var(--linkC,#9aa0a6)] cursor-pointer transition-colors outline-none relative"
              >
                <div className="flex items-center gap-2.5">
                  <span>Uygulamalar</span>
                  <span className="badge-new text-[var(--linkC,#9aa0a6)] text-[11px] font-bold ml-1">
                    Yeni!
                  </span>
                  <Hierarchy4Icon className="w-[18px] h-[18px] shrink-0 opacity-80 text-[var(--linkC,#9aa0a6)]" />
                </div>
                {/* xml 1:1 li.nt-tl bildirim noktası (Sol Üst) */}
                <span className="absolute top-2 left-2 w-2 h-2 rounded-full bg-[var(--linkC,#9aa0a6)] shadow-[0_0_8px_var(--linkC,#9aa0a6)] animate-pulse" />
                
                <ChevronDownIcon className={`w-3.5 h-3.5 text-[#989b9f] transition-transform duration-300 ${hizmetlerOpen ? 'rotate-180' : ''}`} />
              </div>

              {hizmetlerOpen && (
                <ul className="space-y-0.5 pl-3 border-l border-white/10 ml-4 mt-1">
                  {/* 1. Saved (svg.eye) */}
                  <li>
                    <button
                      onClick={() => {
                        onClose();
                        onSelectTab('links');
                      }}
                      className={`w-full group flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors cursor-pointer outline-none ${
                        currentTab === 'links'
                          ? 'text-[var(--linkC,#9aa0a6)] font-bold'
                          : 'text-[#d4d4d4] hover:bg-transparent hover:text-[var(--linkC,#9aa0a6)]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>NESCİONE</span>
                        <EyeIcon className="w-[18px] h-[18px] shrink-0 opacity-80 text-[#9ca3af] group-hover:text-[var(--linkC,#9aa0a6)]" />
                      </div>
                      <span className="text-[10px] text-[#9ca3af] font-mono">{counts.all}</span>
                    </button>
                  </li>

                  {/* 2. NotebookLM (svg.edit-3) */}
                  <li>
                    <a
                      href="https://notebooklm.google.com/"
                      target="_blank"
                      rel="nofollow noreferrer noopener"
                      className="w-full group flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-[#d4d4d4] hover:bg-transparent hover:text-[var(--linkC,#9aa0a6)] transition-colors outline-none"
                    >
                      <div className="flex items-center gap-2">
                        <span>NotebookLM</span>
                        <Edit3Icon className="w-[18px] h-[18px] shrink-0 opacity-80 text-[#9ca3af] group-hover:text-[var(--linkC,#9aa0a6)]" />
                      </div>
                    </a>
                  </li>

                  {/* 3. Formlar (svg.profile-2user) */}
                  <li>
                    <a
                      href="https://docs.google.com/forms/u/0/"
                      target="_blank"
                      rel="nofollow noreferrer noopener"
                      className="w-full group flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-[#d4d4d4] hover:bg-transparent hover:text-[var(--linkC,#9aa0a6)] transition-colors outline-none"
                    >
                      <div className="flex items-center gap-2">
                        <span>Formlar</span>
                        <Profile2UserIcon className="w-[18px] h-[18px] shrink-0 opacity-80 text-[#9ca3af] group-hover:text-[var(--linkC,#9aa0a6)]" />
                      </div>
                    </a>
                  </li>
                </ul>
              )}
            </li>

            {/* 3. KLASÖR 2: Topluluk (svg.flash) */}
            <li className="pt-1 relative">
              <div 
                onClick={() => setKlasorOpen(!klasorOpen)}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold text-[#d4d4d4] hover:bg-transparent hover:text-[var(--linkC,#9aa0a6)] cursor-pointer transition-colors outline-none relative"
              >
                <div className="flex items-center gap-2.5">
                  <span>Topluluk</span>
                  <span className="badge-new text-[var(--linkC,#9aa0a6)] text-[11px] font-bold ml-1">
                    Canlı
                  </span>
                  <FlashIcon className="w-[18px] h-[18px] shrink-0 opacity-80 text-[var(--linkC,#9aa0a6)]" />
                </div>
                {/* xml 1:1 li.nt-tr bildirim noktası (Sağ Üst) */}
                <span className="absolute top-2 right-8 w-2 h-2 rounded-full bg-[var(--linkC,#9aa0a6)] shadow-[0_0_8px_var(--linkC,#9aa0a6)] animate-pulse" />
                <ChevronDownIcon className={`w-3.5 h-3.5 text-[#989b9f] transition-transform duration-300 ${klasorOpen ? 'rotate-180' : ''}`} />
              </div>

              {klasorOpen && (
                <ul className="space-y-0.5 pl-3 border-l border-white/10 ml-4 mt-1">
                  {/* 1. Chat (Google Chat Odası) */}
                  <li>
                    <a
                      href="https://script.google.com/macros/s/AKfycbwcZprdS6F_jJ6nin0YalTKweQKP4t936UgrTnme-d5gA-qHbi986vh6HxdzvA236Of/exec"
                      target="_blank"
                      rel="nofollow noreferrer noopener"
                      className="w-full group flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-[#d4d4d4] hover:bg-transparent hover:text-[var(--linkC,#9aa0a6)] transition-colors outline-none"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white/95 group-hover:text-[var(--linkC,#9aa0a6)]">Chat</span>
                        <GoogleChatIcon className="w-[18px] h-[18px] shrink-0 opacity-80 text-[var(--linkC,#9aa0a6)]" />
                      </div>
                    </a>
                  </li>

                  {/* 2. Tartışmalar (GitHub Discussions) */}
                  <li>
                    <a
                      href="https://github.com/Aleyulala/saved/discussions/?pli=1"
                      target="_blank"
                      rel="nofollow noreferrer noopener"
                      className="w-full group flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-[#d4d4d4] hover:bg-transparent hover:text-[var(--linkC,#9aa0a6)] transition-colors outline-none"
                    >
                      <div className="flex items-center gap-2">
                        <span>Tartışmalar</span>
                        <Profile2UserIcon className="w-[18px] h-[18px] shrink-0 opacity-80 text-[#9ca3af] group-hover:text-[var(--linkC,#9aa0a6)]" />
                      </div>
                    </a>
                  </li>

                  {/* 3. Labs (Google Labs) */}
                  <li>
                    <a
                      href="https://labs.google.com/"
                      target="_blank"
                      rel="nofollow noreferrer noopener"
                      className="w-full group flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-[#d4d4d4] hover:bg-transparent hover:text-[var(--linkC,#9aa0a6)] transition-colors outline-none"
                    >
                      <div className="flex items-center gap-2">
                        <span>Labs</span>
                        <LabsIcon className="w-[18px] h-[18px] shrink-0 opacity-80 text-[#9ca3af] group-hover:text-[var(--linkC,#9aa0a6)]" />
                      </div>
                    </a>
                  </li>
                </ul>
              )}
            </li>

            {/* XML 1:1 Bölücü Çizgi (.mnMn > li.br::after) */}
            <li className="py-1">
              <div className="w-full h-px bg-white/10 my-1" />
            </li>

            {/* XML 1:1 Bölücü Çizgi (Topluluk ile Araçlar Arası) */}
            <li className="py-1">
              <div className="w-full h-px bg-white/10 my-1" />
            </li>

            {/* 4. KLASÖR 3: Araçlar (svg.folder-code) */}
            <li className="pt-1 relative">
              <div 
                onClick={() => setGelistiriciOpen(!gelistiriciOpen)}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold text-[#d4d4d4] hover:bg-transparent hover:text-[var(--linkC,#9aa0a6)] cursor-pointer transition-colors outline-none relative"
              >
                <div className="flex items-center gap-2.5">
                  <span>Araçlar</span>
                  <FolderCodeIcon className="w-[18px] h-[18px] shrink-0 opacity-80 text-[var(--linkC,#9aa0a6)]" />
                </div>
                {/* xml 1:1 li.nt-br bildirim noktası (Sağ Alt) */}
                <span className="absolute bottom-2 right-8 w-1.5 h-1.5 rounded-full bg-[var(--linkC,#9aa0a6)] shadow-[0_0_6px_var(--linkC,#9aa0a6)] animate-pulse" />
                <ChevronDownIcon className={`w-3.5 h-3.5 text-[#989b9f] transition-transform duration-300 ${gelistiriciOpen ? 'rotate-180' : ''}`} />
              </div>

              {gelistiriciOpen && (
                <ul className="space-y-0.5 pl-3 border-l border-white/10 ml-4 mt-1">
                  {/* 1. SEO (svg.search-normal-1) */}
                  <li>
                    <a
                      href="https://search.google.com/test/rich-results"
                      target="_blank"
                      rel="nofollow noreferrer noopener"
                      className="w-full group flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-[#d4d4d4] hover:bg-transparent hover:text-[var(--linkC,#9aa0a6)] transition-colors outline-none"
                    >
                      <div className="flex items-center gap-2">
                        <span>SEO</span>
                        <SearchNormalIcon className="w-[18px] h-[18px] shrink-0 opacity-80 text-[#9ca3af] group-hover:text-[var(--linkC,#9aa0a6)]" />
                      </div>
                    </a>
                  </li>

                  {/* 2. Hız (svg.speedometer) */}
                  <li>
                    <a
                      href="https://pagespeed.web.dev/analysis"
                      target="_blank"
                      rel="nofollow noreferrer noopener"
                      className="w-full group flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-[#d4d4d4] hover:bg-transparent hover:text-[var(--linkC,#9aa0a6)] transition-colors outline-none"
                    >
                      <div className="flex items-center gap-2">
                        <span>Hız</span>
                        <SpeedometerIcon className="w-[18px] h-[18px] shrink-0 opacity-80 text-[#9ca3af] group-hover:text-[var(--linkC,#9aa0a6)]" />
                      </div>
                    </a>
                  </li>

                  {/* 3. Ayna (svg.arrow-swap-horizontal) */}
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        const current = document.documentElement.getAttribute('dir') || 'ltr';
                        const next = current === 'rtl' ? 'ltr' : 'rtl';
                        document.documentElement.setAttribute('dir', next);
                      }}
                      className="w-full group flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-[#d4d4d4] hover:bg-transparent hover:text-[var(--linkC,#9aa0a6)] transition-colors cursor-pointer outline-none"
                    >
                      <div className="flex items-center gap-2">
                        <span>Ayna</span>
                        <span className="text-[var(--linkC,#9aa0a6)] text-[10px] font-bold">RTL</span>
                        <ArrowSwapHorizontalIcon className="w-[18px] h-[18px] shrink-0 opacity-80 text-[#9ca3af] group-hover:text-[var(--linkC,#9aa0a6)]" />
                      </div>
                    </button>
                  </li>
                </ul>
              )}
            </li>

          </ul>
        </div>

        {/* Alt Bölüm (.mnMob Footer): E-posta, Gizlilik ve Yorumlar Slaytı (.PageList02) + Sosyal Butonlar (.LinkList04 / .mSoc) */}
        <div className="p-3.5 border-t border-[#252526] bg-[#1e1e1e] space-y-3">
          {/* PageList02: E-posta, Gizlilik ve Yorumlar Kayan Slider + [+] Butonu */}
          <div className="relative h-9 bg-white/[0.04] border border-white/[0.08] rounded-[9px] overflow-hidden flex items-center shadow-xs">
            {/* Slayt 0: E-posta */}
            <div
              className={`absolute inset-0 flex items-center justify-between px-3 transition-all duration-300 ease-in-out ${
                footerSlideIndex === 0
                  ? 'opacity-100 translate-x-0 pointer-events-auto'
                  : 'opacity-0 -translate-x-full pointer-events-none'
              }`}
            >
              <a
                href="mailto:mrstar14155@gmail.com"
                className="flex items-center gap-2.5 text-xs text-[#e5e5e5] hover:text-[var(--linkC,#9aa0a6)] font-semibold transition-colors"
                title="E-posta: mrstar14155@gmail.com"
              >
                <div className="relative flex items-center justify-center">
                  <MailIcon className="w-4 h-4 text-[#e5e5e5] shrink-0" />
                  {/* Parlayan Canlı Bildirim Noktası (.nt glow) */}
                  <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#ffffff] animate-pulse" />
                </div>
                <span className="tracking-wide">E-posta</span>
              </a>
              <button
                type="button"
                onClick={() => setFooterSlideIndex(1)}
                className="w-6 h-6 rounded flex items-center justify-center text-[#9ca3af] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Sonraki: Gizlilik Politikası"
                aria-label="Gizlilik Politikasına Geç"
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
            </div>

            {/* Slayt 1: Gizlilik Politikası */}
            <div
              className={`absolute inset-0 flex items-center justify-between px-3 transition-all duration-300 ease-in-out ${
                footerSlideIndex === 1
                  ? 'opacity-100 translate-x-0 pointer-events-auto'
                  : footerSlideIndex === 0
                  ? 'opacity-0 translate-x-full pointer-events-none'
                  : 'opacity-0 -translate-x-full pointer-events-none'
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onSelectTab('privacy');
                }}
                className="flex items-center gap-2.5 text-xs text-[#e5e5e5] hover:text-[var(--linkC,#9aa0a6)] font-semibold transition-colors cursor-pointer"
                title="Gizlilik Politikası & Şartlar"
              >
                <div className="relative flex items-center justify-center">
                  <Verify1Icon className="w-4 h-4 text-[#e5e5e5] shrink-0" />
                  <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#ffffff] animate-pulse" />
                </div>
                <span className="tracking-wide">Gizlilik</span>
              </button>
              <button
                type="button"
                onClick={() => setFooterSlideIndex(2)}
                className="w-6 h-6 rounded flex items-center justify-center text-[#9ca3af] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Sonraki: Yorumlar"
                aria-label="Yorumlara Geç"
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
            </div>

            {/* Slayt 2: Yorumlar / Muhabbet Odası */}
            <div
              className={`absolute inset-0 flex items-center justify-between px-3 transition-all duration-300 ease-in-out ${
                footerSlideIndex === 2
                  ? 'opacity-100 translate-x-0 pointer-events-auto'
                  : 'opacity-0 translate-x-full pointer-events-none'
              }`}
            >
              <a
                href="https://negronshow.blogspot.com/p/muhabbet.html"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-xs text-[#e5e5e5] hover:text-[var(--linkC,#9aa0a6)] font-semibold transition-colors"
                title="Muhabbet Odası & Yorumlar"
              >
                <div className="relative flex items-center justify-center">
                  <MessageNotif1Icon className="w-4 h-4 text-[var(--linkC,#9aa0a6)] shrink-0" />
                  <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#ffffff] animate-pulse" />
                </div>
                <span className="tracking-wide">Yorumlar</span>
              </a>
              <button
                type="button"
                onClick={() => setFooterSlideIndex(0)}
                className="w-6 h-6 rounded flex items-center justify-center text-[#9ca3af] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Başa Dön: E-posta"
                aria-label="E-postaya Geç"
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
            </div>
          </div>

          {/* LinkList04: Sosyal Medya Kayan Slider + [+] Butonu (Üstteki Slayt ile Birebir Aynı Tasarım) */}
          <div className="relative h-9 bg-white/[0.04] border border-white/[0.08] rounded-[9px] overflow-hidden flex items-center shadow-xs">
            {drawerSocialLinks.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div
                  key={item.name}
                  className={`absolute inset-0 flex items-center justify-between px-3 transition-all duration-300 ease-in-out ${
                    socSlideIndex === idx
                      ? 'opacity-100 translate-x-0 pointer-events-auto'
                      : 'opacity-0 -translate-x-full pointer-events-none'
                  }`}
                >
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-xs text-[#e5e5e5] hover:text-[var(--linkC,#9aa0a6)] font-semibold transition-colors"
                    title={`${item.name} Profilini Aç`}
                  >
                    <div className="relative flex items-center justify-center text-[#e5e5e5]">
                      <IconComp className="w-4 h-4 shrink-0" />
                      {/* Parlayan Canlı Bildirim Noktası (.nt glow) */}
                      <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#ffffff] animate-pulse" />
                    </div>
                    <span className="tracking-wide">{item.name}</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setSocSlideIndex((prev) => (prev + 1) % drawerSocialLinks.length)}
                    className="w-6 h-6 rounded flex items-center justify-center text-[#9ca3af] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    title="Sonraki Sosyal Medya"
                    aria-label="Sonraki Sosyal Medyaya Geç"
                  >
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[10px] text-[#989b9f] font-mono px-2">
            <span>GNU GPL v3.0</span>
            <span>v1.0 • Plus UI</span>
          </div>
        </div>

      </aside>
    </div>
  );
};
