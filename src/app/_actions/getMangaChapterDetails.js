'use server';
const { Manga, MangaType } = require('manga-lib');

const getMangaChapterDetails = async (chapterUrl) => {
  const manga = new Manga().build(MangaType.ASURASCANS);
  return await manga.getDataChapter(chapterUrl);
};

export default getMangaChapterDetails;
