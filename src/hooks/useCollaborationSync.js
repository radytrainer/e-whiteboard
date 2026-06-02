import { useCallback, useEffect, useId, useMemo, useRef } from 'react';
import { useBoardStore } from '../store/boardStore';

const DEFAULT_ROOM_ID = 'default';
const TITLE_STORAGE_PREFIX = 'math-khmer-whiteboard-title';

const getRoomTitleKey = (roomId) => `${TITLE_STORAGE_PREFIX}:${roomId || DEFAULT_ROOM_ID}`;

const sanitizeRoomId = (value) => {
  const cleaned = (value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return cleaned || DEFAULT_ROOM_ID;
};

const setRoomIdInUrl = (roomId) => {
  const url = new URL(window.location.href);
  if (roomId === DEFAULT_ROOM_ID) {
    url.searchParams.delete('room');
  } else {
    url.searchParams.set('room', roomId);
  }
  window.history.replaceState({}, '', url);
};

export const useCollaborationSync = ({ onRemoteUpdate } = {}) => {
  const roomId = useBoardStore((s) => s.roomId);
  const objects = useBoardStore((s) => s.objects);
  const setRoomId = useBoardStore((s) => s.setRoomId);
  const replaceObjects = useBoardStore((s) => s.replaceObjects);

  const channelRef = useRef(null);
  const skipNextBroadcastRef = useRef(false);
  const clientId = useId();

  const handleSetRoomId = useCallback(
    (nextRoomId) => setRoomId(sanitizeRoomId(nextRoomId)),
    [setRoomId]
  );

  const handleGetRoomTitleKey = useCallback(
    (nextRoomId) => getRoomTitleKey(nextRoomId),
    []
  );

  useEffect(() => {
    setRoomIdInUrl(roomId);

    if (channelRef.current) {
      channelRef.current.close();
    }

    const channel = new BroadcastChannel(`whiteboard-room:${roomId}`);
    channelRef.current = channel;

    channel.onmessage = (event) => {
      const message = event.data;
      if (!message || message.senderId === clientId) {
        return;
      }

      if (message.type === 'board-sync' && Array.isArray(message.objects)) {
        skipNextBroadcastRef.current = true;
        replaceObjects(message.objects, { persist: true });
        onRemoteUpdate?.();
      }
    };

    return () => {
      channel.close();
    };
  }, [clientId, onRemoteUpdate, replaceObjects, roomId]);

  useEffect(() => {
    if (!channelRef.current || roomId === DEFAULT_ROOM_ID) {
      return;
    }

    if (skipNextBroadcastRef.current) {
      skipNextBroadcastRef.current = false;
      return;
    }

    channelRef.current.postMessage({
      type: 'board-sync',
      roomId,
      objects,
      senderId: clientId,
      timestamp: new Date().toISOString(),
    });
  }, [clientId, objects, roomId]);

  const shareLink = useMemo(() => {
    const url = new URL(window.location.href);
    if (roomId === DEFAULT_ROOM_ID) {
      url.searchParams.delete('room');
    } else {
      url.searchParams.set('room', roomId);
    }
    return url.toString();
  }, [roomId]);

  const syncStatus = roomId === DEFAULT_ROOM_ID ? 'Solo board' : `Local live room: ${roomId}`;

  return {
    roomId,
    shareLink,
    syncStatus,
    setRoomId: handleSetRoomId,
    sanitizeRoomId,
    getRoomTitleKey: handleGetRoomTitleKey,
    defaultRoomId: DEFAULT_ROOM_ID,
  };
};
