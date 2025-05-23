'use client';
import React, { useMemo, useState } from 'react';
// import Modal from '../modal/Modal';
import { fetchDataServerAction } from '@/app/_actions/fetchDataFromServer';
import SINGLE_MANGA_MUTATE from '@/graphql/mutations/SingleMangaMutation.gql';
import SINGLE_CHAPTER_MUTATE from '@/graphql/mutations/SingleChapterMutation.gql';
import COMPLETE_CHAPTER_MUTATION from '@/graphql/mutations/chapter_tracker/completeChapterMutation.gql';
import INCOMPLETE_CHAPTER_MUTATION from '@/graphql/mutations/chapter_tracker/inCompleteChapterMutation.gql';
import client from '../../../client';
import { slugify } from '@/utils/helpers';
import {
  Autocomplete,
  AutocompleteItem,
  Avatar,
  Button,
  Input,
} from '@nextui-org/react';
import { CiSearch } from 'react-icons/ci';
import { GoLink } from 'react-icons/go';

const Create = ({ websites }) => {
  const [manga, setManga] = useState(null);
  console.log('manga', manga);

  const [open, setOpen] = useState(false);
  const [selectedSrc, setSelectedSrc] = useState(websites[0].value);
  const [srcUrl, setSrcUrl] = useState(null);
  const options = [
    { value: 'manga', label: 'Create Single Manga' },
    { value: 'chapter', label: 'Create Chapter' },
  ];

  const mangaSources = [
    { value: 'mangadex', label: 'Mangadex' },
    { value: 'asuratoon', label: 'Asuratoon' },
    { value: 'toonily', label: 'Toonily' },
    { value: 'nettruyen', label: 'Nettruyen' },
    { value: 'blogtruyen', label: 'Blogtruyen' },
  ];

  const handleActions = (e) => {
    if (e.value === 'manga' || e.value === 'chapter') {
      setOpen(true);
    }
  };

  const onSelectionChange = (value) => {
    setSelectedSrc(value);
  };

  console.log('srcUrl', srcUrl);
  console.log('selectedSrc', selectedSrc);

  const handleDataFetching_Insertion = async (e) => {
    console.log('handleSources');
    /*
     * First Fetch The Manga Using fetchDataServerAction Function, which is a => Server Action
     * i.e. function based on 'use server' method -> where you can call other server functions
     * and then use those not directly supported server functions/methods -> indirectly
     */
    const data = await fetchDataServerAction(
      selectedSrc,
      // 'https://asuratoon.com/manga/6849480105-regressing-with-the-kings-power/'
<<<<<<< HEAD
      srcUrl
=======
      srcUrl,
>>>>>>> master
    );
    setManga(data);

    /*
     * Now Mutate this single manga data to hasura
     */
    try {
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
      } = data.detail_manga;

      const slug = slugify(title);
      const genres = data.detail_manga.genres.map((x) => x.name);
      const dates = {
        uploadedDate: uploadedDate,
        updatedDate,
      };
      /*
       * Create Chapter in Single Manga => To get chapter details for later use => for fetching the chapters
       */
      let chapters = data.detail_manga.chapters.map((x, idx) => {
        return {
          title: x.title,
          slug: slugify(
<<<<<<< HEAD
            `${slug} chapter ${data.detail_manga.chapters.length - idx}`
=======
            `${slug} chapter ${data.detail_manga.chapters.length - idx}`,
>>>>>>> master
          ),
          last_update: x.last_update,
        };
      });

      console.log('chapters', chapters);

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
<<<<<<< HEAD
          description: description,
=======
          description:
            Object.keys(description).length === 0 ? '' : description?.en,
>>>>>>> master
          src: e.value,
          slug,
          chapters,
          rating,
          dates,
        },
      });
      console.log('mangaResult', mangaResult);

      await createChapters(data, mangaResult);
    } catch (err) {
      throw new Error(`Error Creating Single Manga to DB: ${err}`);
    }
  };

  const createChapters = async (data, mangaResult) => {
    /*
     * Create Chapter Now => After Manga is Created
     */
    let chaptersArr = data.detail_manga.chapters.map((x, idx) => {
      return {
        title: x.title,
        url: mangaResult.data.insert_singleMang_one.id,
        // chapter_data: data.chapterData[idx],
        chapter_data: data.chapterImages[idx],
        slug: slugify(
          `${mangaResult.data.insert_singleMang_one.slug} chapter ${
            data.detail_manga.chapters.length - idx
<<<<<<< HEAD
          }`
=======
          }`,
>>>>>>> master
        ),
        last_update: x.last_update,
      };
    });

    console.log('chapters', chaptersArr);

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
      console.log('chapterResult', chapterResult);
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
  };

  return (
    <div className="pt-[100px] pb-[100px]">
      <div className="w-[90%] md:w-1/2 flex flex-col items-center justify-center gap-6 m-auto">
        {/* <Select
            options={options}
            placeholder="Select Action..."
            onChange={handleActions}
          /> */}
        <Autocomplete
          defaultItems={websites}
          defaultInputValue={websites[0].name}
          onSelectionChange={onSelectionChange}
          classNames={{
            listboxWrapper: 'max-h-[320px]',
            selectorButton: 'text-default-500',
          }}
          inputProps={{
            classNames: {
              input: 'ml-1',
              inputWrapper: 'h-[48px]',
            },
          }}
          listboxProps={{
            hideSelectedIcon: true,
            itemClasses: {
              base: [
                'rounded-medium',
                'text-default-500',
                'transition-opacity',
                'data-[hover=true]:text-foreground',
                'dark:data-[hover=true]:bg-default-50',
                'data-[pressed=true]:opacity-70',
                'data-[hover=true]:bg-default-200',
                'data-[selectable=true]:focus:bg-default-100',
                'data-[focus-visible=true]:ring-default-500',
              ],
            },
          }}
          aria-label="Select an employee"
          placeholder="Select Website to Create Manga"
          popoverProps={{
            offset: 10,
            classNames: {
              base: 'rounded-large',
              content: 'p-1 border-small border-default-100 bg-background',
            },
          }}
          startContent={<CiSearch size={26} />}
          radius="full"
          variant="bordered"
        >
          {(item) => (
            <AutocompleteItem key={item.value} textValue={item.name}>
              <div className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
                  <Avatar
                    alt={item.name}
                    className="flex-shrink-0"
                    size="sm"
                    src={item.avatar}
                  />
                  <div className="flex flex-col">
                    <span className="text-small">{item.name}</span>
                    <span className="text-tiny text-default-400">
                      {item.team}
                    </span>
                  </div>
                </div>
                <Button
                  className="border-small mr-0.5 font-medium shadow-small"
                  radius="full"
                  size="sm"
                  variant="bordered"
                >
                  Add
                </Button>
              </div>
            </AutocompleteItem>
          )}
        </Autocomplete>

        <Input
          type="text"
          placeholder="Enter url to create Manga"
          radius="full"
          size="sm"
          onChange={(e) => setSrcUrl(e.target.value)}
          startContent={<GoLink size={18} />}
          classNames={{
            innerWrapper: ['px-4'],
          }}
        />

        <Button
          radius="full"
          className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg w-[300px]"
          onClick={handleDataFetching_Insertion}
        >
          Create Manga
        </Button>
      </div>
      {/* <Modal
        setOpen={setOpen}
        open={open}
        options={mangaSources}
        // onChange={handleDataFetching_Insertion}
        fetchData={handleDataFetching_Insertion}
        setSrcUrl={setSrcUrl}
        setSelectedSrc={setSelectedSrc}
      /> */}
    </div>
  );
};

export default Create;
