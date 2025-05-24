const isLocal = process.env.NODE_ENV === 'development';

const apiHost = isLocal
  ? 'http://localhost:3000'
  : 'https://manga-admin-three.vercel.app';

export default apiHost;
