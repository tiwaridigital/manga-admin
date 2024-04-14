// 'use client'
import Layout from '@/app/layout/Layout';
import { sanityClient } from '../../../../../sanityClient';
import IncompleteMangaList from '@/app/components/sanity/incomplete-manga/IncompleteMangaList';
import ContentWrapper from '@/app/components/ContentWrapper';
import { unstable_noStore } from 'next/cache';

const Page = async () => {
  unstable_noStore();
  const mangas = await sanityClient.fetch(
    `*[_type == "incompleteManga" && !(_id in path('drafts.**'))]`
  );
  return (
    <Layout>
      <ContentWrapper>
        <div className="my-8">
          <IncompleteMangaList data={mangas} />
        </div>
      </ContentWrapper>
    </Layout>
  );
};

export default Page;

export const metadata = {
  title: 'Sanity - Incomplete Manga',
};
