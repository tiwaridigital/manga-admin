import Chapters from '@/components/chapters/ChaptersList';
import Layout from '@/app/layout/Layout';
import fetchAllChapters from '@/lib/fetchAllChapters';

const page = async ({ params }) => {
  const chapters = await fetchAllChapters(params.id);
  return (
    <Layout>
      <Chapters chapters={chapters.chapters} />
    </Layout>
  );
};

export default page;
