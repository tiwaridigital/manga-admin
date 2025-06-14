// sanity.js
import { createClient } from 'next-sanity';
// Import using ESM URL imports in environments that supports it:
// import {createClient} from 'https://esm.sh/@sanity/client'

export const sanityClient = createClient({
  projectId: 'm74liu5s',
  dataset: 'production',
  useCdn: false, // set to `false` to bypass the edge cache
  apiVersion: '2023-05-03', // use current date (YYYY-MM-DD) to target the latest API version
  token:
    'sk54r2nXcFdkrMPuMjBJWMSXUSkBj5ViWBlcj48bVODlglHmHGpqFMT0yFYKLM7Fy6T99Rg1uDcP32Ahh55VivkaESBtuBNt9KyyZa9ohgGzBazibS7yG0SvWyXRvqzLoTgubC6NtiBr8BwScZpT6SLL93bv8e9Dnk06xw8c6hfW4AWD2F0S', // Only if you want to update content with the client
});
