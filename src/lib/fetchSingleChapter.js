import SINGLE_CHAPTER_QUERY from '@/graphql/queries/SingleChapterQuery.gql';
import client from '../../client';

const fetchSingleChapter = async (slug) => {
  console.log('mangaId', slug);
  try {
    const result = await client.query({
      query: SINGLE_CHAPTER_QUERY,
      variables: {
        slug,
      },
    });
    return result.data.chapters;
  } catch (err) {
    console.log('Error Fetching Manga Chapters: ', err);
  }
};

export default fetchSingleChapter;
