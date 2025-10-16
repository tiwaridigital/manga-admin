'use server';

import { getRandomProxy } from '@/utils/proxy';
import axios from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';

/**
 * Fetches image as buffer with optional proxy usage.
 * @param {string} url - Image URL
 * @param {boolean} useProxy - Whether to use a proxy (default: false)
 */
export default async function getImageBuffer(url, useProxy = true) {
  try {
    let httpsAgent;

    if (useProxy) {
      const proxy = getRandomProxy();
      httpsAgent = new HttpsProxyAgent(proxy);
      console.log('Using proxy:', proxy);
    }

    const res = await axios({
      method: 'get',
      url,
      responseType: 'arraybuffer',
      httpsAgent: httpsAgent || undefined,
      proxy: false, // disable axios's default proxy handling
      timeout: 7000,
    });

    return Buffer.from(res.data);
  } catch (error) {
    console.error('error getting bufferImage', error.message);
  }
}
