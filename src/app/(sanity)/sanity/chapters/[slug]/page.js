import SanityChaptersList from '@/components/sanity/chapters/SanityChaptersList';
import { sanityClient } from '../../../../../../sanityClient';
import ContentWrapper from '@/components/ContentWrapper';
import Layout from '@/app/layout/Layout';
import { unstable_noStore } from 'next/cache';

const Page = async ({ params }) => {
  unstable_noStore();
  const chapters = await sanityClient.fetch(
    `*[_type == "chapters" && url._ref == "${params.slug}"] | order(_createdAt desc)`
  );

  const mangaQuery = `*[_type == "incompleteManga" && _id == "${params.slug}"]`;
  const manga = await sanityClient.fetch(mangaQuery);

  return (
    <Layout>
      <ContentWrapper>
        <SanityChaptersList chapters={chapters} manga={manga[0]} />
      </ContentWrapper>
    </Layout>
  );
};

export default Page;
