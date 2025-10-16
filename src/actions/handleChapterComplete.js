'use server';
// Use this to resume chapter completion from source => MangaDex, MangaHere
import { cloudFlareR2, freeImageHost, imgBBUpload } from '@/utils/imageUpload';
import axios from 'axios';
import handleInterruptedUpload from '@/utils/admin/data/handleInterruptedUpload';
const isLocal = process.env.NODE_ENV === 'development';

const API_URL = isLocal ? 'http://localhost:3000' : 'http://localhost:3000';
const fetchMangaDetailslApiURL = API_URL + `/api/fetch-manga`;

export const handleChapterComplete = async (manga) => {
  console.log('handleChapterComplete', manga.srcUrl, fetchMangaDetailslApiURL);
  // check how many chapters are already completed
  const { data } = await axios.post(fetchMangaDetailslApiURL, {
    providerName: 'MangaDex',
    mangaId: manga.srcUrl,
  });
  let { mangaInfo: detail_manga, chapterDetail: chapterData } = data;
  console.log('mangaInfo', detail_manga, 'chapterData', chapterData);
  console.log(
    `Total chapters to process: ${chapterData?.length - manga.completedChapters || 0}`,
  );

  // resume from next chapter
  let chapterIdx = manga.completedChapters + 1; // if upload is incomplete => start from the completed chapters Index
  const imagesArr = [];

  try {
    for (const chapters of chapterData.slice(manga.completedChapters)) {
      // start from next completed chapter
      console.log('current chapter', chapterIdx, chapters);
      let arr = [];
      console.log('inside 1st for of', new Date());
      let innerChapterIdx = 0;
      await new Promise((resolve) => setTimeout(resolve, 200));
      for (const chapter of chapters) {
        console.log('innerChapterIdx', innerChapterIdx);
        await new Promise((resolve) => setTimeout(resolve, 500));
        const fileSplit = chapter.img.split('.');
        const fileExtension = 'webp' || fileSplit[fileSplit.length - 1];
        //convert webp images to jpg before uploading only in case of imgur => handle it later
        console.log('uploading image', new Date());
        // const image = await imgBBUpload(chapter.src_origin);
        const imageHost = 'cloudFlare'; // Supported Hosts: imgBB, cloudFlare, bunnyCDN
        const image = await handleImageHost(
          `${chapter.img}`,
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
                ? `https://anasset.xyz/anstrmx/${encodeURIComponent(
                    detail_manga.title,
                  )}/chapter-${chapterIdx}/${innerChapterIdx}.${fileExtension}`
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
      console.log(
        `Chapter ${chapterIdx} completed with ${arr.length}/${chapters.length} images uploaded`,
      );
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
      manga,
    );
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
