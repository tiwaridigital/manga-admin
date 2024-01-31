import Layout from '@/app/layout/Layout';
import EditManga from '@/app/components/manga/editManga/EditManga';
import ContentWrapper from '@/app/components/ContentWrapper';
import fetchSingleManga from '@/lib/fetchSingleManga';

const Page = async ({ params }) => {
  // await new Promise((resolve) => setTimeout(resolve, 2000));
  const manga = await fetchSingleManga(params.slug);
  console.log('singlemanga', manga);
  return (
    <Layout>
      <ContentWrapper>
        <div className="flex justify-center max-w-[700px] mx-auto">
          <EditManga manga={manga[0]} />
        </div>
      </ContentWrapper>
    </Layout>
  );
};

export default Page;

export const metadata = {
  title: 'Edit Manga',
};
