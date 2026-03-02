'use client';

import React, { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { Shirt, Save, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { updateJerseyAction } from '@/features/auth/account-actions';
import { toast } from 'sonner';
import { JerseyAvatar, JerseyPattern, JerseyStyle } from '../JerseyAvatar';
import { cn } from '@/lib/utils';

interface JerseyEditorProps {
  initialJersey?: {
    primaryColor?: string;
    secondaryColor?: string;
    pattern?: string;
    number?: string;
    style?: string;
  };
}

const COLORS = [
  '#ef4444', // Red
  '#3b82f6', // Blue
  '#22c55e', // Green
  '#eab308', // Yellow
  '#f97316', // Orange
  '#a855f7', // Purple
  '#000000', // Black
  '#ffffff', // White
  '#64748b', // Slate
  '#0f172a', // Navy
];

const PATTERNS: { value: JerseyPattern }[] = [
  { value: 'stripes' },
  { value: 'bands' },
  { value: 'plain' },
  { value: 'chevrons' },
  { value: 'hoops' },
];

import { IceGlassCard } from '@/components/ui/ice-glass-card';

export function JerseyEditor({ initialJersey }: JerseyEditorProps) {
  const t = useTranslations('Jersey');
  const [isPending, startTransition] = useTransition();

  const [jersey, setJersey] = useState({
    primaryColor: initialJersey?.primaryColor || '#ef4444',
    secondaryColor: initialJersey?.secondaryColor || '#ffffff',
    pattern: (initialJersey?.pattern as JerseyPattern) || 'stripes',
    number: initialJersey?.number || '10',
    style: (initialJersey?.style as JerseyStyle) || 'classic',
  });

  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (field: string, value: any) => {
    setJersey((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    startTransition(async () => {
      const result = await updateJerseyAction({
        primaryColor: jersey.primaryColor,
        secondaryColor: jersey.secondaryColor,
        pattern: jersey.pattern,
        number: jersey.number,
        style: jersey.style,
      });

      if (result.ok) {
        toast.success(t('success'));
        setHasChanges(false);
      } else {
        toast.error(t('error') + ': ' + result.error);
      }
    });
  };

  return (
    <IceGlassCard
      backdropBlur="md"
      className="flex flex-col overflow-hidden border border-white/10 p-0 shadow-xl md:col-span-2 md:flex-row"
    >
      {/* Visual Preview Area */}
      <div className="relative flex items-center justify-center border-b border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8 md:w-1/3 md:border-r md:border-b-0 md:p-12">
        <div className="scale-125 transform transition-transform duration-500 hover:rotate-2 md:scale-150">
          <JerseyAvatar {...jersey} size={180} className="drop-shadow-2xl" />
        </div>
        <div className="absolute top-4 left-4">
          <div className="text-primary/80 flex items-center gap-2">
            <Shirt className="h-5 w-5" />
            <span className="text-xs font-black tracking-widest uppercase">{t('title')}</span>
          </div>
        </div>
      </div>

      {/* Controls Area */}
      <div className="flex-1 space-y-8 p-6 md:p-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Colors */}
          <div className="space-y-4">
            <h3 className="text-xs font-black tracking-widest text-white/40 uppercase">
              {t('colors_title')}
            </h3>
            <div className="space-y-3">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-white/60">{t('primary')}</span>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => handleChange('primaryColor', c)}
                      className={cn(
                        'h-8 w-8 rounded-full border-2 transition-transform hover:scale-110',
                        jersey.primaryColor === c
                          ? 'scale-110 border-white shadow-lg'
                          : 'border-white/10',
                      )}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-white/60">{t('secondary')}</span>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => handleChange('secondaryColor', c)}
                      className={cn(
                        'h-6 w-6 rounded-full border-2 transition-transform hover:scale-110',
                        jersey.secondaryColor === c
                          ? 'scale-110 border-white shadow-lg'
                          : 'border-white/10',
                      )}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Config */}
          <div className="space-y-4">
            <h3 className="text-xs font-black tracking-widest text-white/40 uppercase">
              {t('design_title')}
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/60">{t('pattern')}</label>
                <div className="flex flex-wrap gap-2">
                  {PATTERNS.map((p) => (
                    <button
                      key={p.value}
                      onClick={() => handleChange('pattern', p.value)}
                      className={cn(
                        'rounded-lg border px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase transition-all',
                        jersey.pattern === p.value
                          ? 'border-white bg-white text-black'
                          : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10',
                      )}
                    >
                      {t(`patterns.${p.value}`)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-24">
                  <label className="mb-1 block text-[10px] font-bold text-white/60">
                    {t('number')}
                  </label>
                  <input
                    value={jersey.number}
                    onChange={(e) => {
                      if (e.target.value.length <= 2) {
                        handleChange('number', e.target.value);
                      }
                    }}
                    className="focus:border-primary/50 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-center text-lg font-black text-white transition-all outline-none placeholder:text-white/20"
                    placeholder="10"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <label className="mb-1 block text-[10px] font-bold text-white/60">
                    {t('style')}
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleChange('style', 'classic')}
                      className={cn(
                        'flex-1 rounded-lg border py-1 text-[10px] font-bold uppercase transition-all',
                        jersey.style === 'classic'
                          ? 'border-white bg-white text-black'
                          : 'border-white/10 bg-white/5',
                      )}
                    >
                      {t('styles.classic')}
                    </button>
                    <button
                      onClick={() => handleChange('style', 'modern')}
                      className={cn(
                        'flex-1 rounded-lg border py-1 text-[10px] font-bold uppercase transition-all',
                        jersey.style === 'modern'
                          ? 'border-white bg-white text-black'
                          : 'border-white/10 bg-white/5',
                      )}
                    >
                      {t('styles.modern')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end border-t border-white/5 pt-4">
          <Button
            onClick={handleSave}
            className="bg-primary w-full px-8 text-xs font-black tracking-widest text-black uppercase italic md:w-auto md:text-sm"
            color="primary"
            disabled={!hasChanges || isPending}
          >
            {isPending ? (
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>{t('saving')}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                <span>{t('save')}</span>
              </div>
            )}
          </Button>
        </div>
      </div>
    </IceGlassCard>
  );
}
