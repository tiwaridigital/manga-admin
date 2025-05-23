import { fetchDataServerAction } from '@/app/_actions/fetchDataFromServer';
import SINGLE_MANGA_MUTATE from '@/graphql/mutations/SingleMangaMutation.gql';
import SINGLE_CHAPTER_MUTATE from '@/graphql/mutations/SingleChapterMutation.gql';
import COMPLETE_CHAPTER_MUTATION from '@/graphql/mutations/chapter_tracker/completeChapterMutation.gql';
import INCOMPLETE_CHAPTER_MUTATION from '@/graphql/mutations/chapter_tracker/inCompleteChapterMutation.gql';
import client from '../../../client';
import { slugify } from '@/utils/helpers';

export async function createMangaFromUrl(selectedSrc, srcUrl) {
  const data = await fetchDataServerAction(selectedSrc, srcUrl);
  console.log('data', data);

  const {
    title,
    alterNativeName,
    artist,
    author,
    coverImage,
    status,
    description = {},
    rate: rating,
    uploadedDate,
    updatedDate,
  } = data.detail_manga;

  const slug = slugify(title);
  const genres = data.detail_manga.genres.map((x) => x.name);
  const dates = { uploadedDate, updatedDate };

  let chapters = data.detail_manga.chapters.map((x, idx) => ({
    title: x.title,
    slug: slugify(`${slug} chapter ${data.detail_manga.chapters.length - idx}`),
    last_update: x.last_update,
  }));

  const mangaResult = await client.mutate({
    mutation: SINGLE_MANGA_MUTATE,
    variables: {
      title,
      alternativeName: alterNativeName,
      artist,
      author,
      coverImage,
      genres,
      status,
      description: Object.keys(description).length === 0 ? '' : description?.en,
      src: selectedSrc,
      slug,
      chapters,
      rating,
      dates,
    },
  });

  console.log('mangaResult', mangaResult);

  // Create chapters
  let chaptersArr = data.detail_manga.chapters.map((x, idx) => ({
    title: x.title,
    url: mangaResult.data.insert_singleMang_one.id,
    chapter_data: data.chapterImages[idx],
    slug: slugify(
      `${mangaResult.data.insert_singleMang_one.slug} chapter ${
        data.detail_manga.chapters.length - idx
      }`,
    ),
    last_update: x.last_update,
  }));

  let count = 0;
  for (const x of chaptersArr) {
    const idx = chaptersArr.indexOf(x);
    await client.mutate({
      mutation: SINGLE_CHAPTER_MUTATE,
      variables: {
        title: x.title,
        url: x.url,
        data: x.chapter_data,
        slug: x.slug,
        hasNextEp: idx === 0 ? false : true,
        totalEpisodes: chaptersArr.length,
      },
    });
    count++;
  }

  // Chapter tracker
  if (count === chaptersArr.length) {
    await client.mutate({
      mutation: COMPLETE_CHAPTER_MUTATION,
      variables: { chapterId: mangaResult.data.insert_singleMang_one.id },
    });
  } else {
    await client.mutate({
      mutation: INCOMPLETE_CHAPTER_MUTATION,
      variables: { chapterId: mangaResult.data.insert_singleMang_one.id },
    });
  }
}
