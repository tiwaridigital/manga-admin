'use client';
import getMangaDetails from '@/app/_actions/getMangaDetails';
import { Button, Spinner } from '@nextui-org/react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import SINGLE_MANGA_MUTATE from '@/graphql/mutations/SingleMangaMutation.gql';
import SINGLE_CHAPTER_MUTATE from '@/graphql/mutations/SingleChapterMutation.gql';
import COMPLETE_CHAPTER_MUTATION from '@/graphql/mutations/chapter_tracker/completeChapterMutation.gql';
import INCOMPLETE_CHAPTER_MUTATION from '@/graphql/mutations/chapter_tracker/inCompleteChapterMutation.gql';
import { getAutoTitle, slugify } from '@/utils/helpers';
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
    const originalManga = await getMangaDetails(sanityManga.srcUrl, 'MangaDex');
    const mangaChapters = await sanityClient.fetch(
      `*[_type == "chapters" && url._ref == "${sanityManga._id.replace('drafts.', '')}"] | order(_createdAt asc)`,
    );
    console.log('mangaChapters', mangaChapters);

    // const chaptersNew = await sanityClient.fetch(
    //   `*[_type == "chapters" && url._ref == "crISBzUtxSwGhgqYsM0mQV"] | order(_createdAt asc)`,
    // );
    //
    // for (const chapter of chaptersNew) {
    //   const data = chapter.data.map((x) => ({
    //     ...x,
    //     src_origin: x.src_origin.replace('anstrmx/', ''),
    //   }));
    //   console.log('data', data);
    //   const result = await sanityClient
    //     .patch(chapter._id) // specify the document ID
    //     .set({
    //       data,
    //     })
    //     .commit(); // apply the patch
    //   console.log('result', result);
    // }

    // const sortedByTitle = mangaChapters.sort((a, b) => {
    //   const titleA = Number(a.title.split(' ').slice(-1));
    //   const titleB = Number(b.title.split(' ').slice(-1));
    //   if (titleA < titleB) {
    //     return 1;
    //   } else {
    //     return -1;
    //   }
    // });

    const chapterImages = mangaChapters.map((x) =>
      x.data.map((y) => {
        return {
          id: y.id,
          src_origin: y.src_origin,
        };
      }),
    );

    let {
      title,
      alterNativeName,
      altTitles,
      artist,
      author,
      coverImage,
      image,
      status,
      description,
      rate: rating,
      uploadedDate,
      updatedDate,
    } = originalManga;
    title = getAutoTitle(altTitles || title || '');
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
        slug: slugify(`${slug} chapter ${idx + 1}`),
        last_update: x.last_update,
      };
    });

    console.log('obj', {
      title,
      alternativeName: alterNativeName ?? '',
      artist: artist ?? '',
      author: author ?? '',
      coverImage: image ?? '',
      genres,
      status,
      description,
      src: 'asuratoon',
      slug,
      chapters,
      rating,
      dates: dates ?? {},
    });

    console.log('debug', {
      originalManga,
      chapterImages,
      // mangaResult,
      sanityManga,
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
        description: description.en ?? description.ja ?? '',
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
      sanityManga,
    );
  };

  const createChapters = async (
    originalManga,
    chapterImages,
    mangaResult,
    sanityManga,
  ) => {
    console.log('createChapters called', originalManga);
    /*
     * Create Chapter Now => After Manga is Created
     */
    let chaptersArr = originalManga.chapters.map((x, idx) => {
      return {
        title: x.title,
        url: mangaResult.data.insert_singleMang_one.id,
        chapter_data: chapterImages[idx],
        slug: slugify(
          `${mangaResult.data.insert_singleMang_one.slug} chapter ${idx + 1}`,
        ),
        last_update: x.last_update,
      };
    });

    console.log('chaptersArr', chaptersArr);

    let count = 0;
    for (const x of chaptersArr) {
      const idx = chaptersArr.indexOf(x); // gets current idx
      console.log('idx', idx);
      const sanitizedData = chapterImages[idx].map(({ _key, ...rest }) => rest);
      console.log('sanitizedData', sanitizedData, Array.isArray(sanitizedData));
      console.log('obj', {
        title: x.title,
        url: x.url,
        data: sanitizedData,
        slug: x.slug,
        hasNextEp:
          idx === 0
            ? false
            : true /* Inserted false for 0th idx => because chaptersArr is reversed in descending order */,
        totalEpisodes: chaptersArr.length,
      });
      const chapterResult = await client.mutate({
        mutation: SINGLE_CHAPTER_MUTATE,
        variables: {
          title: x.title,
          url: x.url,
          data: sanitizedData,
          slug: x.slug,
          hasNextEp:
            idx === 0
              ? false
              : true /* Inserted false for 0th idx => because chaptersArr is reversed in descending order */,
          totalEpisodes: chaptersArr.length,
        },
      });
      count++;
      console.log('chapterResult', chapterResult);
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
