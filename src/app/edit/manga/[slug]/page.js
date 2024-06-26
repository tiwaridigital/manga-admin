import Layout from '@/app/layout/Layout';
import EditManga from '@/components/manga/editManga/EditManga';
import ContentWrapper from '@/components/ContentWrapper';
import fetchSingleManga from '@/lib/fetchSingleManga';
import Sidebar from '@/components/manga/editManga/Sidebar';
import { unstable_noStore as noStore } from 'next/cache';

const Page = async ({ params }) => {
  noStore();
  const manga = await fetchSingleManga(params.slug);

  return (
    <Layout>
      <ContentWrapper>
        <div className="flex flex-col sm:flex-row justify-center max-w-[1024px] mx-auto gap-6">
          <EditManga manga={manga[0]} styles={'w-full sm:w-[70%]'} />
          <Sidebar manga={manga[0]} styles={'w-full sm:w-[35%]'} />
        </div>
      </ContentWrapper>
    </Layout>
  );
};

export default Page;

export const metadata = {
  title: 'Edit Manga',
};
