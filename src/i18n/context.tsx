'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import { ka, type TranslationKeys } from './ka';
import { en } from './en';
import { getItem, setItem, STORAGE_KEYS } from '@/lib/storage';

type Language = 'ka' | 'en';

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  /** Direct access to the full translation object */
  translations: TranslationKeys;
  /** Dot-notation accessor: t('nav.exams') -> 'გამოცდები' */
  t: (key: string) => string;
}

const translationMap: Record<Language, TranslationKeys> = { ka, en };

/**
 * Traverses a nested translation object using a dot-separated key path.
 * e.g. t('nav.exams') looks up translations.nav.exams
 */
function getByDotPath(obj: Record<string, unknown>, path: string): string {
  const parts = path.split('.');
  let current: unknown = obj;

  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return path; // Return the key itself as a fallback
    }
    current = (current as Record<string, unknown>)[part];
  }

  if (typeof current === 'string') {
    return current;
  }

  return path; // Return the key itself if the value isn't a string
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'ka',
  setLang: () => {},
  translations: ka,
  t: (key: string) => key,
});

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [lang, setLangState] = useState<Language>('ka');

  useEffect(() => {
    const stored = getItem<Language>(STORAGE_KEYS.LANGUAGE, 'ka');
    setLangState(stored);
  }, []);

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    setItem(STORAGE_KEYS.LANGUAGE, newLang);
  }, []);

  const translations = translationMap[lang];

  const t = useMemo(() => {
    return (key: string): string =>
      getByDotPath(translations as unknown as Record<string, unknown>, key);
  }, [translations]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, translations, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
