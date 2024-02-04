'use client';
import {
  Badge,
  Button,
  Chip,
  Divider,
  Input,
  Textarea,
} from '@nextui-org/react';
import { useState } from 'react';
import { FcRatings } from 'react-icons/fc';
import { useForm } from 'react-hook-form';
import client from '../../../../../client';
import SINGLE_MANGA_MUTATION from '@/graphql/mutations/SingleMangaUpdate.gql';
import { getCurrentISTTimestamp, psqlTimeStamp } from '@/utils/dateFormatter';

const EditManga = ({ manga, styles }) => {
  console.log('manga', manga);
  const [isLoading, setIsLoading] = useState(false);
  const [genres, setGenres] = useState(manga.genres);
  const [forceReRender, setForceReRender] = useState(false);
  const handleGenresClose = (genreToRemove) => {
    setGenres(genres.filter((genre) => genre !== genreToRemove));
    if (genres.length === 1) {
      setGenres(manga.genres);
    }
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    console.log('data', data);
    const {
      slug,
      alternativeName,
      description,
      rating,
      status,
      title,
      artist,
      author,
    } = data;
    const result = await client.mutate({
      mutation: SINGLE_MANGA_MUTATION,
      variables: {
        slug: data.slug,
        alternativeName,
        artist,
        author,
        updatedAt: getCurrentISTTimestamp(),
        description,
        rating: manga.rating,
        status,
        title,
      },
    });

    console.log('result', result);
    setIsLoading(false);
    setForceReRender(!forceReRender);
  };

  return (
    <div className={`${styles}`}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
        <h1 className="sm:text-[24px] md:text-[26px] font-semibold my-6 bg-purple-50 p-2 rounded-lg">
          Edit Manga - {manga.title}
        </h1>
        <Badge
          color="danger"
          content={manga.rating}
          isInvisible={false}
          shape="circle"
        >
          <FcRatings size={45} />
        </Badge>
      </div>
      <Divider className="my-4" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6">
          <Input
            size="md"
            label="Title"
            defaultValue={manga.title}
            labelPlacement="outside"
            {...register('title')}
          />
          <Input
            size="md"
            label="ID"
            defaultValue={manga.id}
            labelPlacement="outside"
            {...register('id')}
          />
          <Input
            size="md"
            label="Slug"
            defaultValue={manga.slug}
            labelPlacement="outside"
            {...register('slug')}
          />

          <Input
            size="md"
            label="Alternative Title"
            defaultValue={
              manga.alternativeName.length > 0 ? manga.alternativeName : ''
            }
            placeholder={
              manga.alternativeName.length === 0
                ? 'No Alternative Name Defined'
                : ''
            }
            labelPlacement="outside"
            {...register('alternativeName')}
          />
          <Input
            size="md"
            label="Cover Image"
            defaultValue={manga.coverImage}
            labelPlacement="outside"
            {...register('coverImage')}
          />

          <div className="flex gap-4">
            <Input
              size="md"
              label="Author"
              defaultValue={manga.author}
              labelPlacement="outside"
              {...register('author')}
            />
            <Input
              size="md"
              label="Artist"
              defaultValue={manga.artist}
              labelPlacement="outside"
              {...register('artist')}
            />
          </div>

          <div className="flex gap-4">
            <Input
              size="md"
              label="Manga Status"
              defaultValue={manga.status}
              labelPlacement="outside"
              {...register('status')}
            />

            <Input
              size="md"
              label="Rating"
              defaultValue={manga.rating}
              labelPlacement="outside"
              {...register('rating')}
            />
          </div>

          <div className="flex gap-4">
            <Input
              size="md"
              label="Manga Updated Date"
              defaultValue={manga.dates.uploadedDate}
              labelPlacement="outside"
              {...register('manga-uploadedDate')}
            />
            <Input
              size="md"
              labelPlacement="outside"
              label="Manga Uploaded Date"
              defaultValue={manga.dates.updatedDate}
              {...register('manga.updatedDate')}
            />
          </div>

          <Textarea
            label="Description"
            labelPlacement="outside"
            placeholder="Enter your description (Default autosize)"
            defaultValue={manga.description}
            {...register('description')}
          />

          {/*Genres*/}
          <p className="text-[20px] leading-[1px] mt-4">Genres</p>
          <div className="flex flex-wrap gap-4">
            {genres.map((x, idx) => (
              <Chip
                key={idx}
                onClose={() => handleGenresClose(x)}
                variant="dot"
                color="warning"
              >
                {x}
              </Chip>
            ))}
          </div>
          {/*Genres*/}
        </div>
        <Button
          color="primary"
          variant="shadow"
          className="mt-6"
          isLoading={isLoading}
          fullWidth
          size="lg"
          type="submit"
          onSubmit={handleSubmit}
        >
          Submit
        </Button>
      </form>
    </div>
  );
};

export default EditManga;
