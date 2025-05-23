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
<<<<<<< HEAD
    'sknlqNeWIExu3uu5Ev5zmsMHDmJwQKKNrnLWJajsA0zNHWmCyk2wjhkLBNqGzlTEdEAHbF7GJaKy41FSl9BPDKYTMFkEKrHk7Ve1DPexDXgR88PFpyoAZCExjnIA5F4K5ny568QM6rtqK8eAtQi9AKrkM7sk8EFku66rZ8N4ZVwbvUaNg1uw' // Only if you want to update content with the client
=======
    'sk54r2nXcFdkrMPuMjBJWMSXUSkBj5ViWBlcj48bVODlglHmHGpqFMT0yFYKLM7Fy6T99Rg1uDcP32Ahh55VivkaESBtuBNt9KyyZa9ohgGzBazibS7yG0SvWyXRvqzLoTgubC6NtiBr8BwScZpT6SLL93bv8e9Dnk06xw8c6hfW4AWD2F0S', // Only if you want to update content with the client
>>>>>>> master
});
