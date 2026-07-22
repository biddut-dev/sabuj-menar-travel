"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../lib/translations';

type Language = 'bn' | 'en';
type TranslationKey = keyof typeof translations.en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  tExt: (bnVal: string | null | undefined, enVal: string | null | undefined) => string;
  tExtArray: (bnVal: string[] | null | undefined, enVal: string[] | null | undefined) => string[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('bn');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem('sabuj_menar_lang') as Language;
    if (savedLang === 'bn' || savedLang === 'en') {
      setLanguageState(savedLang);
    }
    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('sabuj_menar_lang', lang);
  };

  const t = (key: TranslationKey): string => {
    return translations[language][key] || translations['bn'][key] || String(key);
  };

  // Helper to translate dynamic database content
  const tExt = (bnVal: string | null | undefined, enVal: string | null | undefined): string => {
    if (language === 'en') {
      return enVal || bnVal || '';
    }
    return bnVal || '';
  };

  // Helper to translate array lists (like package highlights)
  const tExtArray = (bnVal: string[] | null | undefined, enVal: string[] | null | undefined): string[] => {
    if (language === 'en') {
      return enVal && enVal.length > 0 ? enVal : bnVal || [];
    }
    return bnVal || [];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, tExt, tExtArray }}>
      {mounted ? children : <div style={{ visibility: 'hidden' }}>{children}</div>}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
