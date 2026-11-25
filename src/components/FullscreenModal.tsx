import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

/**
 * Tam ekran pencere: arama kutusu ve paylaş penceresiyle aynı tasarım.
 * - Ekranı tamamen kaplar, içerik tek parça kayar.
 * - Altta başlık ve kapat düğmesi olan sabit çubuk bulunur.
 * - Boşluğa dokunmak veya Esc pencereyi kapatır; üst üste birden fazla pencere
 *   açıksa Esc yalnızca en üsttekini kapatır.
 */

// Açık pencerelerin sırası (sonuncusu en üstteki)
const openStack: number[] = [];
let nextId = 1;

interface FullscreenModalProps {
  id?: string;
  /** Alt çubukta görünen başlık, örn. "#Ayarlar" */
  title: string;
  ariaLabel: string;
  /** Tailwind max-w sınıfı, örn. "max-w-xl" */
  maxWidth?: string;
  onClose: () => void;
  children: React.ReactNode;
}

export const FullscreenModal: React.FC<FullscreenModalProps> = ({
  id,
  title,
  ariaLabel,
  maxWidth = 'max-w-lg',
  onClose,
  children
}) => {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const myId = nextId++;
    openStack.push(myId);
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (openStack[openStack.length - 1] !== myId) return;
      onCloseRef.current();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      const i = openStack.indexOf(myId);
      if (i !== -1) openStack.splice(i, 1);
    };
  }, []);

  return createPortal(
    <div
      id={id}
      className="editFullscreen fixed inset-0 z-[999999] overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Tam ekran içerik; boşluğa dokunmak da pencereyi kapatır */}
      <div
        className={`w-full ${maxWidth} mx-auto px-3 pt-12 pb-[calc(55px+env(safe-area-inset-bottom,0px)+24px)] text-neutral-200`}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        {children}
      </div>

      {/* Alt çubuk: başlık + kapat (Esc ve boşluğa tıklama da kapatır) */}
      <div className="advBottomBar">
        <span className="advBottomTitle">{title}</span>
        <button
          type="button"
          onClick={onClose}
          className="advBottomClose"
          title="Kapat (Esc)"
          aria-label="Kapat (Esc)"
        >
          <X className="" />
        </button>
      </div>
    </div>,
    document.body
  );
};
