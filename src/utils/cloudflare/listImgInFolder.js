'use server';
import { ListObjectsV2Command } from '@aws-sdk/client-s3';
import { r2 } from '@/lib/r2';

export async function listImgInFolder(prefix) {
  const command = new ListObjectsV2Command({
    Bucket: 'nola',
    Prefix: prefix, // e.g. "nola/Makai.../chapter-0/"
  });

  const response = await r2.send(command);
  return response.Contents?.map((obj) => obj.Key);
}
