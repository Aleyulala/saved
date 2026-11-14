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
  PlusNavIcon,
  InstagramIcon, 
  TelegramIcon, 
  TiktokIcon,
  MailIcon, 
  VkIcon,
  MatrixIcon,
  WhatsappIcon,
  GoogleChatIcon,
  LabsIcon
} from './BloggerIcons';
import { CollectionItem, TagItem } from '../types';

interface BloggerSidebarProps {
  currentTab: string;
  activeCollectionId?: number | null;
  activeTag?: string | null;
  onSelectTab: (tab: any) => void;
  onSelectCollection?: (id: number) => void;
  onSelectTag?: (tag: string) => void;
  collections?: CollectionItem[];
  tags?: TagItem[];
  counts: {
    all: number;
    pinned: number;
    trash: number;
    collections: Record<number, number>;
    tags: Record<string, number>;
  };
  onOpenNewLink: () => void;
  onOpenManageCollections?: () => void;
  onOpenManageTags?: () => void;
  onOpenSettings?: () => void;
  onOpenImportExport?: () => void;
  isCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

export const BloggerSidebar: React.FC<BloggerSidebarProps> = ({
  currentTab,
  onSelectTab,
  counts,
  onOpenNewLink,
  isCollapsed = false,
  onToggleSidebar
}) => {
  const [hizmetlerOpen, setHizmetlerOpen] = useState(false);
  const [klasorOpen, setKlasorOpen] = useState(false);
  const [gelistiriciOpen, setGelistiriciOpen] = useState(false);
  const [footerSlideIndex, setFooterSlideIndex] = useState(0);
  const [socSlideIndex, setSocSlideIndex] = useState(0);

  const sidebarSocialLinks = [
    { name: 'Instagram', href: 'https://www.instagram.com/aleyul.ala/', icon: InstagramIcon, color: '#e1306c' },
    { name: 'Telegram', href: 'https://t.me/aleyyulala', icon: TelegramIcon, color: '#229ed9' },
    { name: 'TikTok', href: 'https://www.tiktok.com/@Aleyyu.Ala', icon: TiktokIcon, color: '#25f4ee' },
    { name: 'Matrix', href: 'https://matrix.to/#/#negronn-show:matrix.org', icon: MatrixIcon, color: 'var(--linkC,#9aa0a6)' },
    { name: 'VKontakte', href: 'https://vk.com/negronn', icon: VkIcon, color: '#4680c2' },
    { name: 'WhatsApp', href: 'tel:05446412904', icon: WhatsappIcon, color: '#25d366' }
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

  // 1. ÇEKMECE KAPALIYKEN: Daraltılmış 75px Mini Bar (negron.xml 1:1 Masaüstü Rail Modu)
  if (isCollapsed) {
    return (
      <aside className="w-[75px] bg-[#1e1e1e] border-r border-[#252526] flex flex-col justify-between h-[calc(100vh-60px)] shrink-0 select-none shadow-xs transition-all duration-300 ease-in-out relative z-30">
        
        {/* Üst Menü İkonları (.mnMen .mnMn Rail — negron.xml 1:1: padding 20px 0, 40px butonlar, 18px ikonlar) */}
        <div className="py-5 flex-1 overflow-visible flex flex-col items-center">
          <ul className="w-full flex flex-col items-center space-y-0">
            
            {/* 1. Ana Sayfa (svg.home) - XML 1:1: Sadece ana sayfa DIŞINDAKİ sayfalarda gözükür (!data:view.isHomepage) */}
            {currentTab !== 'dashboard' && (
              <li className="relative group flex justify-center w-full h-10">
                <button
                  onClick={() => onSelectTab('dashboard')}
                  className="w-10 h-10 flex items-center justify-center rounded-[18px] transition-all cursor-pointer text-[#9ca3af] hover:bg-[#252526] hover:text-[var(--linkC,#9aa0a6)]"
                  title="Ana Sayfa"
                  aria-label="Ana Sayfa"
                >
                  <HomeIcon className="w-[18px] h-[18px] opacity-80 group-hover:opacity-100 text-[var(--linkC,#9aa0a6)] transition-opacity" />
                </button>
                {/* Uçan Etiket (Flyout Tooltip) */}
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1.5 rounded-xl bg-[#252526] border border-white/10 text-white text-xs font-semibold whitespace-nowrap shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                  Ana Sayfa
                </div>
              </li>
            )}

            {/* 2. Hizmetler (svg.hierarchy-4) */}
            <li className="relative group flex justify-center w-full h-10 nt">
              <button
                onClick={() => onSelectTab('pinned')}
                className={`w-10 h-10 flex items-center justify-center rounded-[18px] transition-all cursor-pointer relative ${
                  currentTab === 'pinned'
                    ? 'bg-[#252526] text-[var(--linkC,#9aa0a6)] shadow-sm'
                    : 'text-[#9ca3af] hover:bg-[#252526] hover:text-[var(--linkC,#9aa0a6)]'
                }`}
                title="Hizmetler"
                aria-label="Hizmetler"
              >
                <Hierarchy4Icon className="w-[18px] h-[18px] opacity-80 group-hover:opacity-100 text-[var(--linkC,#9aa0a6)] transition-opacity" />
                {/* xml 1:1 li.nt bildirim noktası (top: 7px, left: 7px) */}
                <span className="absolute top-[7px] left-[7px] w-2 h-2 rounded-full bg-[var(--linkC,#9aa0a6)] shadow-[0_0_8px_var(--linkC,#9aa0a6)]" />
              </button>
              {/* Uçan Menü (Flyout Submenu) */}
              <div className="absolute left-full top-0 ml-2 w-52 p-2 rounded-2xl bg-[#252526] border border-white/10 shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-150 z-50 space-y-1">
                <div className="px-2.5 py-1 text-xs font-bold text-[var(--linkC,#9aa0a6)] border-b border-white/10 flex items-center gap-2">
                  <Hierarchy4Icon className="w-4 h-4" />
                  <span>Uygulamalar</span>
                </div>
                {/* 1. Etkileşimler */}
                <button
                  onClick={() => onSelectTab('pinned')}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors cursor-pointer ${
                    currentTab === 'pinned' ? 'bg-[#1e1e1e] text-[var(--linkC,#9aa0a6)] font-bold' : 'text-[#d4d4d4] hover:bg-[#1e1e1e] hover:text-[var(--linkC,#9aa0a6)]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <MessageNotif1Icon className="w-[18px] h-[18px] opacity-80 text-[var(--linkC,#9aa0a6)]" />
                    NESCİONE
                  </span>
                  <span className="text-[10px] text-[#9ca3af] font-mono">{counts.pinned}</span>
                </button>
                {/* 2. Notlarınız */}
                <a
                  href="https://notebooklm.google.com/"
                  target="_blank"
                  rel="nofollow noreferrer noopener"
                  className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-[#d4d4d4] hover:bg-[#1e1e1e] hover:text-[var(--linkC,#9aa0a6)] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Edit3Icon className="w-[18px] h-[18px] opacity-80 text-[#9ca3af]" />
                    NotebookLM
                  </span>
                </a>
                {/* 3. Forumlarınız */}
                <a
                  href="https://docs.google.com/forms/u/0/"
                  target="_blank"
                  rel="nofollow noreferrer noopener"
                  className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-[#d4d4d4] hover:bg-[#1e1e1e] hover:text-[var(--linkC,#9aa0a6)] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Profile2UserIcon className="w-[18px] h-[18px] opacity-80 text-[#9ca3af]" />
                    Formlar
                  </span>
                </a>
              </div>
            </li>

            {/* 3. Klasör (svg.flash) - New! */}
            <li className="relative group flex justify-center w-full h-10">
              <button
                onClick={() => onSelectTab('links')}
                className={`w-10 h-10 flex items-center justify-center rounded-[18px] transition-all cursor-pointer relative ${
                  currentTab === 'links' || currentTab === 'privacy'
                    ? 'bg-[#252526] text-[var(--linkC,#9aa0a6)] shadow-sm'
                    : 'text-[#9ca3af] hover:bg-[#252526] hover:text-[var(--linkC,#9aa0a6)]'
                }`}
                title="Topluluk"
                aria-label="Topluluk"
              >
                <FlashIcon className="w-[18px] h-[18px] opacity-80 group-hover:opacity-100 text-[var(--linkC,#9aa0a6)] transition-opacity" />
                <span className="absolute top-[7px] right-[7px] w-2 h-2 rounded-full bg-[var(--linkC,#9aa0a6)] shadow-[0_0_6px_var(--linkC,#9aa0a6)]" />
              </button>
              {/* Uçan Menü (Flyout Submenu) */}
              <div className="absolute left-full top-0 ml-2 w-52 p-2 rounded-2xl bg-[#252526] border border-white/10 shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-150 z-50 space-y-1">
                <div className="px-2.5 py-1 text-xs font-bold text-[var(--linkC,#9aa0a6)] border-b border-white/10 flex items-center gap-2">
                  <FlashIcon className="w-4 h-4" />
                  <span>Topluluk</span>
                  <span className="ml-auto text-[var(--linkC,#9aa0a6)] text-[11px] font-bold">New!</span>
                </div>
                {/* 1. Chat */}
                <a
                  href="https://script.google.com/macros/s/AKfycbwcZprdS6F_jJ6nin0YalTKweQKP4t936UgrTnme-d5gA-qHbi986vh6HxdzvA236Of/exec"
                  target="_blank"
                  rel="nofollow noreferrer noopener"
                  className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-[#d4d4d4] hover:bg-[#1e1e1e] hover:text-[#00ac47] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <GoogleChatIcon className="w-[18px] h-[18px] opacity-80 text-[#00ac47]" />
                    Chat
                  </span>
                </a>
                {/* 2. Tartışmalar */}
                <a
                  href="https://github.com/Aleyulala/saved/discussions/?pli=1"
                  target="_blank"
                  rel="nofollow noreferrer noopener"
                  className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-[#d4d4d4] hover:bg-[#1e1e1e] hover:text-[var(--linkC,#9aa0a6)] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Profile2UserIcon className="w-[18px] h-[18px] opacity-80 text-[#9ca3af]" />
                    Tartışmalar
                  </span>
                </a>
                {/* 3. Labs */}
                <a
                  href="https://labs.google.com/"
                  target="_blank"
                  rel="nofollow noreferrer noopener"
                  className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-[#d4d4d4] hover:bg-[#1e1e1e] hover:text-[var(--linkC,#9aa0a6)] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <LabsIcon className="w-[18px] h-[18px] opacity-80 text-[#9ca3af]" />
                    Labs
                  </span>
                </a>
              </div>
            </li>

            {/* XML 1:1 Bölücü Çizgi (.mnMn > li.br::after) */}
            <li className="flex justify-center w-full py-2.5">
              <div className="w-5 h-px bg-white/10" />
            </li>

            {/* 4. Geliştiriciler (svg.folder-code) */}
            <li className="relative group flex justify-center w-full h-10">
              <button
                onClick={() => setGelistiriciOpen(!gelistiriciOpen)}
                className="w-10 h-10 flex items-center justify-center rounded-[18px] transition-all cursor-pointer text-[#9ca3af] hover:bg-[#252526] hover:text-[var(--linkC,#9aa0a6)]"
                title="Araçlar"
                aria-label="Araçlar"
              >
                <FolderCodeIcon className="w-[18px] h-[18px] opacity-80 group-hover:opacity-100 text-[var(--linkC,#9aa0a6)] transition-opacity" />
              </button>
              {/* Uçan Menü (Flyout Submenu) */}
              <div className="absolute left-full top-0 ml-2 w-52 p-2 rounded-2xl bg-[#252526] border border-white/10 shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-150 z-50 space-y-1">
                <div className="px-2.5 py-1 text-xs font-bold text-[var(--linkC,#9aa0a6)] border-b border-white/10 flex items-center gap-2">
                  <FolderCodeIcon className="w-4 h-4" />
                  <span>Araçlar</span>
                </div>
                {/* 1. Ters Çevir */}
                <button
                  type="button"
                  onClick={() => {
                    const current = document.documentElement.getAttribute('dir') || 'ltr';
                    const next = current === 'rtl' ? 'ltr' : 'rtl';
                    document.documentElement.setAttribute('dir', next);
                  }}
                  className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-[#d4d4d4] hover:bg-[#1e1e1e] hover:text-[var(--linkC,#9aa0a6)] transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <ArrowSwapHorizontalIcon className="w-[18px] h-[18px] opacity-80 text-[#9ca3af]" />
                    Ayna
                  </span>
                  <span className="text-[var(--linkC,#9aa0a6)] text-[10px] font-bold">New!</span>
                </button>
                {/* 2. Detaylı Ara */}
                <a
                  href="https://search.google.com/test/rich-results"
                  target="_blank"
                  rel="nofollow noreferrer noopener"
                  className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-[#d4d4d4] hover:bg-[#1e1e1e] hover:text-[var(--linkC,#9aa0a6)] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <SearchNormalIcon className="w-[18px] h-[18px] opacity-80 text-[#9ca3af]" />
                    SEO
                  </span>
                </a>
                {/* 3. Hız Testi */}
                <a
                  href="https://pagespeed.web.dev/analysis"
                  target="_blank"
                  rel="nofollow noreferrer noopener"
                  className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-[#d4d4d4] hover:bg-[#1e1e1e] hover:text-[var(--linkC,#9aa0a6)] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <SpeedometerIcon className="w-[18px] h-[18px] opacity-80 text-[#9ca3af]" />
                    Hız
                  </span>
                </a>
              </div>
            </li>

          </ul>
        </div>

        {/* Alt Bölüm (.mnMob / .mNav): XML 1:1 Tek + Butonu (Menüyü Genişletir / Çekmeceyi Açar) */}
        <div className="p-3 border-t border-[#252526] bg-[#1e1e1e] flex justify-center items-center">
          <button
            type="button"
            onClick={onToggleSidebar || onOpenNewLink}
            className="w-9 h-9 flex items-center justify-center rounded-[18px] text-[#9ca3af] hover:text-white hover:bg-[#252526] transition-colors cursor-pointer"
            title="Gezinme Menüsü (Genişlet)"
            aria-label="Navigation menu"
          >
            <PlusNavIcon className="w-[18px] h-[18px] opacity-80 hover:opacity-100 text-[#9ca3af] hover:text-white transition-opacity" />
          </button>
        </div>

      </aside>
    );
  }

  // 2. ÇEKMECE AÇIKKEN: Genişletilmiş 230px Tam Menü (negronn.xml 1:1)
  return (
    <aside className="w-[230px] bg-[#1e1e1e] border-r border-[#252526] flex flex-col justify-between h-[calc(100vh-60px)] shrink-0 text-xs select-none shadow-xs transition-all duration-300 ease-in-out">
      
      {/* Menü Öğeleri (.mnMen) */}
      <div className="p-3 space-y-4 overflow-y-auto flex-1">
        
        {/* Blogger Gezinme Menüsü (.mnMn) */}
        <ul className="space-y-1">
          
          {/* 1. Ana Sayfa (svg.home) - XML 1:1: Sadece ana sayfa DIŞINDAKİ sayfalarda gözükür (!data:view.isHomepage) */}
          {currentTab !== 'dashboard' && (
            <li>
              <button
                onClick={() => onSelectTab('dashboard')}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition-colors cursor-pointer text-[#d4d4d4] hover:bg-[#252526]/70 hover:text-white"
              >
                <div className="flex items-center gap-2.5">
                  <HomeIcon className="w-[18px] h-[18px] opacity-80 text-[var(--linkC,#9aa0a6)]" />
                  <span className="font-semibold text-xs">Ana Sayfa</span>
                </div>
              </button>
            </li>
          )}

          {/* 2. Hizmetler (svg.hierarchy-4) */}
          <li className="pt-1 relative">
            <div 
              onClick={() => setHizmetlerOpen(!hizmetlerOpen)}
              className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold text-[#d4d4d4] hover:bg-[#252526] hover:text-white cursor-pointer transition-colors relative"
            >
              <div className="flex items-center gap-2.5">
                <Hierarchy4Icon className="w-[18px] h-[18px] opacity-80 text-[var(--linkC,#9aa0a6)]" />
                <span>Uygulamalar</span>
              </div>
              {/* xml 1:1 li.nt bildirim noktası */}
              <span className="absolute top-2 left-2 w-2 h-2 rounded-full bg-[var(--linkC,#9aa0a6)] shadow-[0_0_8px_var(--linkC,#9aa0a6)]" />
              
              <ChevronDownIcon className={`w-3.5 h-3.5 text-[#989b9f] transition-transform duration-300 ${hizmetlerOpen ? 'rotate-180' : ''}`} />
            </div>

            {hizmetlerOpen && (
              <ul className="space-y-0.5 pl-3 border-l border-white/10 ml-4 mt-1">
                {/* 1. Etkileşimler (svg.message-notif-1) */}
                <li>
                  <button
                    onClick={() => onSelectTab('pinned')}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors cursor-pointer ${
                      currentTab === 'pinned'
                        ? 'bg-[#252526] text-[var(--linkC,#9aa0a6)] font-bold'
                        : 'text-[#d4d4d4] hover:bg-[#252526] hover:text-[var(--linkC,#9aa0a6)]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <MessageNotif1Icon className="w-4 h-4 opacity-80 text-[var(--linkC,#9aa0a6)]" />
                      <span>NESCİONE</span>
                    </div>
                    <span className="text-[10px] text-[#9ca3af] font-mono">{counts.pinned}</span>
                  </button>
                </li>

                {/* 2. Notlarınız (svg.edit-3) */}
                <li>
                  <a
                    href="https://notebooklm.google.com/"
                    target="_blank"
                    rel="nofollow noreferrer noopener"
                    className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-[#d4d4d4] hover:bg-[#252526] hover:text-[var(--linkC,#9aa0a6)] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Edit3Icon className="w-4 h-4 opacity-80 text-[#9ca3af]" />
                      <span>NotebookLM</span>
                    </div>
                  </a>
                </li>

                {/* 3. Forumlarınız (svg.profile-2user) */}
                <li>
                  <a
                    href="https://docs.google.com/forms/u/0/"
                    target="_blank"
                    rel="nofollow noreferrer noopener"
                    className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-[#d4d4d4] hover:bg-[#252526] hover:text-[var(--linkC,#9aa0a6)] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Profile2UserIcon className="w-4 h-4 opacity-80 text-[#9ca3af]" />
                      <span>Formlar</span>
                    </div>
                  </a>
                </li>
              </ul>
            )}
          </li>

          {/* 3. Klasör (svg.flash) */}
          <li className="pt-1">
            <div 
              onClick={() => setKlasorOpen(!klasorOpen)}
              className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold text-[#d4d4d4] hover:bg-[#252526] hover:text-white cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <FlashIcon className="w-[18px] h-[18px] opacity-80 text-[var(--linkC,#9aa0a6)]" />
                <span>Topluluk</span>
                <span className="badge-new text-[var(--linkC,#9aa0a6)] text-[11px] font-bold ml-1">
                  New!
                </span>
              </div>
              <ChevronDownIcon className={`w-3.5 h-3.5 text-[#989b9f] transition-transform duration-300 ${klasorOpen ? 'rotate-180' : ''}`} />
            </div>

            {klasorOpen && (
              <ul className="space-y-0.5 pl-3 border-l border-white/10 ml-4 mt-1">
                {/* 1. Chat */}
                <li>
                  <a
                    href="https://script.google.com/macros/s/AKfycbwcZprdS6F_jJ6nin0YalTKweQKP4t936UgrTnme-d5gA-qHbi986vh6HxdzvA236Of/exec"
                    target="_blank"
                    rel="nofollow noreferrer noopener"
                    className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-[#d4d4d4] hover:bg-[#252526] hover:text-[#00ac47] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <GoogleChatIcon className="w-4 h-4 opacity-80 text-[#00ac47]" />
                      <span>Chat</span>
                    </div>
                  </a>
                </li>

                {/* 2. Tartışmalar */}
                <li>
                  <a
                    href="https://github.com/Aleyulala/saved/discussions/?pli=1"
                    target="_blank"
                    rel="nofollow noreferrer noopener"
                    className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-[#d4d4d4] hover:bg-[#252526] hover:text-[var(--linkC,#9aa0a6)] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Profile2UserIcon className="w-4 h-4 opacity-80 text-[#9ca3af]" />
                      <span>Tartışmalar</span>
                    </div>
                  </a>
                </li>

                {/* 3. Labs */}
                <li>
                  <a
                    href="https://labs.google.com/"
                    target="_blank"
                    rel="nofollow noreferrer noopener"
                    className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-[#d4d4d4] hover:bg-[#252526] hover:text-[var(--linkC,#9aa0a6)] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <LabsIcon className="w-4 h-4 opacity-80 text-[#9ca3af]" />
                      <span>Labs</span>
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

          {/* 4. Geliştiriciler (svg.folder-code) */}
          <li className="pt-1">
            <div 
              onClick={() => setGelistiriciOpen(!gelistiriciOpen)}
              className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold text-[#d4d4d4] hover:bg-[#252526] hover:text-white cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <FolderCodeIcon className="w-[18px] h-[18px] opacity-80 text-[var(--linkC,#9aa0a6)]" />
                <span>Araçlar</span>
              </div>
              <ChevronDownIcon className={`w-3.5 h-3.5 text-[#989b9f] transition-transform duration-300 ${gelistiriciOpen ? 'rotate-180' : ''}`} />
            </div>

            {gelistiriciOpen && (
              <ul className="space-y-0.5 pl-3 border-l border-white/10 ml-4 mt-1">
                {/* 1. Ters Çevir (svg.arrow-swap-horizontal) */}
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      const current = document.documentElement.getAttribute('dir') || 'ltr';
                      const next = current === 'rtl' ? 'ltr' : 'rtl';
                      document.documentElement.setAttribute('dir', next);
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-[#d4d4d4] hover:bg-[#1e1e1e] hover:text-[var(--linkC,#9aa0a6)] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <ArrowSwapHorizontalIcon className="w-3.5 h-3.5 text-[#9ca3af]" />
                      <span>Ayna</span>
                      <span className="text-[var(--linkC,#9aa0a6)] text-[10px] font-bold">New!</span>
                    </div>
                  </button>
                </li>

                {/* 2. Detaylı Ara (svg.search-normal-1) */}
                <li>
                  <a
                    href="https://search.google.com/test/rich-results"
                    target="_blank"
                    rel="nofollow noreferrer noopener"
                    className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-[#d4d4d4] hover:bg-[#1e1e1e] hover:text-[var(--linkC,#9aa0a6)] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <SearchNormalIcon className="w-3.5 h-3.5 text-[#9ca3af]" />
                      <span>SEO</span>
                    </div>
                  </a>
                </li>

                {/* 3. Hız Testi (svg.speedometer) */}
                <li>
                  <a
                    href="https://pagespeed.web.dev/analysis"
                    target="_blank"
                    rel="nofollow noreferrer noopener"
                    className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-[#d4d4d4] hover:bg-[#1e1e1e] hover:text-[var(--linkC,#9aa0a6)] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <SpeedometerIcon className="w-3.5 h-3.5 text-[#9ca3af]" />
                      <span>Hız</span>
                    </div>
                  </a>
                </li>
              </ul>
            )}
          </li>

        </ul>
      </div>

      {/* Alt Bölüm (.mnMob): E-posta, Gizlilik ve Yorumlar Slaytı (.PageList02) + 6 Sosyal Buton (.LinkList04 / .mSoc) */}
      <div className="p-3 border-t border-[#252526] bg-[#1e1e1e] space-y-2.5">
        {/* PageList02: E-posta, Gizlilik ve Yorumlar Kayan Slider + [+] Butonu */}
        <div className="relative h-8 bg-[#252526]/80 border border-white/10 rounded-lg overflow-hidden flex items-center">
          {/* Slayt 0: E-posta */}
          <div
            className={`absolute inset-0 flex items-center justify-between px-2.5 transition-all duration-300 ease-in-out ${
              footerSlideIndex === 0
                ? 'opacity-100 translate-x-0 pointer-events-auto'
                : 'opacity-0 -translate-x-full pointer-events-none'
            }`}
          >
            <a
              href="mailto:mrstar14155@gmail.com"
              className="flex items-center gap-2 text-xs text-[#e5e5e5] hover:text-[var(--linkC,#9aa0a6)] font-semibold transition-colors"
              title="E-posta: mrstar14155@gmail.com"
            >
              <div className="relative flex items-center justify-center">
                <MailIcon className="w-3.5 h-3.5 text-[#ea4335] shrink-0" />
                {/* Parlayan Canlı Bildirim Noktası (.nt glow) */}
                <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#ffffff] animate-pulse" />
              </div>
              <span className="tracking-wide">E-posta</span>
            </a>
            <button
              type="button"
              onClick={() => setFooterSlideIndex(1)}
              className="w-5 h-5 rounded flex items-center justify-center text-[#9ca3af] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Sonraki: Gizlilik Politikası"
              aria-label="Gizlilik Politikasına Geç"
            >
              <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>

          {/* Slayt 1: Gizlilik Politikası */}
          <div
            className={`absolute inset-0 flex items-center justify-between px-2.5 transition-all duration-300 ease-in-out ${
              footerSlideIndex === 1
                ? 'opacity-100 translate-x-0 pointer-events-auto'
                : footerSlideIndex === 0
                ? 'opacity-0 translate-x-full pointer-events-none'
                : 'opacity-0 -translate-x-full pointer-events-none'
            }`}
          >
            <button
              type="button"
              onClick={() => onSelectTab('privacy')}
              className="flex items-center gap-2 text-xs text-[#e5e5e5] hover:text-[var(--linkC,#9aa0a6)] font-semibold transition-colors cursor-pointer"
              title="Gizlilik Politikası & Şartlar"
            >
              <div className="relative flex items-center justify-center">
                <Verify1Icon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#ffffff] animate-pulse" />
              </div>
              <span className="tracking-wide">Gizlilik</span>
            </button>
            <button
              type="button"
              onClick={() => setFooterSlideIndex(2)}
              className="w-5 h-5 rounded flex items-center justify-center text-[#9ca3af] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Sonraki: Yorumlar"
              aria-label="Yorumlara Geç"
            >
              <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>

          {/* Slayt 2: Yorumlar / Muhabbet Odası */}
          <div
            className={`absolute inset-0 flex items-center justify-between px-2.5 transition-all duration-300 ease-in-out ${
              footerSlideIndex === 2
                ? 'opacity-100 translate-x-0 pointer-events-auto'
                : 'opacity-0 translate-x-full pointer-events-none'
            }`}
          >
            <a
              href="https://negronshow.blogspot.com/p/muhabbet.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-[#e5e5e5] hover:text-[var(--linkC,#9aa0a6)] font-semibold transition-colors"
              title="Muhabbet Odası & Yorumlar"
            >
              <div className="relative flex items-center justify-center">
                <MessageNotif1Icon className="w-3.5 h-3.5 text-[var(--linkC,#9aa0a6)] shrink-0" />
                <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#ffffff] animate-pulse" />
              </div>
              <span className="tracking-wide">Yorumlar</span>
            </a>
            <button
              type="button"
              onClick={() => setFooterSlideIndex(0)}
              className="w-5 h-5 rounded flex items-center justify-center text-[#9ca3af] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Başa Dön: E-posta"
              aria-label="E-postaya Geç"
            >
              <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>
        </div>

        {/* LinkList04: Sosyal Medya Kayan Slider + [+] Butonu (Üstteki Slayt ile Birebir Aynı Tasarım) */}
        <div className="relative h-9 bg-[#252526]/80 border border-white/10 rounded-lg overflow-hidden flex items-center shadow-sm">
          {sidebarSocialLinks.map((item, idx) => {
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
                  className="flex items-center gap-2 text-xs text-[#e5e5e5] hover:text-[var(--linkC,#9aa0a6)] font-semibold transition-colors"
                  title={`${item.name} Profilini Aç`}
                >
                  <div className="relative flex items-center justify-center" style={{ color: item.color }}>
                    <IconComp className="w-3.5 h-3.5 shrink-0" />
                    {/* Parlayan Canlı Bildirim Noktası (.nt glow) */}
                    <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#ffffff] animate-pulse" />
                  </div>
                  <span className="tracking-wide">{item.name}</span>
                </a>
                <button
                  type="button"
                  onClick={() => setSocSlideIndex((prev) => (prev + 1) % sidebarSocialLinks.length)}
                  className="w-5 h-5 rounded flex items-center justify-center text-[#9ca3af] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Sonraki Sosyal Medya"
                  aria-label="Sonraki Sosyal Medyaya Geç"
                >
                  <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-[10px] text-[#989b9f] font-mono px-1">
          <span>GNU GPL v3.0</span>
          <span>v1.0 • Plus UI</span>
        </div>
      </div>

    </aside>
  );
};
