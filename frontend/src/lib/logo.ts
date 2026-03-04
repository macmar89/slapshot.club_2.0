export const getLogoUrl = (path: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_UPLOAD_URL;
  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_UPLOAD_URL is not defined');
  }
  return `${baseUrl}${path}`;
};
