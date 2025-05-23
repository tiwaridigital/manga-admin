import ALL_CHAPTERS_QUERY from '@/graphql/queries/AllChaptersQuery.gql';
import client from '../../client';

const fetchAllChapters = async (mangaId) => {
  console.log('mangaId', mangaId);
  try {
    const result = await client.query({
      query: ALL_CHAPTERS_QUERY,
      variables: {
        mangaId,
      },
    });
    return result.data;
  } catch (err) {
    console.log('Error Fetching Manga Chapters: ', err);
  }
};

export default fetchAllChapters;
