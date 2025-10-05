
"use client";

import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import en from '@/locales/en.json';
import th from '@/locales/th.json';

export type Language = 'en' | 'th';

type Translations = {
  [key: string]: string | { [key: string]: string };
};

const translations: { [key in Language]: Translations } = {
  en,
  th
};

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, options?: { [key: string]: string | number }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'th') {
      setLanguage('th');
    }
  }, []);

  useEffect(() => {
    if (language === 'th') {
        document.documentElement.lang = 'th';
    } else {
        document.documentElement.lang = 'en';
    }
  }, [language]);

  const t = useCallback((key: string, options?: { [key: string]: string | number }) => {
    let text = translations[language][key] as string;

    if (options) {
        Object.keys(options).forEach(optKey => {
            const regex = new RegExp(`{{${optKey}}}`, 'g');
            text = text.replace(regex, String(options[optKey]));
        });
    }

    return text || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
