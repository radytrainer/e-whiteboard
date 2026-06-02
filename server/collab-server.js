import { Buffer } from 'node:buffer';
import http from 'node:http';
import process from 'node:process';

const PORT = Number(process.env.COLLAB_PORT || 8787);
const rooms = new Map();

const ensureRoom = (roomId) => {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, {
      objects: [],
      updatedAt: new Date().toISOString(),
      clients: new Set(),
    });
  }

  return rooms.get(roomId);
};

const sendJson = (response, statusCode, payload) => {
  response.writeHead(statusCode, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
    'Content-Type': 'application/json',
  });
  response.end(JSON.stringify(payload));
};

const sendEvent = (response, payload) => {
  response.write(`data: ${JSON.stringify(payload)}\n\n`);
};

const getRoomIdFromPath = (pathname) => {
  const match = pathname.match(/^\/api\/rooms\/([^/]+?)(?:\/events)?$/);
  return match ? decodeURIComponent(match[1]) : null;
};

const readBody = async (request) => {
  const chunks = [];
  for await (const chunk of request) {
    chunks.push(chunk);
  }

  if (chunks.length === 0) {
    return {};
  }

  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
};

const broadcastRoom = (roomId, payload) => {
  const room = ensureRoom(roomId);
  room.clients.forEach((client) => {
    sendEvent(client, payload);
  });
};

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url || '/', `http://${request.headers.host}`);
  const roomId = getRoomIdFromPath(url.pathname);

  if (request.method === 'OPTIONS') {
    response.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
    });
    response.end();
    return;
  }

  if (url.pathname === '/api/health') {
    sendJson(response, 200, { ok: true });
    return;
  }

  if (!roomId) {
    sendJson(response, 404, { error: 'Not found' });
    return;
  }

  const room = ensureRoom(roomId);

  if (request.method === 'GET' && url.pathname.endsWith('/events')) {
    response.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'Content-Type': 'text/event-stream',
    });

    room.clients.add(response);
    sendEvent(response, {
      type: 'snapshot',
      roomId,
      objects: room.objects,
      updatedAt: room.updatedAt,
    });

    request.on('close', () => {
      room.clients.delete(response);
    });
    return;
  }

  if (request.method === 'GET') {
    sendJson(response, 200, {
      roomId,
      objects: room.objects,
      updatedAt: room.updatedAt,
    });
    return;
  }

  if (request.method === 'PUT') {
    try {
      const body = await readBody(request);
      room.objects = Array.isArray(body.objects) ? body.objects : [];
      room.updatedAt = new Date().toISOString();

      broadcastRoom(roomId, {
        type: 'board-update',
        roomId,
        senderId: body.senderId || null,
        objects: room.objects,
        updatedAt: room.updatedAt,
      });

      sendJson(response, 200, {
        ok: true,
        roomId,
        updatedAt: room.updatedAt,
      });
    } catch (error) {
      console.error('Unable to update room:', error);
      sendJson(response, 400, { error: 'Invalid room payload' });
    }
    return;
  }

  sendJson(response, 405, { error: 'Method not allowed' });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Collaboration server listening on http://0.0.0.0:${PORT}`);
});
