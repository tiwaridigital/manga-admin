'use client';
import {
  Button,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Snippet,
  useDisclosure,
} from '@nextui-org/react';
import { dateFormatter } from '@/utils/dateFormatter';
import NextImage from 'next/image';

const EditManga = ({ manga }) => {
  console.log('manga', manga);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="w-full">
      <h1 className="text-[28px] my-6">Edit Manga - {manga.title}</h1>

      <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
        <Snippet
          variant="shadow"
          color="primary"
          className="mb-6"
          codeString={`${process.env.NEXT_PUBLIC_DOMAIN}/manga/${manga.slug}`}
          hideSymbol
        >
          {manga.slug}
        </Snippet>
        <Snippet variant="shadow" color="secondary" className="mb-6" hideSymbol>
          {`Created: ${dateFormatter(manga.createdAt)}`}
        </Snippet>
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

      <div className="flex flex-col gap-6">
        <Input
          size="md"
          label="Title"
          defaultValue={manga.title}
          labelPlacement="outside"
        />
        <Input
          size="md"
          label="ID"
          defaultValue={manga.id}
          labelPlacement="outside"
        />
        <Input
          size="md"
          label="Slug"
          defaultValue={manga.slug}
          labelPlacement="outside"
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
        />

        <Input
          size="md"
          label="Author"
          defaultValue={manga.author}
          labelPlacement="outside"
        />
        <Input
          size="md"
          label="Artist"
          defaultValue={manga.artist}
          labelPlacement="outside"
        />
        <Input
          size="md"
          label="Manga Status"
          defaultValue={manga.status}
          labelPlacement="outside"
        />

        <div className="flex gap-4">
          <Input
            size="md"
            label="Manga Updated Date"
            defaultValue={manga.dates.uploadedDate}
            labelPlacement="outside"
          />
          <Input
            size="md"
            labelPlacement="outside"
            label="Manga Uploaded Date"
            defaultValue={manga.dates.updatedDate}
          />
        </div>
      </div>
    </div>
  );
};

export default EditManga;

export const ImageModal = ({
  isOpen,
  onOpenChange,
  onPress,
  onClose,
  manga,
}) => {
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
