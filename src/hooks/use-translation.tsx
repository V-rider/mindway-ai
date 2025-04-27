
import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'zh' | 'zh-TW';

interface TranslationContextType {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    'dashboard': 'Dashboard',
    'upload.tests': 'Upload Tests',
    'reports': 'Reports',
    'analytics': 'Analytics',
    'learning.pathway': 'Learning Pathway',
    'students': 'Students',
    'welcome': 'Welcome',
    'logout': 'Logout',
  },
  zh: {
    'dashboard': '儀表板',
    'upload.tests': '上傳測驗',
    'reports': '報告',
    'analytics': '分析',
    'learning.pathway': '學習路徑',
    'students': '學生',
    'welcome': '歡迎',
    'logout': '登出',
  },
  'zh-TW': {
    'dashboard': '儀表板',
    'upload.tests': '上傳測驗',
    'reports': '報告',
    'analytics': '分析',
    'learning.pathway': '學習路徑',
    'students': '學生',
    'welcome': '歡迎',
    'logout': '登出',
  }
};

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');

  const value = {
    currentLanguage,
    setLanguage: setCurrentLanguage,
    t: (key: string) => {
      if (!translations[currentLanguage]) {
        return key;
      }
      return translations[currentLanguage][key] || key;
    },
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};
