'use client';
import {
  Badge,
  Button,
  Chip,
  Divider,
  Input,
  Link,
  Snippet,
  Textarea,
} from '@nextui-org/react';
import { useState } from 'react';
import { FcRatings } from 'react-icons/fc';
import { useForm } from 'react-hook-form';
import client from '../../../../../client';
import SINGLE_MANGA_MUTATION from '@/graphql/mutations/SingleMangaUpdate.gql';
import { getCurrentISTTimestamp } from '@/utils/dateFormatter';
import { toast, ToastContainer, cssTransition } from 'react-toastify';
import 'animate.css/animate.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { IoCloseSharp } from 'react-icons/io5';
import gql from 'graphql-tag';
import { BsArrowRight } from 'react-icons/bs';
import confetti from 'canvas-confetti';

const MangaEdit = ({ manga, styles }) => {
  console.log('manga', manga);
  const [isLoading, setIsLoading] = useState(false);
  const [genres, setGenres] = useState(manga?.genres);
  const [forceReRender, setForceReRender] = useState(false);
  const handleConfetti = () => {
    const count = 200;
    const defaults = {
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
      coverImage,
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
        rating: manga?.rating,
        status,
        title,
        coverImage,
      },
    });

    console.log('result', result);
    setIsLoading(false);
    toast.success('Successfully Updated', {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
      transition: bounce,
      closeButton: <IoCloseSharp size={24} />,
    });
    setForceReRender(!forceReRender);
  };

  const bounce = cssTransition({
    enter: 'animate__animated animate__bounceIn',
    exit: 'animate__animated animate__bounceOut',
  });

  const handleGenresClose = (genreToRemove) => {
    setGenres(genres.filter((genre) => genre !== genreToRemove));
    if (genres.length === 1) {
      setGenres(manga?.genres);
    }
  };

  const handleGenreUpdate = async () => {
    const genreMutation = gql`
      mutation updateGenre($mangaId: uuid!, $genres: jsonb) {
        update_singleMang_by_pk(
          pk_columns: { id: $mangaId }
          _set: { genres: $genres }
        ) {
          title
          genres
        }
      }
    `;

    const result = await client.mutate({
      mutation: genreMutation,
      variables: {
        mangaId: manga?.id,
        genres,
      },
    });

    console.log('genre result', result);
  };

  console.log('genres', genres);

  return (
    <div className={`${styles}`}>
      <ToastContainer />
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
        <Snippet
          classNames={{
            base: 'p-2 w-full rounded-lg mt-2 bg-white',
            pre: 'text-[20px] sm:text-[30px] pb-[10px] font-sans font-bold tracking-tight inline from-[#f89e00] to-[#da2f68] bg-clip-text text-transparent bg-gradient-to-b',
          }}
          hideSymbol
        >
          {`Sanity: ${manga?.title}`}
        </Snippet>

        <Badge
          color="danger"
          content={manga?.rating}
          isInvisible={false}
          shape="circle"
        >
          <FcRatings size={45} />
        </Badge>
      </div>
      <Divider className="mt-2 mb-4" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6">
          <Input
            size="md"
            label="Title"
            defaultValue={manga?.title}
            labelPlacement="outside"
            {...register('title')}
          />
          <Input
            size="md"
            label="ID"
            defaultValue={manga?._id}
            labelPlacement="outside"
            {...register('id')}
          />
          <Input
            size="md"
            label="Slug"
            defaultValue={manga?.slug}
            labelPlacement="outside"
            {...register('slug')}
          />

          <Input
            size="md"
            label="Alternative Title"
            defaultValue={
              manga?.alternativeName?.length > 0 ? manga?.alternativeName : ''
            }
            placeholder={
              manga?.alternativeName?.length === 0
                ? 'No Alternative Name Defined'
                : ''
            }
            labelPlacement="outside"
            {...register('alternativeName')}
          />
          <Input
            size="md"
            label="Cover Image"
            defaultValue={manga?.coverImage}
            labelPlacement="outside"
            {...register('coverImage')}
          />

          <div className="flex gap-4">
            <Input
              size="md"
              label="Author"
              defaultValue={manga?.author}
              labelPlacement="outside"
              {...register('author')}
            />
            <Input
              size="md"
              label="Artist"
              defaultValue={manga?.artist}
              labelPlacement="outside"
              {...register('artist')}
            />
          </div>

          <div className="flex gap-4">
            <Input
              size="md"
              label="Manga Status"
              defaultValue={manga?.status}
              labelPlacement="outside"
              {...register('status')}
            />

            <Input
              size="md"
              label="Rating"
              defaultValue={manga?.rating}
              labelPlacement="outside"
              {...register('rating')}
            />
          </div>

          <div className="flex gap-4">
            <Input
              size="md"
              label="Manga Updated Date"
              defaultValue={manga?.dates?.uploadedDate}
              labelPlacement="outside"
              {...register('manga-uploadedDate')}
            />
            <Input
              size="md"
              labelPlacement="outside"
              label="Manga Uploaded Date"
              defaultValue={manga?.dates?.updatedDate}
              {...register('manga?.updatedDate')}
            />
          </div>

          <Textarea
            label="Description"
            labelPlacement="outside"
            placeholder="Enter your description (Default autosize)"
            defaultValue={manga?.description}
            {...register('description')}
          />
        </div>
        <Button
          variant="shadow"
          className="mt-6 bg-gradient-to-r from-[#11998e] to-[#38ef7d] text-white after:content-[''] after:absolute after:rounded-full after:inset-0 after:bg-background/40 after:z-[-1] after:transition after:!duration-500 hover:after:scale-150 hover:after:opacity-0"
          isLoading={isLoading}
          fullWidth
          radius="full"
          size="lg"
          type="submit"
          onSubmit={handleSubmit}
          endContent={<BsArrowRight size={24} />}
          onPress={handleConfetti}
        >
          Submit
        </Button>
      </form>
    </div>
  );
};

export default MangaEdit;
