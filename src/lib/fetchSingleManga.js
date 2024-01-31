import Single_MANGA_QUERY from '@/graphql/queries/SingleMangaQuery.gql';
import client from '../../client';

const fetchSingleManga = async (slug) => {
  try {
    const result = await client.query({
      query: Single_MANGA_QUERY,
      variables: {
        slug,
      },
    });
    return result.data.singleMang;
  } catch (err) {
    console.log('Error Fetching Single Manga From DB', err);
  }
};

export default fetchSingleManga;
