'use client';
import { Button, ButtonGroup, Image, Spinner } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import GradientButton, {
  GreenGradientButton,
  PurpleGradientButton,
} from '../Buttons';
import axios from 'axios';
import { inCompleteUploadFetchDataFromServer } from '@/app/_actions/inCompleteUploadFetchDataFromServer';
import { slugify } from '@/utils/helpers';

const InCompleteUpload = ({ incompleteMangas }) => {
  const [mangas, setMangas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMangas([...incompleteMangas]);
    setIsLoading(false);
  }, [incompleteMangas]);

  const handleIncompleteUpload = async () => {
    console.log('handleIncompleteUpload called');
    const res = await axios.post('/api/socket');
    console.log('response', res);
  };

  const handleMoveToHasura = () => {
    console.log('handleMove ');
  };

  const selectedSrc = 'asuratoon';
  const srcUrl =
    'https://asuratoon.com/manga/9260952888-the-genius-assassin-who-takes-it-all/';
  /*
   * First Fetch the URL from sanity
   * to know which chapter to start from
   */
  const fetchFromSanity = async () => {
    const id = 'hcPd9DU4IcfM8v35xRW8go';
    const query = `*[_type == "incompleteManga" && _id == "${id}"]`;
    const mangaResult = await sanityClient.fetch(query);
    console.log('manga result', mangaResult);
  };

  const handleDataFetching_Insertion = async (mangaResult) => {
    console.log('handleSources');
    /*
     * First Fetch The Manga Using fetchDataServerAction Function, which is a => Server Action
     * i.e. function based on 'use server' method -> where you can call other server functions
     * and then use those not directly supported server functions/methods -> indirectly
     */
    const data = await inCompleteUploadFetchDataFromServer(
      selectedSrc,
      // 'https://asuratoon.com/manga/6849480105-regressing-with-the-kings-power/'
      mangaResult.srcUrl,
      mangaResult
    );

    console.log('inCompleteUploadFetchDataFromServer completed');

    try {
      const createdChapters = await createChapters(
        data.detail_manga,
        mangaResult,
        data.chapterImages
      );
      console.log('createdChapters executed');
    } catch (err) {
      throw new Error(`Error Creating Single Manga to DB: ${err}`);
    }
  };

  const createChapters = async (detail_manga, mangaResult, chapterImages) => {
    console.log('createChapters called');
    console.log('mangaResult', mangaResult);
    console.log('detail_manga', detail_manga);
    /*
     * Create Chapter Now => After Manga is Created
     */
    let chaptersArr = detail_manga.chapters
      .slice(mangaResult.completedChapters)
      .map((x, idx) => {
        console.log('chaptersArr idx', idx);
        return {
          title: x.title,
          url: mangaResult._id,
          chapter_data: chapterImages[idx],
          slug: slugify(
            `${mangaResult.slug} chapter ${
              mangaResult.totalChapters - mangaResult.completedChapters - idx
            }`
          ),
          last_update: x.last_update,
        };
      });

    console.log('chaptersArr', chaptersArr);

    let count = 0;
    for (const x of chaptersArr) {
      const idx = chaptersArr.indexOf(x); // gets current idx
      console.log('idx', idx);
      const chapterObj = {
        _type: 'chapters',
        slug: slugify(
          `${mangaResult.title} Chapter ${
            mangaResult.totalChapters - mangaResult.completedChapters - idx
          }`
        ),
        data: x.chapter_data.map((xx, idx) => ({
          _key: idx.toString(),
          id: idx.toString(),
          src_origin: xx.src_origin,
          delete_url: xx.delete_url,
        })),
        title: `${mangaResult.title} Chapter ${
          mangaResult.totalChapters - mangaResult.completedChapters - idx
        }`,
        url: {
          _type: 'reference',
          _ref: mangaResult._id,
          _weak: true,
        },
        hasNextEp: true,
      };

      const chapterResult = await sanityClient.create(chapterObj);
      console.log('chapterResult', chapterResult);
      count++;
    }

    /*
     * Now Update Completed Chapters Count
     * in Manga
     */
    const mangaUpdated = await sanityClient
      .patch(mangaResult._id)
      .set({
        completedChapters: mangaResult.completedChapters + chaptersArr.length,
      })
      .commit();
  };

  return (
    <div className="flex flex-col gap-6 mt-[40px] items-center">
      {isLoading ? (
        <div className="h-[100vh] flex items-center">
          <Spinner color="primary" size="lg" />
        </div>
      ) : (
        mangas.map((manga) => (
          <div
            className="flex gap-4 w-1/2 shadow-lg rounded-lg p-2"
            key={manga._id}
          >
            <Image src={manga.coverImage} width={90} height={90} />
            <div className="flex flex-col justify-between items-baseline">
              <h2 className="text-[20px] font-semibold">{manga.title}</h2>
              <p>{manga.srcUrl}</p>
              <p>Total Episodes: {manga.totalChapters}</p>
              <p className="text-gray-400">
                Completed Episodes: {manga.completedChapters}
              </p>

              <div className="flex gap-6 items-center">
                <GreenGradientButton
                  btnText="Complete Chapters"
                  color="purple"
                  onclick={() => handleDataFetching_Insertion(manga)}
                />
                <GreenGradientButton btnText="Move to Hasura" color="teal" />
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default InCompleteUpload;
