import React, { useRef, useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  PulseIcon, 
  CloseIcon,
  Verify1Icon,
  EyeIcon,
  MessageNotif1Icon,
  ArchiveIcon,
  TagBloggerIcon,
  ChatBloggerIcon
} from './BloggerIcons';
import { 
  Calendar, 
  Send,
  MessageCircle
} from 'lucide-react';
import { CollectionItem, LinkItem, TagItem } from '../types';
import { formatDate, getDomain, getFaviconUrl } from '../utils/favicon';
import { BrandLogoCard } from './BrandLogoCard';

interface BloggerRightSidebarProps {
  pinnedLinks: LinkItem[];
  allLinks: LinkItem[];
  collections: CollectionItem[];
  tags: TagItem[];
  counts: {
    all: number;
    pinned: number;
    trash: number;
    collections: Record<number, number>;
    tags: Record<string, number>;
  };
  onSelectCollection: (id: number) => void;
  onSelectTag: (tag: string) => void;
  onOpenPostPage: (link: LinkItem) => void;
  // Mobile / Drawer props
  isDrawerOpen?: boolean;
  onCloseDrawer?: () => void;
  // #İletişim → Nsone Bot spotlight sinyali (her artış pencereyi açar)
  contactOpenSignal?: number;
}

export const BloggerRightSidebar: React.FC<BloggerRightSidebarProps> = ({
  pinnedLinks,
  allLinks,
  collections,
  tags,
  counts,
  onSelectCollection,
  onSelectTag,
  onOpenPostPage,
  isDrawerOpen = false,
  onCloseDrawer,
  contactOpenSignal = 0
}) => {
  // Tags track horizontal slider
  const tagsTrackRef = useRef<HTMLDivElement>(null);
  const [tagCanScrollLeft, setTagCanScrollLeft] = useState(false);
  const [tagCanScrollRight, setTagCanScrollRight] = useState(true);
  const isDraggingTags = useRef(false);
  const startTagsX = useRef(0);
  const startScrollLeft = useRef(0);

  // Nsone Bot Carousel Slider states
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [shakeStep, setShakeStep] = useState<number | null>(null);

  // Nsone Bot Spotlight (Blogger #ContactForm2 .cf-spotlight 1:1)
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [typingDone, setTypingDone] = useState(true);

  const openSpotlight = () => {
    setSentSuccess(false);
    setTypingDone(false);
    setIsSpotlightOpen(true);
    // 'Yazıyor...' animasyonu: 700ms sonra baloncuklar sırayla belirir
    setTimeout(() => setTypingDone(true), 700);
    // nsone.xml 1:1: açılırken ilk giriş alanına odaklan
    setTimeout(() => nameInputRef.current?.focus(), 150);
  };

  const closeSpotlight = () => {
    setIsSpotlightOpen(false);
    setSentSuccess(false);
  };

  // #İletişim bağlantıları spotlight'ı açar (nsone.xml openSpotlight 1:1)
  useEffect(() => {
    if (contactOpenSignal > 0) {
      openSpotlight();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contactOpenSignal]);

  // Esc ile kapatma + gövde kaydırma kilidi (nsone.xml closeSpotlight 1:1)
  useEffect(() => {
    if (!isSpotlightOpen) return;
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape' || ev.keyCode === 27) closeSpotlight();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSpotlightOpen]);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const msgInputRef = useRef<HTMLTextAreaElement>(null);
  const submitBtnRef = useRef<HTMLButtonElement>(null);

  const checkTagScroll = () => {
    if (!tagsTrackRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = tagsTrackRef.current;
    setTagCanScrollLeft(scrollLeft > 4);
    setTagCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
  };

  useEffect(() => {
    checkTagScroll();
  }, [tags]);

  const handleTagsMouseDown = (e: React.MouseEvent) => {
    isDraggingTags.current = true;
    startTagsX.current = e.pageX - (tagsTrackRef.current?.offsetLeft || 0);
    startScrollLeft.current = tagsTrackRef.current?.scrollLeft || 0;
  };

  const handleTagsMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingTags.current || !tagsTrackRef.current) return;
    e.preventDefault();
    const x = e.pageX - (tagsTrackRef.current.offsetLeft || 0);
    const walk = (x - startTagsX.current) * 1.5;
    tagsTrackRef.current.scrollLeft = startScrollLeft.current - walk;
    checkTagScroll();
  };

  const handleTagsMouseUpOrLeave = () => {
    isDraggingTags.current = false;
  };

  const scrollTags = (direction: 'left' | 'right') => {
    if (!tagsTrackRef.current) return;
    const offset = direction === 'left' ? -180 : 180;
    tagsTrackRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    setTimeout(checkTagScroll, 300);
  };

  // Prepare popular posts (top 5 Linkwarden links)
  const popularPosts = useMemo(() => {
    return [...allLinks].filter(l => !l.isTrash && !l.isArchived).slice(0, 5);
  }, [allLinks]);

  const listPosts = popularPosts;

  const validateEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const triggerShake = (step: number, errorText: string) => {
    setErrorMessage(errorText);
    setShakeStep(step);
    setTimeout(() => {
      setShakeStep(null);
    }, 350);
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
    setErrorMessage('');
    setTimeout(() => {
      if (step === 0) nameInputRef.current?.focus();
      else if (step === 1) emailInputRef.current?.focus();
      else if (step === 2) {
        if (msgInputRef.current) {
          msgInputRef.current.focus();
          msgInputRef.current.style.height = 'auto';
          const scrollH = msgInputRef.current.scrollHeight;
          const newH = Math.min(220, Math.max(48, scrollH));
          msgInputRef.current.style.height = `${newH}px`;
          msgInputRef.current.style.overflowY = scrollH > 220 ? 'auto' : 'hidden';
        }
      } else if (step === 3) {
        submitBtnRef.current?.focus();
      }
    }, 120);
  };

  const handleNext0 = () => {
    const n = contactName.trim();
    if (!n || n.length < 2) {
      triggerShake(0, 'Lütfen adınızı girin.');
      nameInputRef.current?.focus();
      return;
    }
    goToStep(1);
  };

  const handleNext1 = () => {
    const em = contactEmail.trim();
    if (!em || !validateEmail(em)) {
      triggerShake(1, 'Lütfen geçerli bir e-posta adresi girin.');
      emailInputRef.current?.focus();
      return;
    }
    goToStep(2);
  };

  const handleNext2 = () => {
    const msg = contactMessage.trim();
    if (!msg || msg.length < 2) {
      triggerShake(2, 'Lütfen mesajınızı yazın.');
      msgInputRef.current?.focus();
      return;
    }
    goToStep(3);
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContactMessage(e.target.value);
    if (errorMessage) setErrorMessage('');
    const target = e.target;
    target.style.height = 'auto';
    const scrollH = target.scrollHeight;
    const newH = Math.min(220, Math.max(48, scrollH));
    target.style.height = `${newH}px`;
    target.style.overflowY = scrollH > 220 ? 'auto' : 'hidden';
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim()) {
      goToStep(0);
      triggerShake(0, 'Lütfen adınızı girin.');
      return;
    }
    if (!contactEmail.trim() || !validateEmail(contactEmail.trim())) {
      goToStep(1);
      triggerShake(1, 'Lütfen geçerli bir e-posta adresi girin.');
      return;
    }
    if (!contactMessage.trim()) {
      goToStep(2);
      triggerShake(2, 'Lütfen mesajınızı yazın.');
      return;
    }

    setIsSending(true);
    setErrorMessage('');

    const accessKey = localStorage.getItem('nsone_web3forms_key') || '';

    const resetContactFormAfterSuccess = () => {
      setTimeout(() => {
        setSentSuccess(false);
        setContactName('');
        setContactEmail('');
        setContactMessage('');
        setCurrentStep(0);
        setErrorMessage('');
      }, 4000);
    };

    // Web3Forms anahtarı yoksa, süresi dolduysa (token bitince) veya gönderim
    // başarısız olursa otomatik olarak mailto yedeğine geçilir:
    const openMailtoFallback = () => {
      const mailtoUrl = `mailto:mrstar14155@gmail.com?subject=${encodeURIComponent(
        'SAVED Nsone Bot Mesajı - ' + contactName.trim()
      )}&body=${encodeURIComponent(
        `Ad: ${contactName.trim()}\nE-posta: ${contactEmail.trim()}\n\nMesaj:\n${contactMessage.trim()}`
      )}`;
      window.open(mailtoUrl, '_blank');
      setIsSending(false);
      setSentSuccess(true);
      resetContactFormAfterSuccess();
    };

    try {
      if (accessKey) {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            access_key: accessKey,
            name: contactName.trim(),
            email: contactEmail.trim(),
            message: contactMessage.trim(),
            from_name: 'SAVED - Nsone Bot',
            subject: `SAVED Nsone Bot - Yeni Mesaj: ${contactName.trim()}`
          })
        });

        const data = await response.json().catch(() => ({ success: false as boolean, message: '' }));
        if (data.success) {
          setIsSending(false);
          setSentSuccess(true);
          resetContactFormAfterSuccess();
          return;
        }

        // Anahtar geçersiz veya süresi dolmuşsa kayıtlı anahtarı temizle
        const failMsg = String(data.message || '').toLowerCase();
        if (
          !response.ok ||
          failMsg.includes('key') ||
          failMsg.includes('token') ||
          failMsg.includes('invalid') ||
          failMsg.includes('unauthorized') ||
          failMsg.includes('expired')
        ) {
          try { localStorage.removeItem('nsone_web3forms_key'); } catch { /* yoksay */ }
        }
        throw new Error(data.message || 'Gönderim başarısız oldu.');
      } else {
        // Web3Forms anahtarı henüz girilmemişse, doğrudan mailto fallback'i çalıştır:
        openMailtoFallback();
      }
    } catch {
      // Web3Forms erişilemiyorsa (token bitti / ağ hatası) mailto yedeğine geç
      openMailtoFallback();
    }
  };

  // Nsone Bot iç paneli — spotlight modal içeriği (nsone.xml .cf-spotlight 1:1)
  const nsoneBotPanel = (
    <>
      {/* Nsone Bot Başlığı */}
      <div className="flex items-center gap-3 pb-3 mb-3 pr-10">
        <div className="relative w-10 h-10 rounded-full bg-[var(--linkC,#9aa0a6)]/20 flex items-center justify-center text-[var(--linkC,#9aa0a6)] shrink-0">
          <ChatBloggerIcon className="w-5 h-5" />
          <span
            className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#252526] shadow-[0_0_8px_rgba(16,185,129,0.6)]"
            title="Çevrimiçi"
          />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-white text-sm leading-tight">Nsone Bot</span>
          <span className="text-emerald-400 text-[11px] font-medium leading-tight">{typingDone ? 'Çevrimiçi' : 'yazıyor...'}</span>
        </div>
      </div>

      {/* Nsone Bot Tane Tane Mesaj Baloncukları (yazıyor... → sırayla belirir) */}
      <div className="flex flex-col gap-1.5 max-w-[96%] mb-3.5">
        {!typingDone && (
          <div className="cf-typing rounded-[18px_18px_18px_4px] bg-white/[0.06] px-3.5 py-3 w-fit">
            <i /><i /><i />
          </div>
        )}
        <div
          style={{ transitionDelay: typingDone ? '0ms' : '0ms' }}
          className={`rounded-[18px_18px_18px_4px] bg-white/[0.06] p-2.5 px-3.5 text-xs text-slate-200 leading-relaxed shadow-sm transition-all duration-300 ${
            typingDone ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          Merhaba! 👋
        </div>
        <div
          style={{ transitionDelay: typingDone ? '120ms' : '0ms' }}
          className={`rounded-[4px_18px_18px_4px] bg-white/[0.06] p-2.5 px-3.5 text-xs text-slate-200 leading-relaxed shadow-sm transition-all duration-300 ${
            typingDone ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          Bir sorunuz, öneriniz veya mesajınız varsa lütfen aşağıdaki formu doldurarak bize iletin.
        </div>
        <div
          style={{ transitionDelay: typingDone ? '240ms' : '0ms' }}
          className={`rounded-[4px_18px_18px_4px] bg-white/[0.06] p-2.5 px-3.5 text-xs text-slate-200 leading-relaxed shadow-sm transition-all duration-300 ${
            typingDone ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          <div>Size e-posta adresinizden en kısa sürede dönüş yapacağız.</div>
          <div className="flex items-center justify-end gap-1 text-[10px] text-white/50 mt-1">
            <span>Şimdi</span>
            <svg className="w-3.5 h-3.5 stroke-[#38bdf8] fill-none" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M18 6L7 17l-5-5M22 10l-7.5 7.5L13 16" />
            </svg>
          </div>
        </div>
      </div>

      {sentSuccess ? (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 text-emerald-400 text-xs text-center font-medium animate-in fade-in">
          Mesajınız başarıyla iletildi! En kısa sürede dönüş yapacağız.
        </div>
      ) : (
        <form onSubmit={handleContactSubmit}>
          <div className="ns-slider-container">
            {/* 0. Ad (İsim) Slaytı */}
            <div className={`ns-slide ${currentStep === 0 ? 'active' : currentStep > 0 ? 'passed' : ''} ${shakeStep === 0 ? 'ns-shake' : ''}`}>
              <div className="ns-input-wrap">
                <input
                  ref={nameInputRef}
                  type="text"
                  value={contactName}
                  onChange={(e) => {
                    setContactName(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleNext0();
                    }
                  }}
                  placeholder=" "
                  autoComplete="name"
                />
                <label>İsim</label>
              </div>
              <button
                type="button"
                onClick={handleNext0}
                className="ns-btn-next"
                title="İleri"
                aria-label="İleri"
              >
                <svg viewBox="0 0 24 24">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>

            {/* 1. E-posta Slaytı */}
            <div className={`ns-slide ${currentStep === 1 ? 'active' : currentStep > 1 ? 'passed' : ''} ${shakeStep === 1 ? 'ns-shake' : ''}`}>
              <div className="ns-input-wrap">
                <input
                  ref={emailInputRef}
                  type="email"
                  value={contactEmail}
                  onChange={(e) => {
                    setContactEmail(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleNext1();
                    }
                  }}
                  placeholder=" "
                  autoComplete="email"
                />
                <label>E-posta</label>
              </div>
              <button
                type="button"
                onClick={handleNext1}
                className="ns-btn-next"
                title="İleri"
                aria-label="İleri"
              >
                <svg viewBox="0 0 24 24">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>

            {/* 2. Mesaj Slaytı */}
            <div className={`ns-slide ns-slide-msg ${currentStep === 2 ? 'active' : currentStep > 2 ? 'passed' : ''} ${shakeStep === 2 ? 'ns-shake' : ''}`}>
              <div className="ns-input-wrap ns-msg-field">
                <textarea
                  ref={msgInputRef}
                  rows={1}
                  value={contactMessage}
                  onChange={handleMessageChange}
                  onKeyDown={(e) => {
                    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                      e.preventDefault();
                      handleNext2();
                    }
                  }}
                  placeholder=" "
                />
                <label>Mesajınız</label>
              </div>
              <button
                type="button"
                onClick={handleNext2}
                className="ns-btn-next"
                title="İleri"
                aria-label="İleri"
              >
                <svg viewBox="0 0 24 24">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>

            {/* 3. Gönder Butonu Slaytı */}
            <div className={`ns-slide ${currentStep === 3 ? 'active' : ''} ${shakeStep === 3 ? 'ns-shake' : ''}`}>
              <button
                ref={submitBtnRef}
                type="submit"
                disabled={isSending}
                className="ns-btn-submit"
              >
                <svg viewBox="0 0 24 24">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
                <span>{isSending ? 'Gönderiliyor...' : 'Mesajı Gönder'}</span>
              </button>
            </div>
          </div>

          {/* Hata Bildirimi */}
          {errorMessage && (
            <div className="mt-2.5 p-2 rounded-lg bg-red-500/10 text-red-400 text-xs text-center font-medium">
              {errorMessage}
            </div>
          )}
        </form>
      )}
    </>
  );

  const content = (
    <div className="space-y-6 text-xs text-[#a1a1aa] select-none">
      
      {/* Mobile Drawer Header (Only when opened as drawer on mobile) */}
      {onCloseDrawer && (
        <div className="flex items-center justify-between pb-3 lg:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--linkC,#9aa0a6)]" />
            <h2 className="font-bold text-sm text-white">Sağ Panel</h2>
          </div>
          <button
            onClick={onCloseDrawer}
            className="p-1.5 rounded-lg bg-[#252526] hover:bg-[#333333] text-[#a1a1aa] hover:text-white transition-colors"
            aria-label="Kapat"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Widget 1: Popüler Post (#PopularPosts01 - Sıfır Kutu, Kenarlıksız, Doğrudan Sidebar Üzerinde) */}
      <section aria-label="Popüler Post" className="space-y-4">
        
        {/* Başlık: Pulse İkonu + Popüler Post (.title) */}
        <div className="flex items-center gap-2 mb-3">
          <PulseIcon className="w-5 h-5 text-[var(--linkC,#9aa0a6)]" />
          <h2 className="text-[1.15rem] font-bold text-white tracking-wide">
            Popüler Post
          </h2>
        </div>

        {/* Blogger PopularPosts01 Tek Döngü (#1 Büyük Thumbnail + Başlık, #2-#5 Kompakt Liste — Tekrarsız) */}
        <div className="space-y-4">
          {listPosts.map((post: LinkItem, idx: number) => {
            const category = post.tags[0] || 'genel';
            return (
              <article
                key={post.id || idx}
                onClick={() => {
                  onOpenPostPage(post);
                  if (onCloseDrawer) onCloseDrawer();
                }}
                className="group cursor-pointer select-none space-y-1.5 transition-colors"
              >
                {idx === 0 && (
                  <div className="relative w-full aspect-[16/9] rounded-[12px] overflow-hidden bg-[#1e1e1e] mb-2.5">
                    {post.thumbnail ? (
                      <img
                        src={post.thumbnail}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        loading="lazy"
                      />
                    ) : (
                      <BrandLogoCard url={post.url} title={post.title} size="card" />
                    )}
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[11px] text-[#71717a]">{formatDate(post.createdAt)}</span>
                  <span className="text-[#52525b]">—</span>
                  <span className="text-[11px] text-[var(--linkC,#9aa0a6)] hover:underline lowercase">{category}</span>
                </div>

                <h4 className="font-bold text-xs sm:text-[13px] text-white group-hover:text-[var(--linkC,#9aa0a6)] leading-snug transition-colors line-clamp-2">
                  <span className="text-[#989b9f] font-mono mr-1.5 font-normal">#{idx + 1}</span>
                  {post.title}
                </h4>

                {idx === 0 && post.description && (
                  <p className="text-[11px] text-[#989b9f] line-clamp-2 leading-relaxed pt-0.5">
                    {post.description}
                  </p>
                )}
              </article>
            );
          })}
        </div>
      </section>

      {/* Widget 2: Etiketler (#Label01) */}
      <section aria-label="Etiketler" className="space-y-3 pt-2">
        
        {/* Başlık: Hedef İkonu + Etiketler + Çizgi Butonlar (.car-nav) */}
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2">
            <TagBloggerIcon className="w-4 h-4 text-[var(--linkC,#9aa0a6)]" />
            <h2 className="text-[1.15rem] font-bold text-white tracking-wide">
              Etiketler
            </h2>
          </div>

          {/* Blogger Çizgi Navigasyon Butonları */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => scrollTags('left')}
              className={`h-1.5 rounded-full transition-all duration-200 ${
                tagCanScrollLeft 
                  ? 'w-6 bg-[var(--linkC,#9aa0a6)] cursor-pointer' 
                  : 'w-4 bg-white/20 opacity-40 cursor-default'
              }`}
              title="Önceki Etiketler"
              aria-label="Önceki Etiketler"
            />
            <button
              onClick={() => scrollTags('right')}
              className={`h-1.5 rounded-full transition-all duration-200 ${
                tagCanScrollRight 
                  ? 'w-6 bg-[var(--linkC,#9aa0a6)] cursor-pointer' 
                  : 'w-4 bg-white/20 opacity-40 cursor-default'
              }`}
              title="Sonraki Etiketler"
              aria-label="Sonraki Etiketler"
            />
          </div>
        </div>

        {/* Yatay Kayar Etiket Çipleri (.lbL - Fareyle Çekilebilir / Dokunmatik) */}
        <div 
          ref={tagsTrackRef}
          onScroll={checkTagScroll}
          onMouseDown={handleTagsMouseDown}
          onMouseMove={handleTagsMouseMove}
          onMouseUp={handleTagsMouseUpOrLeave}
          onMouseLeave={handleTagsMouseUpOrLeave}
          className="lbL flex gap-2 overflow-x-auto pb-1 hide-scrollbar scroll-smooth cursor-grab active:cursor-grabbing select-none"
        >
          {tags.map((t) => {
            const count = counts.tags[t.name] || 0;
            return (
              <button
                key={t.name}
                onClick={() => {
                  onSelectTag(t.name);
                  if (onCloseDrawer) onCloseDrawer();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#252526] hover:bg-[#2d2d30] text-[#d4d4d4] hover:text-[var(--linkC,#9aa0a6)] border-0 text-xs font-medium transition-all shrink-0 active:scale-95 shadow-none cursor-pointer"
              >
                <span>{t.name}</span>
                <span className="text-[11px] text-[#9ca3af] opacity-80 font-normal ml-0.5 shadow-none bg-transparent">({count})</span>
              </button>
            );
          })}
        </div>
      </section>

    </div>
  );

  return (
    <>
      {/* 1. Masaüstü Sağ Bar: Sayfayla Birlikte Kayar! (Ayrı kaydırma çubuğu YOK) */}
      <div className="w-full block">
        {content}
      </div>

      {/* 2. Mobil / Tablet Sağ Çekmece */}
      {isDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={onCloseDrawer}
          />
          <div className="relative w-80 max-w-[85vw] h-full bg-[#1e1e1e] border-0 shadow-2xl p-4 overflow-y-auto z-10 animate-in slide-in-from-right duration-300">
            {content}
          </div>
        </div>
      )}

      {/* 3. Nsone Bot Spotlight Modalı (.cf-spotlight) — nsone.xml 1:1: ortada, cam efektli, kapatılabilir */}
      {isSpotlightOpen &&
        createPortal(
          <>
            {/* Bulanık Arkaplan Örtüsü (.cf-backdrop) — tıklayınca kapatır */}
            <div
              className="cf-backdrop fixed inset-0 z-[9998] bg-[rgba(15,17,23,0.65)] backdrop-blur-[12px] animate-in fade-in duration-200"
              onClick={closeSpotlight}
            />

            {/* Spotlight Penceresi (.cf-spotlight) */}
            <section
              id="ContactForm2Spotlight"
              role="dialog"
              aria-modal="true"
              aria-label="Bize Ulaşın — Nsone Bot"
              className="cf-spotlight fixed left-1/2 top-1/2 z-[9999] w-[min(calc(100vw-32px),360px)] max-h-[min(92vh,760px)] overflow-y-auto overscroll-contain rounded-[24px] max-[600px]:rounded-[20px] bg-[rgba(22,25,34,0.78)] backdrop-blur-[28px] border-0 p-6 pb-5 shadow-[0_30px_80px_rgba(0,0,0,0.72)] cf-spotlight-anim"
            >
              {/* Kapat (X) Butonu (.cf-close-btn) */}
              <button
                type="button"
                onClick={closeSpotlight}
                className="absolute top-3 right-3 w-9 h-9 rounded-[10px] bg-white/[0.08] backdrop-blur-[14px] border-0 hover:bg-[#333333] text-[#989b9f] hover:text-white flex items-center justify-center transition-all cursor-pointer z-10"
                aria-label="Kapat"
                title="Kapat"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-[17px] h-[17px]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              {nsoneBotPanel}
            </section>
          </>,
          document.body
        )}
    </>
  );
};
