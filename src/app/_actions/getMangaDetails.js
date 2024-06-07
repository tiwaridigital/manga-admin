'use server';
const { Manga, MangaType } = require('manga-lib');

const getMangaDetails = async (mangaUrl) => {
  const manga = new Manga().build(MangaType.ASURASCANS);

  // Retrieve the manga details
  const details = await manga.getDetailManga(mangaUrl);
  console.log('mangaDetails server', details);
  return details;
};

export default getMangaDetails;
