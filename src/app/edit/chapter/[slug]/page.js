import fetchSingleChapter from '@/lib/fetchSingleChapter';
import React from 'react';

const page = async ({ params }) => {
  const singleChapter = await fetchSingleChapter(params.slug);
  console.log('singleChapter', singleChapter);
  return <div>page</div>;
};

export default page;
