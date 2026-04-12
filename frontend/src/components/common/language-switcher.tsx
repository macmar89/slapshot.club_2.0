'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { cn } from '@/lib/utils';
import { Languages, ChevronDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { API_ROUTES } from '@/lib/api-routes';

const setLocaleCookie = (newLocale: string) => {
  document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'sk', label: 'Slovenčina' },
    { code: 'cs', label: 'Čeština' },
    // { code: 'en', label: 'English' },
  ];

  const toggleLanguage = async (newLocale: string) => {
    // 1. Manually set the cookie to be sure (especially for localePrefix: 'never')
    setLocaleCookie(newLocale);

    // 2. Try to update the preferred language in the database
    // Only if access_token exists
    if (document.cookie.includes('access_token')) {
      try {
        await api.patch(API_ROUTES.USER.UPDATE_PREFERRED_LANGUAGE, {
          preferredLanguage: newLocale,
        });
      } catch {
        // Ignore errors if user is not logged in or endpoint fails
      }
    }

    // 3. Close the dropdown
    setIsOpen(false);

    // 4. Use window.location.reload() to ensure the change is picked up across the whole app
    window.location.reload();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = languages.find((l) => l.code === locale) || languages[0];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex h-auto items-center gap-2.5 rounded-md border border-white/10 bg-white/5 px-4 py-2 shadow-lg shadow-black/20 backdrop-blur-md transition-all duration-300',
          'group hover:border-white/20 hover:bg-white/10 active:scale-95',
          isOpen && 'ring-primary/20 border-white/30 bg-white/15 ring-2',
        )}
      >
        <div className="border-primary/30 bg-primary/20 group-hover:bg-primary/30 flex h-5 w-5 items-center justify-center rounded-full border transition-colors">
          <Languages className="text-primary h-3 w-3" />
        </div>
        <span className="text-sm font-black tracking-widest text-white/90 uppercase transition-colors group-hover:text-white">
          {currentLang.code}
        </span>
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 text-white/40 transition-transform duration-300',
            isOpen && 'text-primary rotate-180',
          )}
        />
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="animate-in fade-in zoom-in absolute right-0 z-[100] mt-3 w-44 origin-top-right duration-200">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/90 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
            {/* Top Shine/Bevel */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />

            <div className="relative py-1.5">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => toggleLanguage(lang.code)}
                  className={cn(
                    'flex w-full items-center justify-between px-4 py-3 text-sm transition-all duration-200',
                    'group hover:bg-white/10',
                    locale === lang.code ? 'text-primary' : 'text-white/60 hover:text-white',
                  )}
                >
                  <span className="text-xs font-bold tracking-tight uppercase">{lang.label}</span>
                  {locale === lang.code && (
                    <div className="border-primary/20 bg-primary/10 flex h-4 w-4 items-center justify-center rounded-full border shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)]">
                      <Check className="text-primary h-2.5 w-2.5 stroke-[3px]" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
