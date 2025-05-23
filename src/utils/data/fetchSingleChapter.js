import SINGLE_CHAPTER_QUERY from '@/graphql/admin/chapters/SingleChapterQuery.gql';
import client from '../../../client';

const fetchSingleChapter = async (slug) => {
  try {
    const result = await client.query({
      query: SINGLE_CHAPTER_QUERY,
      variables: {
        slug: slug,
      },
    });
    console.log('chapter', result);
    return result.data.chapters[0];
  } catch (err) {
    console.log('Error Fetching Single Chapter', err);
  }
};

export default fetchSingleChapter;
