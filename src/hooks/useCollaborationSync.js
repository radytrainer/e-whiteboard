import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { useBoardStore } from '../store/boardStore';

const DEFAULT_ROOM_ID = 'default';

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

const getApiBaseUrl = () => {
  const base = import.meta.env.VITE_COLLAB_SERVER_URL;
  return base ? base.replace(/\/$/, '') : '';
};

export const useCollaborationSync = ({ onRemoteUpdate } = {}) => {
  const roomId = useBoardStore((s) => s.roomId);
  const objects = useBoardStore((s) => s.objects);
  const setRoomId = useBoardStore((s) => s.setRoomId);
  const replaceObjects = useBoardStore((s) => s.replaceObjects);

  const clientId = useId();
  const syncAbortRef = useRef(null);
  const isApplyingRemoteRef = useRef(false);
  const isHydratedRef = useRef(false);
  const [connectionState, setConnectionState] = useState({
    mode: 'connecting',
    roomId,
  });

  const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);
  const roomApiUrl = useMemo(
    () => `${apiBaseUrl}/api/rooms/${encodeURIComponent(roomId)}`,
    [apiBaseUrl, roomId]
  );

  const handleSetRoomId = useCallback(
    (nextRoomId) => setRoomId(sanitizeRoomId(nextRoomId)),
    [setRoomId]
  );

  useEffect(() => {
    setRoomIdInUrl(roomId);
  }, [roomId]);

  useEffect(() => {
    isHydratedRef.current = false;
    syncAbortRef.current?.abort();

    const abortController = new AbortController();
    syncAbortRef.current = abortController;

    const loadRoom = async () => {
      try {
        const response = await fetch(roomApiUrl, {
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error(`Room fetch failed with ${response.status}`);
        }

        const payload = await response.json();
        isApplyingRemoteRef.current = true;
        replaceObjects(payload.objects || [], { persist: true });
        isHydratedRef.current = true;
        setConnectionState({ mode: 'live', roomId });
      } catch (error) {
        if (abortController.signal.aborted) {
          return;
        }

        console.error('Unable to load collaboration room:', error);
        setConnectionState({ mode: 'unavailable', roomId });
      }
    };

    loadRoom();

    const eventSource = new EventSource(`${roomApiUrl}/events`);
    eventSource.onopen = () => {
      setConnectionState({ mode: 'live', roomId });
    };

    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (!payload || payload.senderId === clientId) {
          return;
        }

        if (payload.type === 'snapshot' || payload.type === 'board-update') {
          isApplyingRemoteRef.current = true;
          replaceObjects(payload.objects || [], { persist: true });
          isHydratedRef.current = true;
          onRemoteUpdate?.();
        }
      } catch (error) {
        console.error('Unable to process collaboration event:', error);
      }
    };

    eventSource.onerror = () => {
      setConnectionState({ mode: 'retrying', roomId });
    };

    return () => {
      abortController.abort();
      eventSource.close();
    };
  }, [clientId, onRemoteUpdate, replaceObjects, roomApiUrl, roomId]);

  useEffect(() => {
    if (!isHydratedRef.current) {
      return;
    }

    if (isApplyingRemoteRef.current) {
      isApplyingRemoteRef.current = false;
      return;
    }

    const abortController = new AbortController();

    const syncRoom = async () => {
      try {
        const response = await fetch(roomApiUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            senderId: clientId,
            objects,
          }),
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error(`Room sync failed with ${response.status}`);
        }

        setConnectionState({ mode: 'live', roomId });
      } catch (error) {
        if (abortController.signal.aborted) {
          return;
        }

        console.error('Unable to sync collaboration room:', error);
        setConnectionState({ mode: 'sync-error', roomId });
      }
    };

    syncRoom();

    return () => {
      abortController.abort();
    };
  }, [clientId, objects, roomApiUrl, roomId]);

  const shareLink = useMemo(() => {
    const url = new URL(window.location.href);
    if (roomId === DEFAULT_ROOM_ID) {
      url.searchParams.delete('room');
    } else {
      url.searchParams.set('room', roomId);
    }
    return url.toString();
  }, [roomId]);

  const syncStatus = useMemo(() => {
    if (connectionState.roomId !== roomId) {
      return `Connecting to room ${roomId}...`;
    }

    if (connectionState.mode === 'live') {
      return `Live with others in room ${roomId}`;
    }

    if (connectionState.mode === 'retrying') {
      return 'Connection lost - retrying...';
    }

    if (connectionState.mode === 'sync-error') {
      return 'Unable to send updates';
    }

    if (connectionState.mode === 'unavailable') {
      return 'Collaboration server unavailable';
    }

    return `Connecting to room ${roomId}...`;
  }, [connectionState, roomId]);

  return {
    roomId,
    shareLink,
    syncStatus,
    setRoomId: handleSetRoomId,
    sanitizeRoomId,
    defaultRoomId: DEFAULT_ROOM_ID,
  };
};
