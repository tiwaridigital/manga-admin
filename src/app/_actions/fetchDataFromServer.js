'use server';
import { fetchDataNew } from '@/utils/admin/data/fetchDataNew';
import { fetchData } from '../../utils/admin/data/fetchData';

export async function fetchDataServerAction(src, url, isIncomplete = false) {
  // const data = await fetchData(src, url);
  const data = await fetchDataNew(src, url);
  return data;
}
