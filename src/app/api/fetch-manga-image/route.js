// pages/api/fetch-manga-image.ts
import axios from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { getRandomProxy } from '@/utils/proxy'; // adjust path accordingly
import { MANGA } from '@consumet/extensions';
import apiHost from '@/lib/apiHost';

export async function POST(req, res) {
  const body = await req.json();
  const { title } = body;
  try {
    const mangaDex = new MANGA.MangaDex();
    const results = await mangaDex.search(title);
    console.log('results', results);

    const coverUrl = results.results[0]?.image;
    if (!coverUrl) return res.status(404).json({ error: 'No cover found' });

    const proxy = getRandomProxy();
    const agent = new HttpsProxyAgent(proxy);

    // const proxy = 'http://ygyfhhsc:n78xyclqjet0@198.23.239.134:6540';
    // const agent = new HttpsProxyAgent(proxy);

    // Download image using the proxy
    let imageResp = await axios.get(coverUrl, {
      responseType: 'arraybuffer',
      httpsAgent: agent,
      proxy: false,
      timeout: 7000,
    });

    const imageBuffer = Buffer.from(imageResp.data);

    const response = await fetch(`${apiHost}/api/cloudFlareUpload`, {
      method: 'POST',
      body: JSON.stringify({
        fileName: 'hello-cover.jpg',
      }),
    });

    const { url } = await response.json();
    console.log('response url', url);

    const uploaded = await fetch(url, {
      method: 'PUT',
      body: imageBuffer,
    });

    return Response.json({ s3Url: uploaded });
  } catch (error) {
    console.error('Failed:', error);
    return Response.json({ error: error });
  }
}
