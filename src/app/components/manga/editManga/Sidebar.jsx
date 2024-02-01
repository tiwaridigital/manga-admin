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
} from '@nextui-org/react';
import { dateFormatter } from '@/utils/dateFormatter';
import NextImage from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { useDropzone } from 'react-dropzone';

const Sidebar = ({ manga, styles }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [files, setFiles] = useState([]);
  const [changeImage, setChangeImage] = useState(false);

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
      {/*Chapters*/}
      <Link
        isBlock
        showAnchorIcon
        href="#"
        color="primary"
        className="text-[20px] font-semibold"
      >
        Chapters - Edit Chapters
      </Link>
      <h1 className="text-[50px] text-red-300 font-bold">
        {manga.chapters.length}
      </h1>
      {/*Chapters*/}

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
        color="secondary"
        variant="flat"
        startContent={<FaRegEdit />}
        className="mb-2 mx-2 w-[95%]"
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
    </div>
  );
};

export default Sidebar;

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
