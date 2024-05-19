'use client';
import Layout from '@/app/layout/Layout';
import ContentWrapper from '@/components/ContentWrapper';
import { Avatar, Button, Input, Spinner, Textarea } from '@nextui-org/react';
import React, { useState } from 'react';
import { sanityClient } from '../../../../../sanityClient';
import ProgressBar from '@/components/ProgressBar';
import { slugify } from '@/utils/helpers';

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
    const query = `*[_type == "incompleteManga" && id == "${mangaId}"]`;
    const data = await sanityClient.fetch(query);
    setManga(data[0]);
    console.log('manga', manga);
    setLoading(false);
  };

  const handleChapterInsertion = async () => {
    const parsedArray = eval(`(${chapterArr})`);
    console.log('parsedArray', parsedArray);
    /*
     * 1 => create another chapters in chapters field
     * 2 => update no of comppletedChapters in main manga using id
     */
    let idx = 0;
    for (const chapter of parsedArray) {
      console.log('idx', idx);

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
          }`
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
          completedChapters: manga.completedChapters + idx + 1,
        })
        .commit();
      console.log('manga', mangaUpdate);
      idx++;
      setChapterArr((prev) => [...prev]);
      setForceReRender((prevState) => !prevState);
    }
  };

  console.log('mangaId', manga);
  console.log('chapterNumber', chapterNumber);

  return (
    <Layout>
      <ContentWrapper maxWidth={800}>
        <h1 className="text-center text-[28px] mt-[4] font-semibold">
          Manual Chapter Add to Sanity
        </h1>

        <div className="mt-12 flex gap-12 w-full">
          <div className="flex flex-col gap-6 w-[40%]">
            <Input
              type="text"
              size="sm"
              placeholder="Enter Manga ID... (manga.id)"
              onChange={(e) => handleMangaUrlChange(e)}
            />
            <Button onClick={getManga}>Get Manga Details</Button>
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

            <Button onClick={handleChapterInsertion}>Insert Chapter</Button>
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
                        name={manga.completedChapters.toString()}
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
                        name={manga.totalChapters.toString()}
                      />
                    </p>
                  </div>

                  {/* Progress  */}
                  <ProgressBar />
                  {/* Progress  */}
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
