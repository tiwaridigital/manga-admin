import Layout from '@/app/layout/Layout';
import ContentWrapper from '@/components/ContentWrapper';
import Create from '@/components/create/Create';
import React from 'react';

const websites = [
  {
    id: 1,
    name: 'Asuratoon',
    value: 'asuratoon',
    avatar: 'https://asuratoon.com/wp-content/uploads/2021/03/Group_1.png',
    url: 'https://asuratoon.com',
  },
  {
    id: 2,
    name: 'MangaDex',
    value: 'mangadex',
    avatar: 'https://avatars.githubusercontent.com/u/100574686?s=280&v=4',
    url: 'https://mangadex.org',
  },
  {
    id: 3,
    name: 'Toonily',
    value: 'toonily',
    avatar:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLiFZkbYRXtpXj9JV_f3tJqiw06ILgEgvwiev6OWjGmw&s',
    url: 'https://toonily.com/',
  },
];

const Page = () => {
  return (
    <Layout>
      <ContentWrapper>
        <Create websites={websites} />
      </ContentWrapper>
    </Layout>
  );
};

export default Page;
