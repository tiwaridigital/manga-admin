'use client';
import getMangaChapterDetails from '@/app/_actions/getMangaChapterDetails';
import uploadSingleChapter from '@/utils/admin/data/uploadSingleChapter';
import { Button, Input } from '@nextui-org/react';
import React, { useState } from 'react';
import client from '../../../../client';
import SINGLE_MANGA_QUERY from '@/graphql/queries/SingleMangaQuery.gql';
import SINGLE_CHAPTER_MUTATE from '@/graphql/mutations/SingleChapterMutation.gql';
import fetchSingleManga from '@/lib/fetchSingleManga';
import { slugify } from '@/utils/helpers';
import getMangaDetails from '@/app/_actions/getMangaDetails';

const ManualUploadChapterImages = () => {
  const [mangaUrl, setMangaUrl] = useState('');
  const [chapterUrl, setChapterUrl] = useState('');
  const [chapterNumber, setChapterNumber] = useState(null);

  const handleChapterCreation = async () => {
    console.log('handleChapterCreation called');
    const mangaDetails = await getMangaDetails(mangaUrl);
    console.log('mangaDetails', mangaDetails);
    const chapterDetails = await getMangaChapterDetails(chapterUrl);
    console.log('chapterDetails', chapterDetails);

    const uploadedChapter = await uploadSingleChapter(
      mangaDetails,
      chapterDetails,
      chapterNumber
    );

    let chaptersArr = uploadedChapter.map((x, idx) => {
      return {
        title: chapterDetails.title,
        url: mangaDetails.id,
        // chapter_data: data.chapterData[idx],
        chapter_data: uploadedChapter,
        slug: slugify(`${mangaDetails.title} chapter ${chapterNumber}`),
        last_update: x.last_update,
      };
    });

    const chapterResult = await client.mutate({
      mutation: SINGLE_CHAPTER_MUTATE,
      variables: {
        title: chapterDetails.title,
        url: mangaDetails.id,
        data: uploadedChapter,
        slug: slugify(`${mangaDetails.title} chapter ${chapterNumber}`),
        hasNextEp:
          chapterNumber === mangaDetails.chapters.length
            ? false
            : true /* Inserted false for 0th idx => because chaptersArr is reversed in descending order */,
        totalEpisodes: mangaDetails.chapters.length,
      },
    });
    console.log('chapterResult', chapterResult);
  };

  return (
    <>
      <h1 className="text-[32px] font-normal text-center mt-4">
        Manually Upload Chapter Images
      </h1>
      <div className="max-w-[800px] m-auto flex flex-col gap-4 mt-4">
        <Input
          type="text"
          placeholder="Enter Manga URL From Asuratoon"
          onChange={(e) => setMangaUrl(e.target.value)}
          size="sm"
        />

        <Input
          type="text"
          placeholder="Enter Chapter Url"
          onChange={(e) => setChapterUrl(e.target.value)}
          size="sm"
        />

        <Input
          type="number"
          placeholder="Enter Chapter Number"
          onChange={(e) => setChapterNumber(e.target.value)}
          size="sm"
        />

        <Button onClick={handleChapterCreation}>Create Chapter</Button>
      </div>
    </>
  );
};

export default ManualUploadChapterImages;
