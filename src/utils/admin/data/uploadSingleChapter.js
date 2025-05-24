'use server';
import { handleImageHost } from './fetchData';

const uploadSingleChapter = async (
  detail_manga,
  chapterData,
  chapterNumber,
) => {
  console.log('uploadSingleChapter called');

  const imagesArr = [];

  for (const chapter of chapterData.chapter_data) {
    const idx = chapterData.chapter_data.indexOf(chapter);
    console.log('idx', idx);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const fileSplit = chapter.src_origin.split('.');
    const fileExtension = fileSplit[fileSplit.length - 1];
    //convert webp images to jpg before uploading only in case of imgur => handle it later

    console.log('uploading image', new Date());
    const imageHost = 'imgBB'; // Supported Hosts: imgBB, cloudFlare, bunnyCDN
    const image = await handleImageHost(
      `${chapter.src_origin}`,
      `${detail_manga.title}/chapter-${chapterNumber}/${idx}.${fileExtension}`,
      imageHost,
    );
    console.log('image', image);

    const arrObj = {
      id: chapterNumber,
      src_origin:
        imageHost === 'imgBB'
          ? image.data.url
          : imageHost === 'cloudFlare'
            ? `https://anasset.xyz/anstrmx/${detail_manga.title}/chapter-${chapterNumber}/${idx}.${fileExtension}`
            : imageHost === 'freeImageHost'
              ? image.image.url
              : 'null',
      // src_origin: `https://mangu.b-cdn.net/${detail_manga.title}/chapter-${chapterIdx}/${innerChapterIdx}.${fileExtension}`,
    };

    // if upload is interrupted then we will use this object to delete the images
    if (imageHost === 'imgBB') {
      arrObj.delete_url = image.data.delete_url;
    }

    imagesArr.push(arrObj);
  }
  console.log('imagesArr', imagesArr);
  return imagesArr;
};

export default uploadSingleChapter;
