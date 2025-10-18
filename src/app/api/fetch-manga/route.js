import { MANGA } from '@consumet/extensions';

export async function POST(req) {
  const body = await req.json();
  const { providerName, mangaId, fetchPopular, fetchChapters = true } = body;

  try {
    const manga = new MANGA[providerName]();
    let popularManga = [];

    if (fetchPopular) {
      const popularMangaResults = await manga.fetchPopular();
    }

    const mangaInfo = await manga.fetchMangaInfo(mangaId);
    let chapterDetail = {};
    let chapterDetailResults = [];

    if (fetchChapters) {
      chapterDetailResults = await Promise.allSettled(
        mangaInfo.chapters.map((chapter) =>
          manga.fetchChapterPages(chapter.id),
        ),
      );

      chapterDetail = chapterDetailResults.map((result) =>
        result.status === 'fulfilled' ? result.value : [],
      );
    }

    return Response.json({ mangaInfo, chapterDetail });
  } catch (error) {
    console.error('Error fetching manga:', error);
    return Response.json(
      { error: 'Failed to fetch manga details' },
      { status: 500 },
    );
  }
}
