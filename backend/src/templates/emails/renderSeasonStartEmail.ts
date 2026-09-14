import { emailTemplate } from './emailTemplate.js';
import skTranslations from '../../locates/sk.json' with { type: 'json' };
import enTranslations from '../../locates/en.json' with { type: 'json' };
import csTranslations from '../../locates/cs.json' with { type: 'json' };

interface SeasonStartEmailData {
  user: {
    username: string;
    preferredLanguage?: string;
  };
}

const getTranslations = (lang?: string) => {
  if (lang === 'en') return enTranslations;
  if (lang === 'cs') return csTranslations;
  return skTranslations;
};

export const renderSeasonStartEmail = ({ user }: SeasonStartEmailData) => {
  const lang = user.preferredLanguage || 'sk';
  const url = `${process.env.FRONTEND_URL}/${lang}/arena`;

  const translations = getTranslations(lang);
  const emailT = (translations as any).Email.seasonStart;

  const t = (str: string, values: { [key: string]: string }) => {
    let result = str;
    Object.entries(values).forEach(([key, value]) => {
      result = result.replace(new RegExp(`{${key}}`, 'g'), value);
    });
    return result;
  };

  const content = `
    <h1 class="title">${t(emailT.title, { username: user.username })}</h1>
    <p class="message">
      ${emailT.message}
    </p>
    <a href="${url}" class="button">${emailT.button}</a>
    <div class="footer">
      ${emailT.footer}
    </div>
  `;

  return emailTemplate(content);
};
