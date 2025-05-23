import { NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { r2 } from '@/lib/r2';

export async function POST(request) {
  const { fileName } = await request.json();
  console.log('fileName', fileName);
  try {
    console.log('Generating an upload URL!');

    const signedUrl = await getSignedUrl(
      r2,
      new PutObjectCommand({
        Bucket: 'hola',
        Key: fileName,
      }),
      { expiresIn: 60 },
    );

    console.log('signed url', signedUrl);

    console.log('Success generating upload URL!');

    return NextResponse.json({ msg: 'uploaded', url: signedUrl });
  } catch (err) {
    console.log('error', err);
  }
}
