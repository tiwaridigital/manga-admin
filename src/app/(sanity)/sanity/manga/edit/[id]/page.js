import MangaEdit from '@/components/sanity/incomplete-manga/MangaEdit';
import Layout from '@/app/layout/Layout';
import ContentWrapper from '@/components/ContentWrapper';
import { sanityClient } from '../../../../../../../sanityClient';
import MangaEditSidebar from '@/components/sanity/incomplete-manga/MangaEditSidebar';

const Page = async ({ params }) => {
  const mangaQuery = `*[_type == "incompleteManga" && _id == "${params.id}"]`;
  const manga = await sanityClient.fetch(mangaQuery);
  console.log('manga', manga);

  return (
    <Layout>
      <ContentWrapper>
        <div className="flex flex-col sm:flex-row justify-center max-w-[1200px] mx-auto gap-6">
          <MangaEdit manga={manga[0]} styles={'w-full sm:w-[70%]'} />
          <MangaEditSidebar manga={manga[0]} styles={'w-full sm:w-[35%]'} />
        </div>
      </ContentWrapper>
    </Layout>
  );
};

export default Page;
