
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
    'analysis': 'Analysis',
    'overall.score': 'Overall Score',
    'total.questions': 'Total Questions',
    'correct.answers': 'Correct Answers',
    'incorrect.answers': 'Incorrect Answers',
    'performance.by.concept': 'Performance by Concept',
    'of': 'of',
    'correct': 'correct',
    'practice.this.concept': 'Practice this concept',
    'common.error.types': 'Common Error Types',
    'error': 'error',
    'errors': 'errors',
    'recommendations.for.improvement': 'Recommendations for Improvement',
    'change.language': 'Change Language',
    'profile': 'Profile'
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
    'analysis': '分析',
    'overall.score': '總分',
    'total.questions': '問題總數',
    'correct.answers': '正確答案',
    'incorrect.answers': '錯誤答案',
    'performance.by.concept': '概念表現',
    'of': '/',
    'correct': '正確',
    'practice.this.concept': '練習這個概念',
    'common.error.types': '常見錯誤類型',
    'error': '錯誤',
    'errors': '錯誤',
    'recommendations.for.improvement': '改進建議',
    'change.language': '變更語言',
    'profile': '個人資料'
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
    'analysis': '分析',
    'overall.score': '總分',
    'total.questions': '問題總數',
    'correct.answers': '正確答案',
    'incorrect.answers': '錯誤答案',
    'performance.by.concept': '概念表現',
    'of': '/',
    'correct': '正確',
    'practice.this.concept': '練習這個概念',
    'common.error.types': '常見錯誤類型',
    'error': '錯誤',
    'errors': '錯誤',
    'recommendations.for.improvement': '改進建議',
    'change.language': '變更語言',
    'profile': '個人資料'
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
