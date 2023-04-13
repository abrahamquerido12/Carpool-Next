import { GetServerSidePropsContext } from 'next';
import MainLayout from '../layouts/MainLayout';

export default function Home() {
  return <MainLayout>a</MainLayout>;
}

// redirect to /login if user is not authenticated
export async function getServerSideProps(context: GetServerSidePropsContext) {
  console.log('context', context);

  const { req, res } = context;
  if (!req.cookies.token) {
    res.writeHead(302, { Location: '/login' });
    res.end();
  }
  return {
    props: {},
  };
}
