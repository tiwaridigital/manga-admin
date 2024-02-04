import ContentWrapper from '@/app/components/ContentWrapper';
import SingleChapter from '@/app/components/chapters/singleChapter/SingleChapter';
import Layout from '@/app/layout/Layout';
import fetchSingleChapter from '@/lib/fetchSingleChapter';
import React from 'react';

const page = async ({ params }) => {
  const singleChapter = await fetchSingleChapter(params.slug);
  console.log('singleChapter', singleChapter);
  return (
    <Layout>
      <ContentWrapper>
        <div className="max-w-[600px] mx-auto">
          <SingleChapter chapter={singleChapter[0]} />
        </div>
      </ContentWrapper>
    </Layout>
  );
};

export default page;
