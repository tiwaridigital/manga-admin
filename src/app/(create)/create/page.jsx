import Layout from '@/app/layout/Layout';
import ContentWrapper from '@/components/ContentWrapper';
import Create from '@/components/create/Create';
import React from 'react';
import { websitesList } from '@/constants/websites';


const Page = () => {
  return (
    <Layout>
      <ContentWrapper>
        <Create websites={websitesList} />
      </ContentWrapper>
    </Layout>
  );
};

export default Page;
