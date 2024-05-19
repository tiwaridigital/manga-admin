'use server';
import axios from 'axios';

export default async function getImageBuffer(url) {
  try {
    const res = await axios({
      method: 'get',
      url: url,
      responseType: 'arraybuffer',
    });

    return Buffer.from(res.data);
  } catch (error) {
    console.log('error getting bufferImage', error);
  }
}
