const { Manga, MangaType } = require('manga-lib')

export const getData = async () => {
  // Create a new instance of the manga site, MangaType.NETTRUYEN is currently support for https://www.nettruyenplus.com/
  const manga = new Manga().build(MangaType.ASURASCANS)

  // Create a new instance with custom url
  // const manga = new Manga().build(MangaType.NETTRUYEN, {
  //   baseUrl: 'https://www.nettruyenus.com/',
  // })

  // Get list latest manga
  // const latest = await manga.getListLatestUpdate()

  // Retrieve the manga details
  // const detail_manga = await manga
  //   .getDetailManga
  //   // 'https://toonily.com/webtoon/study-group/'
  //   // 'https://www.nettruyenus.com/truyen-tranh/giai-thoat-99-nu-chinh-o-mat-the-413050'
  //   // 'https://asuratoon.com/manga/2423162651-surviving-the-game-as-a-barbarian/'
  //   // 'https://asuratoon.com/manga/2423162651-villain-to-kill/'
  //   ()

  // get all chapter info
  // const chapters = detail_manga.chapters.map(async (chapter) => {
  //   console.log('map')
  //   const url = `https://toonily.com${chapter.path}`
  //   const data = await manga.getDataChapter(url)
  //   // console.log('data', data)
  //   // chaptersArr.push(data)
  //   return data
  // })
  // // console.log('chaptersArr', chaptersArr)
  // // console.log('chapters', chapters.length)
  // Promise.all(chapters).then((res) => console.log('detail', res))
  // const chapterData = await Promise.all(
  //   detail_manga.chapters.slice(0, 1).map(async (chapter) => {
  //     const url = `https://toonily.com${chapter.path}`
  //     const data = await manga.getDataChapter(url)
  //     return data
  //   })
  // )
  // Get data chapter
  const data_chapter = await manga.getDataChapter(
    'https://asuratoon.com/9205053481-villain-to-kill-chapter-100/'
  )
  return data_chapter

  // return chapters
  // return detail_manga
}
