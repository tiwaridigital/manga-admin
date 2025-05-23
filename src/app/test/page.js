'use client';
import { fetchMangaAction } from '@/actions/fetchMangaAction';
import { useEffect } from 'react';
import client from '../../../client';
import { sanityClient } from '../../../sanityClient';

const Page = () => {
  const getData = async () => {
    const data = await fetchMangaAction(
      'MangaReader',
      'science-fell-in-love-so-i-tried-to-prove-it-3433',
    );
    console.log(data);
  };

  useEffect(() => {
    // getData();
    const fetchData = async () => {
      console.log('fetchData called');
      // Client-side
      const response = await fetch('http://localhost:3000/api/fetch-manga', {
        method: 'POST',
        body: JSON.stringify({
          providerName: 'MangaPill',
          mangaId: '8824/sentou-to-vampire',
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      console.log('data', data);
    };

    fetchData();
  }, []);

  const deleteSanity = async () => {
    const docs = await sanityClient.fetch(`*[_type == "chapters"]._id`);
    console.log(`Deleting ${docs.length} documents...`);

    for (const id of docs) {
      await sanityClient.delete(id);
      console.log(`Deleted ${id}`);
    }

    console.log('✅ All incompleteManga documents deleted.');
  };

  return (
    <>
      Page
      <button onClick={deleteSanity}>Delete Sanity</button>
    </>
  );
};

export default Page;
