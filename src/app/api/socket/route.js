import { NextResponse } from 'next/server';

export const POST = async (req, res) => {
  console.log('req', req);
  const wss = new WebSocket.Server({
    port: '4000',
  });
  let clientSocket = null;
  console.log('wss', wss);

  wss.on('connection', (ws) => {
    ws.on('error', console.error);

    clientSocket = ws;
  });

  const sendUpdate = (message) => {
    console.log('sendUpdate called');
    if (clientSocket) {
      clientSocket.send(JSON.stringify(message));
    }
  };

  function getUploadResponse(response) {
    console.log('getUploadResponse Called');
    sendUpdate({
      progress: 10,
      message: 'kya baat hai jatta kya baat hai',
    });
  }

  getUploadResponse('Kya Baat Hai Jatta Kya Baat Hai');

  return NextResponse.json({ message: 'done' });
};
