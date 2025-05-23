import { MANGA } from '@consumet/extensions';

export const fetchMangaAction = async (providerName, mangaId) => {
  try {
    const manga = new MANGA[providerName]();
    const mangaInfo = await manga.fetchMangaInfo(mangaId);
    const mangaChapters = mangaInfo.chapters;

    const chapterDetail = await Promise.allSettled(
      mangaChapters.map((chapter) => manga.fetchChapterPages(chapter.id)),
    );

    return { mangaInfo, chapterDetail };
  } catch (error) {
    console.error('Error fetching manga:', error);
    return { error: 'Failed to fetch manga details' };
  }
};
