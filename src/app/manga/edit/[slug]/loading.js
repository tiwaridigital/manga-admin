import Layout from '@/app/layout/Layout';
import { Spinner } from '@nextui-org/react';

const Loading = () => {
  return (
    <Layout>
      <div className="h-[100vh] w-full flex justify-center items-center">
        <Spinner size="lg" color="primary" labelColor="primary" />
      </div>
    </Layout>
  );
};

export default Loading;
