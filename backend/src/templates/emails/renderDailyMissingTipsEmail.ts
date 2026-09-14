import { emailTemplate } from './emailTemplate.js';
import skTranslations from '../../locates/sk.json' with { type: 'json' };
import enTranslations from '../../locates/en.json' with { type: 'json' };
import csTranslations from '../../locates/cs.json' with { type: 'json' };

const getTranslations = (lang?: string) => {
  if (lang === 'en') return enTranslations;
  if (lang === 'cs') return csTranslations;
  return skTranslations;
};

export const renderDailyMissingTipsEmail = ({
  missingTipsCount,
  locale,
}: {
  missingTipsCount: number;
  locale?: string;
}) => {
  const lang = locale || 'sk';
  const url = `${process.env.FRONTEND_URL}/${lang}/arena/missing-tips`;

  const translations = getTranslations(lang);
  const emailT = (translations as any).Email.daily_missing_tips;

  const t = (str: string, values: { [key: string]: string | number }) => {
    let result = str;
    Object.entries(values).forEach(([key, value]) => {
      result = result.replace(new RegExp(`{${key}}`, 'g'), String(value));
    });
    return result;
  };

  const content = `
    <h1 class="title">${emailT.title}</h1>
    <p class="message">
      ${t(emailT.message, { missingTipsCount })}
    </p>
    <a href="${url}" class="button">${emailT.button}</a>
    <div class="footer">
      ${emailT.footer}
    </div>
  `;

  return emailTemplate(content);
};
