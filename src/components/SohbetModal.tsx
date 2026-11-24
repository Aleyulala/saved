import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { SOHBET_URL } from '../config';
import { CloseIcon } from './BloggerIcons';

interface SohbetModalProps {
  onClose: () => void;
}

/**
 * #Sohbet — Blogger'daki gerçek sohbet çekmecesi tam ekran (İletişim gibi).
 * Blogger sayfası kendi alt çubuğunu çizer; iframe'i 66px taşırıp o çubuğu kendi çubuğumuzun altına gizliyoruz.
 */
export const SohbetModal: React.FC<SohbetModalProps> = ({ onClose }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return createPortal(
    <section id="SohbetFullscreen" role="dialog" aria-modal="true" aria-label="#Sohbet" className="sohbetFs">
      <div className="sohbetFrameWrap">
        <iframe src={SOHBET_URL} title="#Sohbet" className="sohbetFrame" allow="clipboard-write" />
      </div>
      <div className="sohbetBar">
        <span className="sohbetTitle">#Sohbet</span>
        <button type="button" className="glassBtn" onClick={onClose} title="Kapat (Esc)" aria-label="Kapat (Esc)">
          <CloseIcon className="" />
        </button>
      </div>
    </section>,
    document.body
  );
};
