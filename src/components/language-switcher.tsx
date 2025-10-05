
"use client";

import { useTranslation } from "@/context/language-context";
import { Button } from "@/components/ui/button";

export function LanguageSwitcher() {
  const { language, setLanguage } = useTranslation();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'th' : 'en');
  };

  return (
    <Button onClick={toggleLanguage} variant="outline" size="sm">
      {language === 'en' ? 'ไทย' : 'EN'}
    </Button>
  );
}
