'use client';
import React from 'react';
import ContentWrapper from '../../ContentWrapper';
import { Input, Button } from '@nextui-org/react';
import { useForm } from 'react-hook-form';

const SingleChapter = ({ chapter }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  console.log('chapter', chapter);
  const titleArr = chapter.slug.split('-');
  const title = titleArr.slice(0, titleArr.length - 2).join(' ');

  const onSubmit = (data) => {
    console.log('onSubmit', data);
  };

  return (
    <ContentWrapper>
      <h1 className="text-[22px] md:text-[28px] text-red-300 text-center font-semibold capitalize my-6">
        Edit - {title} {chapter.title}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          {chapter.data.map((x, idx) => (
            <Input
              key={idx}
              placeholder="bade"
              size="sm"
              defaultValue={x.src_origin}
              {...register(idx.toString())}
              description={`${idx + 1}`}
            />
          ))}
        </div>

        <Button
          fullWidth
          type="submit"
          color="success"
          variant="shadow"
          className="mt-6"
        >
          Update
        </Button>
      </form>
    </ContentWrapper>
  );
};

export default SingleChapter;
