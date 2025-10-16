'use client';
import React, { useEffect, useState } from 'react';
import { Button, cn } from '@nextui-org/react';
import { Listbox, ListboxItem } from '@nextui-org/react';
import { PlayCircleIcon } from '../../../../public/icons/PlayCircleIcon';
import { ChevronRightIcon } from '../../../../public/icons/ChevronRightIcon';
import { BsArrowRight } from 'react-icons/bs';
import confetti from 'canvas-confetti';
import SINGLE_MANGA_MUTATE from '@/graphql/mutations/SingleMangaMutation.gql';
import SINGLE_CHAPTER_MUTATE from '@/graphql/mutations/SingleChapterMutation.gql';
import client from '../../../../client';
import { sanityClient } from '../../../../sanityClient';
import toastify from '@/helpers/toastify';
import { ToastContainer } from 'react-toastify';
import 'animate.css/animate.min.css';
import 'react-toastify/dist/ReactToastify.css';

const SanityChaptersList = ({ chapters, manga }) => {
  const [forceReRender, setForceReRender] = useState(false);
  const titleArr = chapters[0].slug.split('-');
  console.log('bro', chapters);

  const handleConfetti = () => {
    var count = 200;
    var defaults = {
      origin: { y: 0.7 },
    };

    function fire(particleRatio, opts) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  };

  const handleChapterComplete = async () => {
    console.log('handleChapterComplete', chapters);
    return;
    const createdManga = await mangaCreator();
    console.log('createdManga created', createdManga);

    const chaptersArr = chapters.map((chapter, idx) => {
      const objArr = chapter.data.map((x) => {
        return {
          id: x.id,
          src_origin: x.src_origin,
        };
      });

      return {
        title: `Chapter ${idx + 1}`,
        url: createdManga.id,
        data: objArr,
        slug: `${createdManga?.slug}-chapter-${idx + 1}`,
        hasNextEp:
          idx === 0
            ? false
            : true /* Inserted false for 0th idx => because chaptersArr is reversed in descending order */,
        totalEpisodes: manga.totalChapters,
      };
    });

    console.log('chaptersArr', chaptersArr);

    await insertChapters(chaptersArr);
  };

  const insertChapters = async (chaptersArr) => {
    let count = 0;
    for (const x of chaptersArr) {
      const idx = chaptersArr.indexOf(x); // gets current idx
      console.log('idx', idx);
      const chapterResult = await client.mutate({
        mutation: SINGLE_CHAPTER_MUTATE,
        variables: {
          title: x.title,
          url: x.url,
          data: x.data,
          slug: x.slug,
          hasNextEp: x.hasNextEp,
          totalEpisodes: x.totalEpisodes,
        },
      });
      console.log('chapterResult', chapterResult);
      count++;
    }
  };

  const mangaCreator = async () => {
    const {
      title,
      alternativeName,
      artist,
      author,
      coverImage,
      genres,
      status,
      description: description,
      slug,
      chapters,
      rating,
      dates,
    } = manga;
    const mangaResult = await client.mutate({
      mutation: SINGLE_MANGA_MUTATE,
      variables: {
        title,
        alternativeName,
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
    console.log('mangaResult', mangaResult);
    return mangaResult.data.insert_singleMang_one;
  };

  const handleChapterDelete = async () => {
    console.log('handleChapterDelete', chapters);
    for (const chapter of chapters) {
      const result = await sanityClient.delete(chapter._id);
      console.log('result', result);
      toastify('error', `${chapter.title} Deleted`);
      setForceReRender(!forceReRender);
    }
  };

  return (
    <div className="flex flex-col items-center my-4">
      <ToastContainer />
      <h1 className="capitalize text-[40px] text-red-300 font-bold mb-6 tracking-tight inline from-[#f89e00] to-[#da2f68] bg-clip-text text-transparent bg-gradient-to-b">
        <span className="text-blue-600">Sanity: </span>
        {titleArr} - {chapters.length}
      </h1>
      <Button
        variant="solid"
        color="secondary"
        radius="full"
        endContent={<BsArrowRight />}
        fullWidth
        className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg mb-8"
        onPress={handleConfetti}
        onClick={handleChapterComplete}
      >
        Complete Chapters
      </Button>
      <Button
        variant="solid"
        color="secondary"
        radius="full"
        endContent={<BsArrowRight />}
        className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg mb-8"
        onPress={handleConfetti}
        onClick={handleChapterDelete}
      >
        Delete Chapters
      </Button>
      <Listbox
        aria-label="User Menu"
        // onAction={(key) => alert(key)}
        className="p-0 gap-0 divide-y divide-default-300/50 dark:divide-default-100/80 bg-content1 max-w-[604px] overflow-visible shadow-small rounded-medium"
        itemClasses={{
          base: 'px-3 first:rounded-t-medium last:rounded-b-medium rounded-none gap-3 h-12 data-[hover=true]:bg-default-100/80',
        }}
      >
        {chapters.map((chapter, idx) => (
          <ListboxItem
            key={idx}
            endContent={<ItemCounter number={chapter.data.length} />}
            startContent={
              <IconWrapper className="bg-primary/10 text-primary">
                <PlayCircleIcon className="text-lg" />
              </IconWrapper>
            }
            className="w-full"
            href={`/edit/chapter/${chapter.slug}`}
            target="_blank"
          >
            {`${chapter.title}`}
          </ListboxItem>
        ))}
      </Listbox>
    </div>
  );
};

export default SanityChaptersList;

export const IconWrapper = ({ children, className }) => (
  <div
    className={cn(
      className,
      'flex items-center rounded-small justify-center w-7 h-7',
    )}
  >
    {children}
  </div>
);

export const ItemCounter = ({ number }) => (
  <div className="flex items-center gap-1 text-default-400">
    <span className="text-small">{number}</span>
    <ChevronRightIcon className="text-xl" />
  </div>
);
