'use server';
import { fetchData } from '../../utils/admin/data/fetchData';

export async function fetchDataServerAction(src, url, isIncomplete = false) {
  const data = await fetchData(src, url);
  return data;
}
