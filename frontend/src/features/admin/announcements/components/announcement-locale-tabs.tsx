import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form';
import { AnnouncementFormValues } from '../announcements.types';
import { useTranslations } from 'next-intl';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface AnnouncementLocaleTabsProps {
  register: UseFormRegister<AnnouncementFormValues>;
  errors: FieldErrors<AnnouncementFormValues>;
  watch: UseFormWatch<AnnouncementFormValues>;
}

export const AnnouncementLocaleTabs = ({ register, errors, watch }: AnnouncementLocaleTabsProps) => {
  const t = useTranslations('Admin.Announcements.form');
  const tErrors = useTranslations('Admin.Announcements.errors');
  const languages = ['sk', 'cz', 'en'] as const;

  return (
    <Tabs defaultValue="sk" className="w-full mt-4">
      <div className="mb-10 flex items-center justify-between border-b border-white/5 pb-4">
        <TabsList className="bg-white/5">
          <TabsTrigger value="sk" className="px-6 font-bold tracking-widest uppercase italic">
            SK
          </TabsTrigger>
          <TabsTrigger value="cz" className="px-6 font-bold tracking-widest uppercase italic">
            CZ
          </TabsTrigger>
          <TabsTrigger value="en" className="px-6 font-bold tracking-widest uppercase italic">
            EN
          </TabsTrigger>
        </TabsList>
        <span className="text-white/20 font-mono text-[10px] tracking-widest uppercase italic">
          {t('locales_title')}
        </span>
      </div>

      {languages.map((lang) => (
        <TabsContent
          key={lang}
          value={lang}
          className="animate-in fade-in slide-in-from-left-4 mt-0 space-y-6 duration-500"
        >
          <div className="space-y-2">
            <Label className="text-white/40 font-mono text-[10px] ml-1 tracking-widest uppercase italic">
              {t('title')} ({lang.toUpperCase()})
            </Label>
            <Input
              {...register(`locales.${lang}.title`)}
              placeholder={t('title_placeholder')}
              className="h-12 border-white/10 bg-white/5 font-bold tracking-wide focus:border-primary/50"
            />
            {errors.locales?.[lang]?.title && (
              <span className="text-red-400 text-[10px] font-bold tracking-widest uppercase italic px-1">
                {tErrors(errors.locales[lang]?.title?.message as never)}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-white/40 font-mono text-[10px] ml-1 tracking-widest uppercase italic">
              {t('excerpt')} ({lang.toUpperCase()})
            </Label>
            <Textarea
              {...register(`locales.${lang}.excerpt`)}
              placeholder={t('excerpt_placeholder')}
              className="min-h-[100px] border-white/10 bg-white/5 resize-none focus:border-primary/50"
            />
            {errors.locales?.[lang]?.excerpt && (
              <span className="text-red-400 text-[10px] font-bold tracking-widest uppercase italic px-1">
                {tErrors(errors.locales[lang]?.excerpt?.message as never)}
              </span>
            )}
          </div>

          <div className="space-y-4">
            <Tabs defaultValue="write" className="w-full">
              <div className="flex items-center justify-between">
                <Label className="text-white/40 font-mono text-[10px] ml-1 tracking-widest uppercase italic">
                  {t('content')} ({lang.toUpperCase()})
                </Label>
                <TabsList className="h-5 bg-white/5 p-0.5 gap-0.5">
                  <TabsTrigger
                    value="write"
                    className="h-full px-2 text-[8px] font-bold tracking-widest uppercase italic"
                  >
                    {t('write')}
                  </TabsTrigger>
                  <TabsTrigger
                    value="preview"
                    className="h-full px-2 text-[8px] font-bold tracking-widest uppercase italic"
                  >
                    {t('preview')}
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="write" className="mt-2 outline-none">
                <Textarea
                  {...register(`locales.${lang}.content`)}
                  placeholder={t('content_placeholder')}
                  className="min-h-[300px] border-white/10 bg-white/5 focus:border-primary/50"
                />
              </TabsContent>

              <TabsContent value="preview" className="mt-2 outline-none">
                <div className="min-h-[300px] rounded-md border border-white/10 bg-white/5 p-6 overflow-y-auto">
                  <div className="prose prose-sm prose-invert max-w-none 
                    [&_h1]:text-xl [&_h1]:font-black [&_h1]:mb-4 [&_h1]:uppercase [&_h1]:tracking-wider
                    [&_h2]:text-lg [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:uppercase [&_h2]:tracking-wider
                    [&_h3]:text-md [&_h3]:font-bold [&_h3]:mb-2
                    [&_p]:text-white/80 [&_p]:leading-relaxed [&_p]:mb-4
                    [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ul]:text-white/80
                    [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 [&_ol]:text-white/80
                    [&_li]:mb-1
                    [&_code]:bg-white/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-primary-foreground
                    [&_pre]:bg-white/5 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:mb-4 [&_pre]:overflow-x-auto
                    [&_blockquote]:border-l-4 [&_blockquote]:border-primary/50 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-white/60 [&_blockquote]:mb-4
                    [&_a]:text-primary [&_a]:underline [&_a]:hover:text-primary/80
                  ">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {watch(`locales.${lang}.content`) || ''}
                    </ReactMarkdown>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            {errors.locales?.[lang]?.content && (
              <span className="text-red-400 text-[10px] font-bold tracking-widest uppercase italic px-1">
                {tErrors(errors.locales[lang]?.content?.message as never)}
              </span>
            )}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};
