const { Manga, MangaType } = require('manga-lib')
const FormData = require('form-data')
import axios from 'axios'

export const getMangaDex = async () => {
  // Create a new instance of the manga site, MangaType.NETTRUYEN is currently support for https://www.nettruyenplus.com/
  const manga = new Manga().build(MangaType.MANGADEX)

  // Retrieve the manga details
  const detail_manga = await manga.getDetailManga(
    // '71a621f8-c2bc-496e-aa34-f4b91e9874ac'
    '05bd710c-d94a-45eb-be99-2109d58f1006'
  )

  // get all chapters data
  const chapterData = await Promise.all(
    detail_manga.chapters.slice(0, 1).map(async (chapter) => {
      const data = await manga.getDataChapter(chapter.path)
      return data
    })
  )

  // Upload Images to Imgur

  // chapterData[0].chapter_data.map((chapter, idx) => {
  //   console.log('uploadImage called')
  //   let data = new FormData()
  //   data.append(
  //     'image',
  //     chapter.src_origin
  //     //   'https://uploads.mangadex.org/data/04e12b8f9dcf8a68bec3f61633bfdef0/z1-aa3688f681533e9fa53ede12bb13da0d53d87ea4c7b0232bdc21cfccf83888b5.jpg'
  //   )
  //   data.append('type', 'url')
  //   data.append('name', `manubook ${idx + 1}.webp`)
  //   data.append('title', `Manu ${idx + 1}`)
  //   data.append('description', 'This is an macbook air m1 image.')

  //   let config = {
  //     method: 'post',
  //     maxBodyLength: Infinity,
  //     url: 'https://api.imgur.com/3/upload',
  //     headers: {
  //       Authorization: 'Bearer 80a8d3e2afa3486e87d47ed2fecdde4f7c7e4218',
  //     },
  //     data: data,
  //   }

  //   axios
  //     .request(config)
  //     .then((response) => {
  //       console.log('response')
  //       console.log(JSON.stringify(response.data))
  //     })
  //     .catch((error) => {
  //       console.log('error')
  //       console.log(error)
  //     })
  // })

  // Get data chapter
  //   const data_chapter = await manga.getDataChapter(
  //     '7d3d9ec6-f3cd-4a81-bbdf-2abde7838bfb'
  //   )
  //   return data_chapter
  // return chapters

  return { detail_manga, chapterData }
}
