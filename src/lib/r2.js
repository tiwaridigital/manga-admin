// import { S3Client } from '@aws-sdk/client-s3';

// export const r2 = new S3Client({
//   region: 'auto',
//   endpoint:
//     'https://d15eb0203fe48da452c69098092ecf46.r2.cloudflarestorage.com/hola',
//   credentials: {
//     accessKeyId: '2450ff76908a0245b6fc75f45d078483',
//     secretAccessKey:
//       '06512b7125106b02372938ba7380b32ff5ab07a9961542f90db33c2bea525afc',
//   },
// });

import { S3Client } from '@aws-sdk/client-s3';

export const r2 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_UPLOAD_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY,
    secretAccessKey: process.env.R2_SECRET_KEY,
  },
});
