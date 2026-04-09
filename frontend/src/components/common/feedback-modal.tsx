'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MessageSquarePlus, Send, Bug, Lightbulb, HelpCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { submitFeedbackAction } from '@/actions/feedback';
import { Turnstile } from '@/components/common/turnstile';
import { type TurnstileInstance } from '@marsidev/react-turnstile';

interface FeedbackModalProps {
  children?: React.ReactNode;
  triggerClassName?: string;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function FeedbackModal({
  children,
  triggerClassName,
  defaultOpen,
  onOpenChange,
}: FeedbackModalProps) {
  const t = useTranslations('Feedback');
  const commonT = useTranslations('Common');
  const pathname = usePathname();

  const [open, setOpen] = useState(defaultOpen || false);
  const [type, setType] = useState<'bug' | 'idea' | 'other'>('idea');
  const [message, setMessage] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const turnstileRef = React.useRef<TurnstileInstance>(null);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    onOpenChange?.(newOpen);
    if (!newOpen) {
      // Reset form on close
      setTimeout(() => {
        setType('idea');
        setMessage('');
        setTurnstileToken('');
      }, 300);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    const result = await submitFeedbackAction(type, message, pathname, turnstileToken);
    setIsSubmitting(false);

    if (result.ok) {
      toast.success(t('success'));
      handleOpenChange(false);
    } else {
      toast.error(result.error || commonT('error_generic'));
      turnstileRef.current?.reset();
      setTurnstileToken('');
    }
  };

  const getTypeIcon = (t: string) => {
    switch (t) {
      case 'bug':
        return <Bug className="h-4 w-4" />;
      case 'idea':
        return <Lightbulb className="h-4 w-4" />;
      default:
        return <HelpCircle className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="ghost" className={triggerClassName}>
            <MessageSquarePlus className="h-5 w-5" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md border-white/10 bg-slate-950/95 text-white backdrop-blur-3xl">
        <DialogHeader>
          <DialogTitle className="text-warning text-2xl font-black tracking-tighter uppercase italic">
            {t('title')}
          </DialogTitle>
          <DialogDescription className="font-medium text-white/40">
            {t('description')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 py-4">
          <div className="flex flex-col gap-3">
            <Label className="text-[10px] font-black tracking-widest text-white/40 uppercase">
              {t('type_label')}
            </Label>
            <RadioGroup
              value={type}
              onValueChange={(value: 'bug' | 'idea' | 'other') => setType(value)}
              className="grid grid-cols-3 gap-2"
            >
              {(['idea', 'bug', 'other'] as const).map((tType) => (
                <div key={tType}>
                  <RadioGroupItem value={tType} id={tType} className="sr-only" />
                  <Label
                    htmlFor={tType}
                    className={cn(
                      'rounded-app flex cursor-pointer flex-col items-center gap-2 border p-3 transition-all duration-200',
                      type === tType
                        ? 'bg-warning/20 border-warning text-warning'
                        : 'border-white/5 bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/70',
                    )}
                  >
                    {getTypeIcon(tType)}
                    <span className="text-[10px] font-black tracking-wider uppercase">
                      {t(`types.${tType}`)}
                    </span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="message"
              className="text-[10px] font-black tracking-widest text-white/40 uppercase"
            >
              {t('message_label')}
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t('message_placeholder')}
              className="rounded-app focus:border-warning/50 h-32 w-full resize-none border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-white transition-all outline-none"
              disabled={isSubmitting}
            />
          </div>

          <Turnstile
            ref={turnstileRef}
            onSuccess={setTurnstileToken}
            onError={() => toast.error(t('turnstile_error'))}
            onExpire={() => setTurnstileToken('')}
          />

          <Button type="submit" disabled={isSubmitting || !message.trim()}>
            {isSubmitting ? (
              commonT('loading')
            ) : (
              <>
                <Send className="h-4 w-4" />
                {t('submit')}
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
