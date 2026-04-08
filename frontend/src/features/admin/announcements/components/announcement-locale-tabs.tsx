import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UseFormRegister, FieldErrors, UseFormWatch, FormState } from 'react-hook-form';
import { AnnouncementFormValues } from '../announcements.types';
import { useTranslations } from 'next-intl';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

interface AnnouncementLocaleTabsProps {
  register: UseFormRegister<AnnouncementFormValues>;
  errors: FieldErrors<AnnouncementFormValues>;
  watch: UseFormWatch<AnnouncementFormValues>;
  dirtyFields: FormState<AnnouncementFormValues>['dirtyFields'];
  isDisabled?: boolean;
}

export const AnnouncementLocaleTabs = ({
  register,
  errors,
  watch,
  dirtyFields,
  isDisabled,
}: AnnouncementLocaleTabsProps) => {
  const t = useTranslations('Admin.Announcements.form');
  const tErrors = useTranslations('Admin.Announcements.errors');
  const languages = ['sk', 'cz', 'en'] as const;

  return (
    <Tabs defaultValue="sk" className="mt-4 w-full">
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
        <span className="font-mono text-[12px] tracking-widest text-white/60 uppercase italic">
          {t('locales_title')}
        </span>
      </div>

      {languages.map((lang) => (
        <TabsContent
          key={lang}
          value={lang}
          className="mt-0 space-y-6"
        >
          <div className="space-y-2">
            <Label className="ml-1 font-mono text-[12px] tracking-widest text-white uppercase italic">
              {t('title')} ({lang.toUpperCase()})
            </Label>
            <Input
              {...register(`locales.${lang}.title`)}
              placeholder={t('title_placeholder')}
              disabled={isDisabled}
              className={cn(
                'focus:border-primary/50 h-12 border-white/10 bg-white/5 font-bold tracking-wide transition-all duration-300',
                dirtyFields.locales?.[lang]?.title && !isDisabled &&
                  'border-primary ring-primary/20 shadow-[0_0_15px_rgba(234,179,8,0.3)] ring-1',
                isDisabled && 'cursor-not-allowed opacity-50'
              )}
            />
            {errors.locales?.[lang]?.title && (
              <span className="px-1 text-[10px] font-bold tracking-widest text-red-400 uppercase italic">
                {tErrors(errors.locales[lang]?.title?.message as never)}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <Label className="ml-1 font-mono text-[12px] tracking-widest text-white uppercase italic">
              {t('excerpt')} ({lang.toUpperCase()})
            </Label>
            <Textarea
              {...register(`locales.${lang}.excerpt`)}
              placeholder={t('excerpt_placeholder')}
              disabled={isDisabled}
              className={cn(
                'focus:border-primary/50 rounded-app min-h-[100px] resize-none border-white/10 bg-white/5 transition-all duration-300',
                dirtyFields.locales?.[lang]?.excerpt && !isDisabled &&
                  'border-primary ring-primary/20 shadow-[0_0_15px_rgba(234,179,8,0.3)] ring-1',
                isDisabled && 'cursor-not-allowed opacity-50'
              )}
            />
            {errors.locales?.[lang]?.excerpt && (
              <span className="px-1 text-[10px] font-bold tracking-widest text-red-400 uppercase italic">
                {tErrors(errors.locales[lang]?.excerpt?.message as never)}
              </span>
            )}
          </div>

          <div className="space-y-4">
            <Tabs defaultValue="write" className="w-full">
              <div className="flex items-center justify-between">
                <Label className="ml-1 font-mono text-[12px] tracking-widest text-white uppercase italic">
                  {t('content')} ({lang.toUpperCase()})
                </Label>
                <TabsList className="h-5 gap-0.5 bg-white/5 p-0.5">
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
                  disabled={isDisabled}
                  className={cn(
                    'focus:border-primary/50 rounded-app min-h-[300px] border-white/10 bg-white/5 transition-all duration-300',
                    dirtyFields.locales?.[lang]?.content && !isDisabled &&
                      'border-primary ring-primary/20 shadow-[0_0_15px_rgba(234,179,8,0.3)] ring-1',
                    isDisabled && 'cursor-not-allowed opacity-50'
                  )}
                />
              </TabsContent>

              <TabsContent value="preview" className="mt-2 outline-none">
                <div className="rounded-app min-h-[300px] overflow-y-auto border border-white/10 bg-white/5 p-6">
                  <div className="prose prose-sm prose-invert [&_h3]:text-md [&_code]:text-primary-foreground [&_blockquote]:border-primary/50 [&_a]:text-primary [&_a]:hover:text-primary/80 [&_pre]:rounded-app max-w-none [&_a]:underline [&_blockquote]:mb-4 [&_blockquote]:border-l-4 [&_blockquote]:pl-4 [&_blockquote]:text-white/60 [&_blockquote]:italic [&_code]:rounded [&_code]:bg-white/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_h1]:mb-4 [&_h1]:text-xl [&_h1]:font-black [&_h1]:tracking-wider [&_h1]:uppercase [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:tracking-wider [&_h2]:uppercase [&_h3]:mb-2 [&_h3]:font-bold [&_li]:mb-1 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:text-white/80 [&_p]:mb-4 [&_p]:leading-relaxed [&_p]:text-white/80 [&_pre]:mb-4 [&_pre]:overflow-x-auto [&_pre]:bg-white/5 [&_pre]:p-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-white/80">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {watch(`locales.${lang}.content`) || ''}
                    </ReactMarkdown>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            {errors.locales?.[lang]?.content && (
              <span className="px-1 text-[10px] font-bold tracking-widest text-red-400 uppercase italic">
                {tErrors(errors.locales[lang]?.content?.message as never)}
              </span>
            )}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};
