'use server';
import { inCompleteUploadFetchData } from '@/utils/admin/data/incomplete-upload/fetchData';

export async function inCompleteUploadFetchDataFromServer(
  src,
  url,
  mangaResult
) {
  const data = await inCompleteUploadFetchData(src, url, mangaResult);
  console.log('got data in inCompleteUploadFetchFromServer -> server action');
  return data;
}
