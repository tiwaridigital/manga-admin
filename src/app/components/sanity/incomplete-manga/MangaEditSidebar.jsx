'use client';
import {
  Badge,
  Button,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Snippet,
  useDisclosure,
  Link,
  Chip,
  Input,
  Checkbox,
} from '@nextui-org/react';
import { dateFormatter } from '@/utils/dateFormatter';
import NextImage from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { IoIosAddCircle } from 'react-icons/io';
import { LiaEditSolid } from 'react-icons/lia';
import { useDropzone } from 'react-dropzone';
import gql from 'graphql-tag';
import client from '../../../../../client';
import { ToastContainer, toast, cssTransition } from 'react-toastify';
import 'animate.css/animate.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { IoCloseSharp } from 'react-icons/io5';
import { BsArrowRight } from 'react-icons/bs';

const MangaEditSidebar = ({ manga, styles }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isGenreModalOpen,
    onOpen: onGenreModalOpen,
    onOpenChange: onGenreModalOpenChange,
  } = useDisclosure();
  const [files, setFiles] = useState([]);
  const [changeImage, setChangeImage] = useState(false);
  const [genres, setGenres] = useState(manga.genres);
  const [inputGenreValue, setInputGenreValue] = useState('');
  const [isGenreUpdateLoading, setIsGenreUpdateLoading] = useState(false);

  const toastFun = (msg) => {
    const bounce = cssTransition({
      enter: 'animate__animated animate__bounceIn',
      exit: 'animate__animated animate__bounceOut',
    });

    toast.success(msg, {
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
  };

  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
    console.log('file dropped', acceptedFiles);
    setFiles(
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        }),
      ),
    );
  }, []);

  console.log('files', files);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, []);

  const handleGenresClose = (genreToRemove) => {
    setGenres(genres.filter((genre) => genre !== genreToRemove));
    if (genres.length === 1) {
      setGenres(manga.genres);
    }
  };

  const handleGenreUpdate = async () => {
    setIsGenreUpdateLoading(true);
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
        mangaId: manga.id,
        genres,
      },
    });

    console.log('genre result', result);
    setIsGenreUpdateLoading(false);
    toastFun('Genres Successfully Updated');
  };

  console.log('genres', genres);

  return (
    <div
      className={`flex flex-col items-center bg-purple-100/50 my-6 rounded-2xl backdrop-blur-sm ${styles}`}
    >
      <div className="flex flex-col sm:justify-between px-2 pt-2 pb-4">
        <Snippet
          variant="shadow"
          color="primary"
          className="mb-6"
          codeString={`${process.env.NEXT_PUBLIC_DOMAIN}/manga/${manga.slug}`}
          hideSymbol
        >
          {manga.slug}
        </Snippet>
        <Snippet variant="shadow" color="secondary" hideSymbol>
          {`Created: ${dateFormatter(manga.createdAt)}`}
        </Snippet>
      </div>

      <div className="px-4 flex flex-col items-center">
        {/*Chapters*/}
        <Link
          isBlock
          showAnchorIcon
          href={`/chapters/${manga.id}`}
          target="_blank"
          color="primary"
          className="text-[20px] font-semibold"
        >
          Chapters - Edit Chapters
        </Link>
        <h1 className="text-[50px] text-red-300 font-bold tracking-tight inline from-[#f89e00] to-[#da2f68] bg-clip-text text-transparent bg-gradient-to-b">
          {`Total: ${manga.chapters.length}`}
        </h1>
        <h1 className="text-[50px] mb-4 text-red-300 font-bold tracking-tight inline from-[#f89e00] to-[#da2f68] bg-clip-text text-transparent bg-gradient-to-b">
          {`Completed: ${manga.completedChapters}`}
        </h1>

        <Button
          variant="solid"
          color="secondary"
          radius="full"
          endContent={<BsArrowRight />}
          fullWidth
          className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg mb-8"
        >
          Complete Chapters
        </Button>
        {/*Chapters*/}
      </div>

      <Image
        as={NextImage}
        width={200}
        height={400}
        src={manga.coverImage}
        alt="NextUI hero Image"
        className="mb-6 cursor-pointer"
        onClick={onOpen}
      />
      <ImageModal isOpen={isOpen} onOpenChange={onOpenChange} manga={manga} />
      <Button
        variant="shadow"
        radius="full"
        startContent={<FaRegEdit />}
        className="mb-2 mx-2 w-[95%] bg-gradient-to-r from-amber-500 to-pink-500 text-white"
        onClick={() => setChangeImage(!changeImage)}
      >
        Change Image
      </Button>

      {changeImage && (
        <>
          <div
            className="bg-white m-2 text-[13px] py-6 px-4 text-center flex rounded-lg justify-center cursor-pointer"
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <p>Drag 'n' drop some files here, or click to select files</p>
            )}
          </div>
          {files.map((file, idx) => (
            // eslint-disable-next-line react/jsx-key
            <ImagePreview file={file} />
          ))}
        </>
      )}

      {/*Genres*/}
      <div className="px-2 w-full">
        <div className="flex justify-between items-center py-2">
          <p className="text-[20px] leading-[1px] mt-6 mb-8">Genres</p>
          <Chip
            variant="shadow"
            classNames={{
              base: 'cursor-pointer bg-gradient-to-r from-amber-500 to-pink-500',
              content: 'text-white text-[14px]',
            }}
            startContent={<IoIosAddCircle size={18} color="#e2e8f0" />}
            size="lg"
            onClick={onGenreModalOpen}
          >
            Add Genre
          </Chip>
          <AddGenreModal
            isOpen={isGenreModalOpen}
            onOpenChange={onGenreModalOpenChange}
            inputGenreValue={inputGenreValue}
            setInputGenreValue={setInputGenreValue}
            genres={genres}
            setGenres={setGenres}
          />
        </div>
        <div className="flex flex-wrap gap-4 mb-6">
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
        <Button
          variant="shadow"
          radius="full"
          className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
          fullWidth
          onClick={handleGenreUpdate}
          endContent={<LiaEditSolid size={20} />}
          isLoading={isGenreUpdateLoading}
        >
          Update Genre
        </Button>
      </div>
      {/*Genres*/}
    </div>
  );
};

export default MangaEditSidebar;

export const ImageModal = ({ isOpen, onOpenChange, manga }) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {manga.title}
            </ModalHeader>
            <ModalBody>
              <img src={manga.coverImage} />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" onPress={onClose}>
                Action
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export const ImagePreview = ({ file }) => {
  const thumb = {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    padding: 4,
    boxSizing: 'border-box',
  };

  const thumbInner = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden',
  };

  const img = {
    display: 'block',
    width: 'auto',
    height: '100%',
  };

  return (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img
          src={file.preview}
          style={img}
          // Revoke data uri after image is loaded
          onLoad={() => {
            URL.revokeObjectURL(file.preview);
          }}
        />
      </div>
    </div>
  );
};

export const AddGenreModal = ({
  isOpen,
  onOpenChange,
  inputGenreValue,
  setInputGenreValue,
  genres,
  setGenres,
}) => {
  console.log('AddGenreModal');
  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="top-center"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Add Genre</ModalHeader>
            <ModalBody>
              <Input
                autoFocus
                placeholder="Enter Genre Name"
                size="sm"
                onChange={(e) => setInputGenreValue(e.target.value)}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                color="warning"
                variant="faded"
                onPress={onClose}
                onClick={() => setGenres([...genres, inputGenreValue])}
                endContent={<IoIosAddCircle size={24} />}
              >
                Add {inputGenreValue}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
