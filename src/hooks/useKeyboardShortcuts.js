import { useEffect } from 'react';
import { useBoardStore } from '../store/boardStore';

export const useKeyboardShortcuts = (onShowNotification) => {
  const undo = useBoardStore((s) => s.undo);
  const redo = useBoardStore((s) => s.redo);
  const deleteObject = useBoardStore((s) => s.deleteObject);
  const duplicateObject = useBoardStore((s) => s.duplicateObject);
  const saveBoardState = useBoardStore((s) => s.saveBoardState);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check if user is typing in a form input, textarea, or contentEditable
      const target = e.target;
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      if (isInput) {
        // Allow undo/redo/duplicate inside input only if we handle it naturally
        // But block deleting the whole object while deleting text inside input
        return;
      }

      const isCtrl = e.ctrlKey || e.metaKey;
      const key = e.key.toLowerCase();

      if (isCtrl && key === 'z') {
        e.preventDefault();
        undo();
        if (onShowNotification) onShowNotification('Undo');
      } else if (isCtrl && key === 'y') {
        e.preventDefault();
        redo();
        if (onShowNotification) onShowNotification('Redo');
      } else if (isCtrl && key === 's') {
        e.preventDefault();
        saveBoardState();
        if (onShowNotification) onShowNotification('Board saved offline!');
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        deleteObject();
        if (onShowNotification) onShowNotification('Item deleted');
      } else if (isCtrl && key === 'd') {
        e.preventDefault();
        duplicateObject();
        if (onShowNotification) onShowNotification('Item duplicated');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [undo, redo, deleteObject, duplicateObject, saveBoardState, onShowNotification]);
};
