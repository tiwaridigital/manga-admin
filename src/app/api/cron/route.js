import { createMangaFromUrl } from '@/helpers/manga/createMangaFromUrl';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { src, url } = await request.json();
  console.log('src', src);
  console.log('url', url);
  try {
    const result = await createMangaFromUrl(src, url);
    console.log('result', result);

    return NextResponse.json({ msg: 'success' });
  } catch (err) {
    console.log('error', err);
    return NextResponse.json({ error: err });
  }
}
