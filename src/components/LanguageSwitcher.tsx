
import React from 'react';
import { Globe, Languages } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useTranslation } from '@/hooks/use-translation';

export const LanguageSwitcher = () => {
  const { currentLanguage, setLanguage, t } = useTranslation();
  
  const getLanguageName = (lang: string) => {
    switch(lang) {
      case 'en': return 'English';
      case 'zh': return '简体中文';
      case 'zh-TW': return '繁體中文';
      default: return lang;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" title={t('change.language')}>
          <Languages className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t('change.language')}</DropdownMenuLabel>
        <DropdownMenuItem 
          onClick={() => setLanguage('en')} 
          className={currentLanguage === 'en' ? 'bg-purple-100 dark:bg-purple-900/30' : ''}
        >
          English
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setLanguage('zh')}
          className={currentLanguage === 'zh' ? 'bg-purple-100 dark:bg-purple-900/30' : ''}
        >
          简体中文
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setLanguage('zh-TW')}
          className={currentLanguage === 'zh-TW' ? 'bg-purple-100 dark:bg-purple-900/30' : ''}
        >
          繁體中文
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
