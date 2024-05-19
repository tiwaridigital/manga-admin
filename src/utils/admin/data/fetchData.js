import {
  bunnyCDNUpload,
  cloudFlareR2,
  convertImage,
  freeImageHost,
  imageUpload,
  imgBBUpload,
} from '@/utils/imageUpload';
import axios from 'axios';
import handleInterruptedUpload from '@/utils/admin/data/handleInterruptedUpload';

const { Manga, MangaType } = require('manga-lib');
const FormData = require('form-data');

export const fetchData = async (src, url, isIncomplete = false) => {
  if (src === 'mangadex') {
    try {
      // Create a new instance of the manga site, MangaType.NETTRUYEN is currently support for https://www.nettruyenplus.com/
      const manga = new Manga().build(MangaType.MANGADEX);

      // Retrieve the manga details
      const detail_manga = await manga.getDetailManga(
        // '05bd710c-d94a-45eb-be99-2109d58f1006'
        url,
      );

      // get all chapters data
      const chapterData = await Promise.all(
        detail_manga.chapters.map(async (chapter) => {
          // Introduce a delay of 1 second between each iteration
          await new Promise((resolve) => setTimeout(resolve, 3000));
          const data = await manga.getDataChapter(chapter.path);
          return data;
        }),
      );

      return { detail_manga, chapterData };
    } catch (err) {
      throw new Error(`An error occurred while fetching from Mangadex ${err}`);
    }
  } else if (src === 'asuratoon') {
    /*
     * used when upload is interrupted then
     * we can track at which idx it stopped to resume from there
     */
    let chapterIdx = 0;

    const imagesArr = [];
    let detail_manga;
    const manga = new Manga().build(MangaType.ASURASCANS);

    try {
      // Retrieve the manga details
      detail_manga = await manga.getDetailManga(url);
      console.log('detail_manga', detail_manga);
      // get all chapters data
      const chapterData = await Promise.all(
        detail_manga.chapters.map(async (chapter) => {
          const data = await manga.getDataChapter(chapter.url);
          return data.chapter_data.filter(
            (x) =>
              x.src_origin !==
              'https://www.asurascans.com/wp-content/uploads/2021/04/page100-10.jpg',
          );
        }),
      );

      console.log('chapterDate retuned now uploading');
      // const imagesArr = [];
      /*
       * Upload Images to imgBB or Any Other Host
       */
      // chapterIdx = isIncomplete ? startIdx : 0; // if upload is incomplete => start from the completed chapters Index
      // let chapterIdx = 0;
      for (const chapters of chapterData) {
        let arr = [];
        console.log('inside 1st for of', new Date());
        let innerChapterIdx = 0;
        await new Promise((resolve) => setTimeout(resolve, 2000));
        for (const chapter of chapters) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          const fileSplit = chapter.src_origin.split('.');
          const fileExtension = fileSplit[fileSplit.length - 1];
          //convert webp images to jpg before uploading only in case of imgur => handle it later

          console.log('uploading image', new Date());
          // const image = await imgBBUpload(chapter.src_origin);
          const imageHost = 'imgBB'; // Supported Hosts: imgBB, cloudFlare, bunnyCDN
          const image = await handleImageHost(
            `${chapter.src_origin}`,
            `${detail_manga.title}/chapter-${chapterIdx}/${innerChapterIdx}.${fileExtension}`,
            imageHost,
          );
          console.log('image', image);

          const arrObj = {
            id: chapterIdx,
            src_origin:
              imageHost === 'imgBB'
                ? image.data.url
                : imageHost === 'cloudFlare'
                  ? `https://gpfasts.xyz/${detail_manga.title}/chapter-${chapterIdx}/${innerChapterIdx}.${fileExtension}`
                  : imageHost === 'freeImageHost'
                    ? image.image.url
                    : 'null',
            // src_origin: `https://mangu.b-cdn.net/${detail_manga.title}/chapter-${chapterIdx}/${innerChapterIdx}.${fileExtension}`,
          };

          // if upload is interrupted then we will use this object to delete the images
          if (imageHost === 'imgBB') {
            arrObj.delete_url = image.data.delete_url;
          }

          arr.push(arrObj);
          innerChapterIdx += 1;
        }
        console.log('arr', arr);
        imagesArr.push(arr);
        chapterIdx += 1;
      }

      console.log('imagesArr', imagesArr);

      return { detail_manga, chapterData, chapterImages: imagesArr };
    } catch (err) {
      console.log('An error occurred while fetching from Asuratoon', err);
      console.log('throw block stoppedChapterIdx', chapterIdx);
      handleInterruptedUpload(imagesArr, detail_manga, chapterIdx, '', url);
    }
  } else if (src === 'nettruyenus') {
    // try {
    // Create a new instance of the manga site, MangaType.NETTRUYEN is currently support for https://www.nettruyenplus.com/
    const manga = new Manga().build(MangaType.NETTRUYEN);

    // Get list latest manga
    // const latest = await manga.getListLatestUpdate();
    // Retrieve the manga details
    const detail_manga = await manga.getDetailManga(
      // '71a621f8-c2bc-496e-aa34-f4b91e9874ac'
      'https://www.nettruyenus.com/truyen-tranh/the-reincarnation-magician-of-the-inferior-eyes-215350',
    );

    console.log('detail_manga', detail_manga);

    // get all chapters data
    const chapterData = await Promise.all(
      detail_manga.chapters.slice(0, 1).map(async (chapter) => {
        const data = await manga.getDataChapter(chapter.url);
        return data;
      }),
    );

    return { detail_manga, chapterData };
    // } catch (err) {
    //   throw new Error(`An error occurred while fetching from Mangadex ${err}`)
    // }
  }
};

const handleImageHost = async (srcImgurl, fileName, imgHost) => {
  console.log('handleImageHost called');
  switch (imgHost) {
    case 'imgBB':
      return await imgBBUpload(srcImgurl);
    case 'cloudFlare':
      // Convert Image to Webp in case of cloudflare
      return await cloudFlareR2(fileName, srcImgurl, true);
    case 'freeImageHost':
      return await freeImageHost(srcImgurl);

    default:
      console.error('Please Provide Image Host');
      return null;
  }
};
