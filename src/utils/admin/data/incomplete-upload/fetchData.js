import { cloudFlareR2, freeImageHost, imgBBUpload } from '@/utils/imageUpload';

const { Manga, MangaType } = require('manga-lib');
import handleInterruptedUpload from '@/utils/admin/data/handleInterruptedUpload';
export const inCompleteUploadFetchData = async (src, url, mangaResult) => {
  // mangaResult = current incompleted manga which we are uploading
  if (src === 'asuratoon') {
    /*
     * used when upload is interrupted then
     * we can track at which idx it stopped to resume from there
     */
    let chapterIdx;

    const imagesArr = [];
    let detail_manga, title;
    const manga = new Manga().build(MangaType.ASURASCANS);

    try {
      // Retrieve the manga details
      detail_manga = await manga.getDetailManga(url);
      console.log('detail_manga', detail_manga);
      title = detail_manga.title;
      // get all chapters data
      const chapterData = await Promise.all(
        detail_manga.chapters
          .slice(mangaResult.completedChapters)
          .map(async (chapter) => {
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
      chapterIdx = mangaResult.completedChapters; // if upload is incomplete => start from the completed chapters Index
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
                  ? `https://anasset.xyz/anstrmx/${detail_manga.title}/chapter-${chapterIdx}/${innerChapterIdx}.${fileExtension}`
                  : imageHost === 'freeImageHost'
                    ? image.image.url
                    : 'null',
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
      console.log('catch block', chapterIdx);
      handleInterruptedUpload(
        imagesArr,
        detail_manga,
        chapterIdx,
        'incomplete-upload',
        mangaResult,
      );
    }
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
