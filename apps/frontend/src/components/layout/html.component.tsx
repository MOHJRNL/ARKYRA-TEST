'use client';
import { FC, ReactNode, useEffect, useState } from 'react';
import { useTranslationSettings } from '@gitroom/react/translation/get.transation.service.client';
import i18next from 'i18next';

export const HtmlComponent: FC = () => {
  const settings = useTranslationSettings();
  const [dir, setDir] = useState(settings.dir());
  const [currentLang, setCurrentLang] = useState(i18next.resolvedLanguage || 'en');

  useEffect(() => {
    settings.on('languageChanged', (lng) => {
      setDir(settings.dir());
      setCurrentLang(lng);
    });
  }, []);

  useEffect(() => {
    const htmlElement = document.querySelector('html');
    const bodyElement = document.querySelector('body');
    if (htmlElement) {
      htmlElement.setAttribute('dir', dir);
      htmlElement.setAttribute('lang', currentLang);
    }

    // Apply font based on language
    if (bodyElement) {
      const isArabic = currentLang === 'ar';
      if (isArabic) {
        bodyElement.style.fontFamily = 'var(--font-al-jazeera-arabic), sans-serif';
      } else {
        bodyElement.style.fontFamily = 'var(--font-jakarta-sans), sans-serif';
      }
    }
  }, [dir, currentLang]);

  return null;
};
