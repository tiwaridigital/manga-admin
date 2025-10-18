import MoveToHasura from '@/components/create/moveToHasura/MoveToHasura';
import React from 'react';
import { sanityClient } from '../../../../../sanityClient';
import Layout from '@/app/layout/Layout';
import ContentWrapper from '@/components/ContentWrapper';

const Page = async () => {
  const mangas = await sanityClient.fetch(
    `*[_type == "incompleteManga" && !isMovedToHasura]`
  );
  console.log('mangas', mangas);
  return (
    <Layout>
      <ContentWrapper>
        <MoveToHasura data={mangas} />
      </ContentWrapper>
    </Layout>
  );
};

export default Page;
