'use client';
import getMangaDetails from '@/app/_actions/getMangaDetails';
import { Button, Spinner } from '@nextui-org/react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import SINGLE_MANGA_MUTATE from '@/graphql/mutations/SingleMangaMutation.gql';
import SINGLE_CHAPTER_MUTATE from '@/graphql/mutations/SingleChapterMutation.gql';
import COMPLETE_CHAPTER_MUTATION from '@/graphql/mutations/chapter_tracker/completeChapterMutation.gql';
import INCOMPLETE_CHAPTER_MUTATION from '@/graphql/mutations/chapter_tracker/inCompleteChapterMutation.gql';
import { slugify } from '@/utils/helpers';
import client from '../../../../client';
import { sanityClient } from '../../../../sanityClient';

const MoveToHasura = ({ data }) => {
  const [mangas, setMangas] = useState(null);

  useEffect(() => {
    setMangas([...data]);
  }, [data]);

  const handleMoveToHasura = async (sanityManga) => {
    await createManga(sanityManga);
  };

  const createManga = async (sanityManga) => {
    const originalManga = await getMangaDetails(sanityManga.srcUrl);
    const mangaChapters = await sanityClient.fetch(
      `*[_type == "chapters" && url._ref == "${sanityManga._id}"] | order(_createdAt asc)`
    );

    const sortedByTitle = mangaChapters.sort((a, b) => {
      const titleA = Number(a.title.split(' ').slice(-1));
      const titleB = Number(b.title.split(' ').slice(-1));
      if (titleA < titleB) {
        return 1;
      } else {
        return -1;
      }
    });

    const chapterImages = sortedByTitle.map((x) =>
      x.data.map((y) => {
        return {
          id: y.id,
          src_origin: y.src_origin,
        };
      })
    );

    const {
      title,
      alterNativeName,
      artist,
      author,
      coverImage,
      status,
      description,
      rate: rating,
      uploadedDate,
      updatedDate,
    } = originalManga;
    const slug = slugify(title);
    const genres = originalManga.genres.map((x) => x.name);
    const dates = {
      uploadedDate: uploadedDate,
      updatedDate,
    };
    /*
     * Create Chapter in Single Manga => To get chapter details for later use => for fetching the chapters
     */
    let chapters = originalManga.chapters.map((x, idx) => {
      return {
        title: x.title,
        slug: slugify(`${slug} chapter ${originalManga.chapters.length - idx}`),
        last_update: x.last_update,
      };
    });

    const mangaResult = await client.mutate({
      mutation: SINGLE_MANGA_MUTATE,
      variables: {
        title,
        alternativeName: alterNativeName,
        artist,
        author,
        coverImage,
        genres,
        status,
        description: description,
        src: 'asuratoon',
        slug,
        chapters,
        rating,
        dates,
      },
    });

    await createChapters(
      originalManga,
      chapterImages,
      mangaResult,
      sanityManga
    );
  };

  const createChapters = async (
    originalManga,
    chapterImages,
    mangaResult,
    sanityManga
  ) => {
    console.log('createChapters called', originalManga);
    /*
     * Create Chapter Now => After Manga is Created
     */
    let chaptersArr = originalManga.chapters.map((x, idx) => {
      return {
        title: x.title,
        url: mangaResult.data.insert_singleMang_one.id,
        // chapter_data: data.chapterData[idx],
        chapter_data: chapterImages[idx],
        slug: slugify(
          `${mangaResult.data.insert_singleMang_one.slug} chapter ${
            originalManga.chapters.length - idx
          }`
        ),
        last_update: x.last_update,
      };
    });

    let count = 0;
    for (const x of chaptersArr) {
      const idx = chaptersArr.indexOf(x); // gets current idx
      console.log('idx', idx);
      const chapterResult = await client.mutate({
        mutation: SINGLE_CHAPTER_MUTATE,
        variables: {
          title: x.title,
          url: x.url,
          data: x.chapter_data,
          slug: x.slug,
          hasNextEp:
            idx === 0
              ? false
              : true /* Inserted false for 0th idx => because chaptersArr is reversed in descending order */,
          totalEpisodes: chaptersArr.length,
        },
      });
      count++;
    }

    /*
     * Chapters Completion Tracker
     * Push manga id into chapter_tracker's => complete col if all chapters are inserted
     * else push into => incomplete col
     */
    if (count === chaptersArr.length) {
      const chapterTrackerResult = await client.mutate({
        mutation: COMPLETE_CHAPTER_MUTATION,
        variables: {
          chapterId: mangaResult.data.insert_singleMang_one.id,
        },
      });
      console.log('chapterTracker Complete', chapterTrackerResult);
    } else {
      const chapterTrackerResult = await client.mutate({
        mutation: INCOMPLETE_CHAPTER_MUTATION,
        variables: {
          chapterId: mangaResult.data.insert_singleMang_one.id,
        },
      });
      console.log('chapterTracker Incomplete', chapterTrackerResult);
    }

    // set manga to unPublished in sanity
    const sanityMutation = await sanityClient
      .patch(sanityManga._id)
      .set({
        isPublished: false,
        isMovedToHasura: true,
      })
      .commit();
  };

  return (
    <div className="flex justify-center my-12 ">
      {!mangas ? (
        <div className="w-full h-[100vh] flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="flex justify-center sm:justify-start flex-wrap gap-8">
          {mangas.map((manga) => (
            <div
              className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-[48%] shadow-lg rounded-lg p-4"
              key={manga._id}
            >
              <Image
                className="mt-[-30px]"
                height={120}
                width={90}
                src={manga.coverImage}
                alt="coverImage"
              />
              <div className="flex flex-col items-baseline ">
                <h2 className="text-[20px] font-semibold">{manga.title}</h2>
                <p>{manga.srcUrl}</p>
                <p>Total Episodes: {manga.totalChapters}</p>
                <p className="text-gray-400">
                  Completed Episodes: {manga.completedChapters}
                </p>

                <Button
                  variant="shadow"
                  className="mt-2 !rounded-[4px]"
                  onClick={() => handleMoveToHasura(manga)}
                >
                  Move To Hasura
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MoveToHasura;
