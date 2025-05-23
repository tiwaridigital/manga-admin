import client from '../../../client'
import SINGLE_MANGA_QUERY from '@/graphql/client/manga/SingleMangaQuery.gql'

const fetchSingleManga = async (slug) => {
  try {
    const result = await client.query({
      query: SINGLE_MANGA_QUERY,
      variables: {
        slug,
      },
    })

    return result.data.singleMang[0]
  } catch (err) {
    throw new Error('Error Fetching Single Manga From DB', err)
  }
}

export default fetchSingleManga
