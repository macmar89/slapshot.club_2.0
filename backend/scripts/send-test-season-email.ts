import 'dotenv/config';
import { renderSeasonStartEmail } from '../src/templates/emails/renderSeasonStartEmail.js';
import { emailService } from '../src/services/email.service.js';
import skTranslations from '../src/locates/sk.json' with { type: 'json' };
import enTranslations from '../src/locates/en.json' with { type: 'json' };
import csTranslations from '../src/locates/cs.json' with { type: 'json' };

const TEST_RECIPIENT = 'admin@slapshot.club';
const TEST_USERNAME = 'Marián';

const translationsByLocale = {
  sk: skTranslations,
  cs: csTranslations,
  en: enTranslations,
};

async function sendTestSeasonEmails() {
  for (const locale of Object.keys(translationsByLocale) as Array<keyof typeof translationsByLocale>) {
    const htmlContent = renderSeasonStartEmail({
      user: { username: TEST_USERNAME, preferredLanguage: locale },
    });
    const subject = `[TEST ${locale}] ${translationsByLocale[locale].Email.seasonStart.subject}`;

    console.log(`Sending ${locale} test email to ${TEST_RECIPIENT}...`);
    await emailService.sendEmail({ to: TEST_RECIPIENT, subject, htmlContent });
    console.log(`Sent ${locale} test email.`);
  }
}

sendTestSeasonEmails()
  .then(() => {
    console.log('Done.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to send test emails:', error);
    process.exit(1);
  });
