'use server';
import { inCompleteUploadFetchData } from '@/utils/admin/data/incomplete-upload/fetchData';

export async function inCompleteUploadFetchDataFromServer(
  src,
  url,
  mangaResult,
) {
  const data = await inCompleteUploadFetchData(src, url, mangaResult);
  return data;
}
