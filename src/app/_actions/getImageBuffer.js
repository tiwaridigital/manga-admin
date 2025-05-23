'use server';
import { getRandomProxy } from '@/utils/proxy';
import axios from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';

const proxy = getRandomProxy();
const agent = new HttpsProxyAgent(proxy);

export default async function getImageBuffer(url) {
  try {
    const res = await axios({
      method: 'get',
      url: url,
      responseType: 'arraybuffer',
      httpsAgent: agent,
      proxy: false,
      timeout: 7000,
    });

    return Buffer.from(res.data);
  } catch (error) {
    console.log('error getting bufferImage', error);
  }
}
