// pages/api/proxy.js
import axios from 'axios';

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing URL parameter' });
  }

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0',
        // Add more headers here if the target site requires them
      },
    });

    res.setHeader('Content-Type', response.headers['content-type']);
    res.status(200).send(response.data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    res
      .status(500)
      .json({ error: 'Failed to fetch the resource', details: error.message });
  }
}
