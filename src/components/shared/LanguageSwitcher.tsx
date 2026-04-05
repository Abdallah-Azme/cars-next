"use client";

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname, routing } from '@/i18n/routing';
import { useParams } from 'next/navigation';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Globe, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'sw', name: 'Kiswahili', flag: '🇹🇿' },
];

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  function handleLocaleChange(newLocale: string) {
    router.replace(
      // @ts-expect-error -- pathname matches correctly
      { pathname, params },
      { locale: newLocale }
    );
  }

  const currentLang = languages.find(l => l.code === locale) || languages[0];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2 px-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <Globe size={18} className="text-muted-foreground" />
          <span className="text-xs font-bold uppercase tracking-wider">{locale}</span>
          <span className="hidden sm:inline-block ml-1">{currentLang.flag}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-48 p-1 backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="flex flex-col gap-1">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLocaleChange(lang.code)}
              className={cn(
                "flex items-center justify-between px-3 py-2 text-sm rounded-md transition-all",
                locale === lang.code 
                  ? "bg-primary/10 text-primary font-medium" 
                  : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
              )}
            >
              <span className="flex items-center gap-3">
                <span className="text-lg">{lang.flag}</span>
                <span>{lang.name}</span>
              </span>
              {locale === lang.code && <Check size={14} className="text-primary" />}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
