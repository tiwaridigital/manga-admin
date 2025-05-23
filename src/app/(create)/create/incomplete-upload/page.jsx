import InComepleteUpload from '@/components/create/IncompleteUpload';
import React from 'react';
import { sanityClient } from '../../../../../sanityClient';
import Layout from '@/app/layout/Layout';
import ContentWrapper from '@/components/ContentWrapper';

const Page = async () => {
  const incompleteMangas = await sanityClient.fetch(
    `*[_type == "incompleteManga" && !(_id in path(\'drafts.**\'))]`
  );

  return (
    <Layout>
      <ContentWrapper>
        <InComepleteUpload incompleteMangas={incompleteMangas} />
      </ContentWrapper>
    </Layout>
  );
};

export default Page;
