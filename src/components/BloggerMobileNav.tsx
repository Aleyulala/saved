import React from 'react';
import { 
  HomeIcon, 
  SearchNormalIcon, 
  AppsGridIcon,
  SunMoonIcon,
  ArrowUp4Icon 
} from './BloggerIcons';

interface BloggerMobileNavProps {
  currentTab: 'dashboard' | 'links' | 'pinned' | 'collection' | 'tag' | 'trash';
  onSelectTab: (tab: 'dashboard' | 'links' | 'pinned') => void;
  onOpenDrawer: () => void;
  onOpenSearch: () => void;
}

export const BloggerMobileNav: React.FC<BloggerMobileNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenDrawer,
  onOpenSearch
}) => {
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    {
      id: 'dashboard',
      label: 'Ana Sayfa',
      icon: HomeIcon,
      isActive: currentTab === 'dashboard',
      onClick: () => onSelectTab('dashboard')
    },
    {
      id: 'search',
      label: 'Ara',
      icon: SearchNormalIcon,
      isActive: false,
      onClick: onOpenSearch
    },
    {
      id: 'menu',
      label: 'Menü',
      icon: AppsGridIcon,
      isActive: false,
      onClick: onOpenDrawer,
      isSpecial: true
    },
    {
      id: 'theme',
      label: 'Tema',
      icon: SunMoonIcon,
      isActive: false,
      onClick: () => window.dispatchEvent(new CustomEvent('saved:toggle-theme'))
    },
    {
      id: 'top',
      label: 'Yukarı',
      icon: ArrowUp4Icon,
      isActive: false,
      onClick: handleScrollTop
    }
  ];

  return (
    <nav className="min-[897px]:hidden fixed bottom-0 inset-x-0 z-40 select-none pb-safe">
      {/* Blogger .mobC container */}
      <div className="mob-nav-bar relative w-full bg-[#1e1e1e] px-2 py-1.5">
        <ul className="flex items-center justify-around h-[42px] m-0 p-0 list-none">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <li 
                key={item.id} 
                className="flex items-center justify-center flex-1"
              >
                <button
                  onClick={item.onClick}
                  aria-label={item.label}
                  title={item.label}
                  className={`group relative inline-flex items-center justify-center w-10 h-10 bg-transparent border-0 rounded-none shadow-none outline-none transition-colors duration-150 active:opacity-70 ${
                    item.isActive
                      ? 'text-[var(--linkC,#9aa0a6)]'
                      : item.isSpecial
                        ? 'text-white hover:text-[var(--linkC,#9aa0a6)]'
                        : 'text-[#a1a1aa] hover:text-white'
                  }`}
                >
                  <Icon className="w-[18px] h-[18px] shrink-0 stroke-[1.8]" />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};
