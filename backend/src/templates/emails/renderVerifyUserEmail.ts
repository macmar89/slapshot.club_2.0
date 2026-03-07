import { emailTemplate } from './emailTemplate.js';
import skTranslations from '../../locates/sk.json' with { type: 'json' };
import enTranslations from '../../locates/en.json' with { type: 'json' };
import csTranslations from '../../locates/cs.json' with { type: 'json' };

interface User {
  username: string;
  email: string;
  preferredLanguage?: string;
  verifiedAt?: string | null;
}

const getTranslations = (lang?: string) => {
  if (lang === 'en') return enTranslations;
  if (lang === 'cs') return csTranslations;
  return skTranslations;
};

export const renderVerificationEmail = ({ token, user }: { token: string; user: User }) => {
  const lang = user.preferredLanguage || 'sk';
  const url = `${process.env.FRONTEND_URL}/verify?token=${token}&email=${encodeURIComponent(user.email)}&locale=${lang}`;

  const translations = getTranslations(lang);
  const emailT = (translations as any).Email.verification;

  // Simple template helper to replace {username} in strings
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
