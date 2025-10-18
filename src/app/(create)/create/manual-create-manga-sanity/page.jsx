'use client';
import Layout from '@/app/layout/Layout';
import ContentWrapper from '@/components/ContentWrapper';
import { Avatar, Button, Input, Spinner, Textarea } from '@nextui-org/react';
import React, { useState } from 'react';
import { sanityClient } from '../../../../../sanityClient';
import ProgressBar from '@/components/ProgressBar';
import { slugify } from '@/utils/helpers';
import toastify from '@/helpers/toastify';
import { ToastContainer } from 'react-toastify';
import axios from 'axios';
import { uuid } from '@sanity/uuid';

const Page = () => {
  const [mangaId, setMangaId] = useState('');
  const [manga, setManga] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chapterArr, setChapterArr] = useState(null);
  const [chapterNumber, setChapterNumber] = useState(0);
  const [forceReRender, setForceReRender] = useState(false);

  const handleMangaUrlChange = async (e) => {
    setMangaId(e.target.value);
  };

  const getManga = async () => {
    setLoading(true);
    console.log('getManga');
    const { data } = await axios.post('/api/fetch-manga', {
      providerName: 'MangaDex',
      mangaId: mangaId,
      fetchChapters: false,
    });
    setManga(data);
    setLoading(false);
    return data;
  };

  const handleMangaCreation = async () => {
    const { mangaInfo: manga } = await getManga();
    console.log('mamga', manga);

    const sanityObj = {
      _type: 'incompleteManga',
      id: uuid(),
      title: getAutoTitle(manga.altTitles || manga.title || ''),
      alternativeName: getAutoTitle(manga.altTitles),
      artist: manga.artist,
      author: manga.author,
      coverImage: manga.coverImage || manga.image,
      genres: manga.genres,
      status: manga.status,
      description: manga.description?.en || manga.description || '',
      src: 'asuratoon',
      slug: slugify(manga.title || manga.title?.en || manga.title?.jp || ''),
      chapters: manga?.chapters,
      rating: manga?.rating,
      dates: manga?.dates,
      totalChapters: manga.chapters.length,
      srcUrl: manga.id,
      isMovedToHasura: false,
      isPublished: true,
    };

    console.log('sanityObj', sanityObj);
    const sanityManga = await sanityClient.create(sanityObj);
    console.log('sanityManga', sanityManga);
    toastify('success', 'Manga Created in Sanity');
  };

  const getAutoTitle = (altTitles = []) => {
    if (!Array.isArray(altTitles) || altTitles.length === 0) return null;

    // Extract all possible titles
    const englishTitles = altTitles
      .filter((t) => t.en)
      .map((t) => t.en.trim())
      .filter(Boolean);

    const japaneseTitle = altTitles.find((t) => t.ja)?.ja?.trim() || null;

    // Priority:
    // 1️⃣ First English title (main)
    // 2️⃣ Any other English title
    // 3️⃣ Japanese title
    return englishTitles[0] || englishTitles[1] || japaneseTitle || null;
  };

  const handleChapterInsertion = async () => {
    const parsedArray = eval(`(${chapterArr})`);
    console.log('parsedArray', parsedArray);
    /*
     * 1 => create another chapters in chapters field
     * 2 => update no of comppletedChapters in main manga using id
     */
    let idx = 0;
    setLoading(true);
    for (const chapter of parsedArray) {
      console.log('idx', idx);
      // console.log('chapter', chapter);
      if (Array.isArray(chapter)) {
        // It's a 2d Array
        console.log('2d array');
        const chapterObject = {
          _type: 'chapters',
          title: `${manga.title} Chapter ${
            manga.totalChapters - manga.completedChapters - idx
          }`,
          data: chapter.map((x, idx) => ({
            _key: idx.toString(),
            id: idx.toString(),
            src_origin: x.src_origin,
            delete_url: x.delete_url,
          })),
          slug: slugify(
            `${manga.slug} chapter ${
              manga.totalChapters - manga.completedChapters - idx
            }`,
          ),
          url: {
            _ref: manga._id,
            _type: 'reference',
            _weak: true,
          },
          hasNextEp:
            manga.totalChapters - manga.completedChapters > 1 ? true : false,
        };

        // const createChapters = await sanityClient.create(chapterObject);
        // console.log('createdChapter', createChapters);

        // const mangaUpdate = await sanityClient
        //   .patch(manga._id)
        //   .set({
        //     completedChapters: manga.completedChapters + idx + 1,
        //   })
        //   .commit();
        // console.log('manga', mangaUpdate);
        // idx++;
        // setChapterArr((prev) => [...prev]);
        // setForceReRender((prevState) => !prevState);

        toastify('success', `Chapter ${idx} Created`);
      } else {
        console.log('1d array');
        const chapterObject = {
          _type: 'chapters',
          title: `${manga.title} Chapter ${
            manga.totalChapters - manga.completedChapters
          }`,
          data: parsedArray.map((x, idx) => ({
            _key: idx.toString(),
            id: idx.toString(),
            src_origin: x.src_origin,
            delete_url: x.delete_url,
          })),
          slug: slugify(
            `${manga.slug} chapter ${
              manga.totalChapters - manga.completedChapters
            }`,
          ),
          url: {
            _ref: manga._id,
            _type: 'reference',
            _weak: true,
          },
          hasNextEp:
            manga.totalChapters - manga.completedChapters > 1 ? true : false,
        };

        const createChapters = await sanityClient.create(chapterObject);
        console.log('createdChapter', createChapters);

        const mangaUpdate = await sanityClient
          .patch(manga._id)
          .set({
            completedChapters: manga.completedChapters + 1,
          })
          .commit();
        console.log('manga', mangaUpdate);
        toastify('success', `Chapter ${manga.completedChapters + 1} Created`);
        break;
      }
    }
    setLoading(false);

    // for (const chapter of parsedArray) {
    //   console.log('1d array');
    //   if (!Array.isArray(chapter)) {
    //     const chapterObject = {
    //       _type: 'chapters',
    //       title: `${manga.title} Chapter ${
    //         manga.totalChapters - manga.completedChapters
    //       }`,
    //       data: parsedArray.map((x, idx) => ({
    //         _key: idx.toString(),
    //         id: idx.toString(),
    //         src_origin: x.src_origin,
    //         delete_url: x.delete_url,
    //       })),
    //       slug: slugify(
    //         `${manga.slug} chapter ${
    //           manga.totalChapters - manga.completedChapters
    //         }`
    //       ),
    //       url: {
    //         _ref: manga._id,
    //         _type: 'reference',
    //         _weak: true,
    //       },
    //       hasNextEp:
    //         manga.totalChapters - manga.completedChapters > 1 ? true : false,
    //     };

    //     const createChapters = await sanityClient.create(chapterObject);
    //     console.log('createdChapter', createChapters);

    //     const mangaUpdate = await sanityClient
    //       .patch(manga._id)
    //       .set({
    //         completedChapters: manga.completedChapters + 1,
    //       })
    //       .commit();
    //     console.log('manga', mangaUpdate);
    //   }
    // }
  };

  console.log('mangaId', manga);
  console.log('chapterNumber', chapterNumber);

  return (
    <Layout>
      <ContentWrapper>
        <ToastContainer />
        <div className="flex justify-center">
          <h1 className="text-[20px] mt-2 text-center sm:text-[30px] font-sans font-bold tracking-tight inline from-[#f89e00] to-[#da2f68] bg-clip-text text-transparent bg-gradient-to-b">
            Manually Create Manga in Sanity
          </h1>
        </div>

        <div className="mt-4 flex gap-12 w-full">
          <div className="flex flex-col gap-6 w-[40%]">
            <Input
              type="text"
              size="sm"
              placeholder="Enter Manga ID... (manga.id) from src like MangaDex"
              onChange={(e) => handleMangaUrlChange(e)}
            />
            <Button onPress={handleMangaCreation}>Get Manga Details</Button>
            <Input
              size="sm"
              type="number"
              placeholder="Enter Chapter Number: Total Chapters - Completed Chapters"
              value={chapterNumber}
              onChange={(e) => setChapterNumber(e.target.value)}
            />

            <Textarea
              onChange={(e) => {
                setChapterArr(e.target.value);
              }}
              // label="Description"
              placeholder="Enter Chapter Array"
              // className="max-w-xs"
            />

            <Button onClick={handleChapterInsertion} isLoading={loading}>
              Insert Chapter
            </Button>
          </div>

          <div className="flex justify-center">
            {loading ? (
              <div className="flex justify-center w-full items-center">
                <Spinner size="lg" />
              </div>
            ) : (
              manga && (
                <div className="flex flex-col leading-10">
                  <h1 className="font-seimbold text-[22px]">{manga.title}</h1>
                  <p>
                    <strong>ID:</strong> {manga.id}
                  </p>
                  <h6>
                    <strong>URL:</strong> {manga.srcUrl}
                  </h6>
                  <div className="flex justify-between gap-8">
                    <p className="flex flex-col items-center justify-center font-semibold">
                      Completed Chapters
                      <Avatar
                        isBordered
                        size="lg"
                        classNames={{
                          base: 'bg-gradient-to-br from-[#FFB457] to-[#FF705B] shadow-lg',
                          name: 'text-white text-[18px] font-bold',
                        }}
                        name={manga?.completedChapters?.toString()}
                      />
                    </p>
                    <p className="flex flex-col items-center justify-center font-semibold">
                      Total Chapters
                      <Avatar
                        isBordered
                        size="lg"
                        classNames={{
                          base: 'bg-gradient-to-br from-[#fd1d1d] to-[#fcb045] shadow-lg',
                          name: 'text-white text-[18px] font-bold',
                        }}
                        name={manga?.totalChapters?.toString()}
                      />
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </ContentWrapper>
    </Layout>
  );
};

export default Page;
