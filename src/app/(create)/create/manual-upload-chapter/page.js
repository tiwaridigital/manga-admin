import Layout from '@/app/layout/Layout';
import ContentWrapper from '@/components/ContentWrapper';
import ManualUploadChapterImages from '@/components/create/ManualUploadChapter/ManualUploadChapterImages';
import React from 'react';

const Page = () => {
  return (
    <Layout>
      <ContentWrapper>
        <ManualUploadChapterImages />
      </ContentWrapper>
    </Layout>
  );
};

export default Page;
