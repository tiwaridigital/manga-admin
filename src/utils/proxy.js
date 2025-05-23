import fs from 'fs';
import path from 'path';

export const getRandomProxy = () => {
  const proxyList = fs
    .readFileSync(path.resolve('proxies.txt'), 'utf-8')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const random = proxyList[Math.floor(Math.random() * proxyList.length)];

  const [ip, port, username, password] = random.split(':');
  return `http://${username}:${password}@${ip}:${port}`;
};
