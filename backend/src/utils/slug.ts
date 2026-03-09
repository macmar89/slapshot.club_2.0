import slugify from '@sindresorhus/slugify';

export const generateSlug = (name: string, suffix?: string) => {
  const base = slugify(name, {
    separator: '-',
    lowercase: true,
    customReplacements: [
      ['ä', 'a'],
      ['Ä', 'a'],
      ['ľ', 'l'],
      ['Ľ', 'l'],
      ['ĺ', 'l'],
      ['Ĺ', 'l'],
      ['ť', 't'],
      ['Ť', 't'],
      ['ř', 'r'],
      ['Ř', 'r'],
      ['ů', 'u'],
      ['Ů', 'u'],
      ['ě', 'e'],
      ['Ě', 'e'],
      ['ö', 'o'],
      ['Ö', 'o'],
      ['ü', 'u'],
      ['Ü', 'u'],
      ['ß', 'ss'],
    ],
  });

  return suffix ? `${base}-${suffix}` : base;
};
