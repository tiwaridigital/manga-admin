'use client';
import React from 'react';
import { cn } from '@nextui-org/react';
import { Listbox, ListboxItem } from '@nextui-org/react';
import { PlayCircleIcon } from '../../../public/icons/PlayCircleIcon';
import { ChevronRightIcon } from '../../../public/icons/ChevronRightIcon';

const ChaptersList = ({ chapters }) => {
  console.log('chapters', chapters);
  const titleArr = chapters[0].slug.split('-');
  const title = titleArr.slice(0, titleArr.length - 2).join(' ');
  console.log('title', titleArr);

  return (
    <div className="flex flex-col items-center my-4">
      <h1 className="capitalize text-[30px] text-red-300 font-bold mb-6">
        {title} - {chapters[0].totalEpisodes}
      </h1>
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

export default ChaptersList;

export const IconWrapper = ({ children, className }) => (
  <div
    className={cn(
      className,
      'flex items-center rounded-small justify-center w-7 h-7'
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
