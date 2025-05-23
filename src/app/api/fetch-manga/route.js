import { MANGA } from '@consumet/extensions';

export async function POST(req) {
  const body = await req.json();
  const { providerName, mangaId } = body;

  try {
    const manga = new MANGA[providerName]();
    const mangaInfo = await manga.fetchMangaInfo(mangaId);
    const chapterDetailResults = await Promise.allSettled(
      mangaInfo.chapters.map((chapter) => manga.fetchChapterPages(chapter.id)),
    );

    const chapterDetail = chapterDetailResults.map((result) =>
      result.status === 'fulfilled' ? result.value : [],
    );

    return Response.json({ mangaInfo, chapterDetail });
  } catch (error) {
    console.error('Error fetching manga:', error);
    return Response.json(
      { error: 'Failed to fetch manga details' },
      { status: 500 },
    );
  }
}
