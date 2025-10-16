'use server';
import { MANGA } from '@consumet/extensions';

const getMangaDetails = async (mangaUrl, providerName) => {
  const manga = new MANGA[providerName]();

  // Retrieve the manga details
  const details = await manga.fetchMangaInfo(mangaUrl);
  console.log('mangaDetails server', details);
  return details;
};

export default getMangaDetails;
