import ALL_MANGA_QUERY from '@/graphql/client/manga/AllMangaQuery.gql'
import client from '../../../client'

const fetchAllMangas = async () => {
  try {
    const result = await client.query({
      query: ALL_MANGA_QUERY,
    })
    return result.data.singleMang
  } catch (err) {
    throw new Error('Error Fetching All Mangas From DB', err)
  }
}

export default fetchAllMangas
