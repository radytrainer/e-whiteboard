import { create } from 'zustand';

const OBJECTS_STORAGE_PREFIX = 'math-khmer-whiteboard-objects';
const SETTINGS_STORAGE_KEY = 'math-khmer-whiteboard-settings';

const getObjectsStorageKey = (roomId = 'default') => `${OBJECTS_STORAGE_PREFIX}:${roomId}`;

const persistObjects = (objects, roomId = 'default') => {
  localStorage.setItem(getObjectsStorageKey(roomId), JSON.stringify(objects));
};

const getInitialRoomId = () => {
  if (typeof window === 'undefined') {
    return 'default';
  }

  const params = new URLSearchParams(window.location.search);
  const rawRoomId = (params.get('room') || 'default')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return rawRoomId || 'default';
};

// Retrieve initial objects from localStorage
const getSavedObjects = (roomId = 'default') => {
  try {
    const saved = localStorage.getItem(getObjectsStorageKey(roomId));
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error loading board state:', error);
    return [];
  }
};

// Retrieve initial settings
const getSavedSettings = () => {
  try {
    const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        theme: parsed.theme || 'light',
        background: parsed.background || 'grid',
        bgColor: parsed.bgColor || '#ffffff',
        gridSize: parsed.gridSize || 40,
        gridOpacity: parsed.gridOpacity !== undefined ? parsed.gridOpacity : 0.15,
        paperSize: parsed.paperSize || 'none',
        paperOrientation: parsed.paperOrientation || 'portrait',
      };
    }
  } catch (error) {
    console.error('Error loading settings:', error);
  }
  return {
    theme: 'light',
    background: 'grid',
    bgColor: '#ffffff',
    gridSize: 40,
    gridOpacity: 0.15,
    paperSize: 'none',
    paperOrientation: 'portrait',
  };
};

export const useBoardStore = create((set, get) => {
  const initialSettings = getSavedSettings();
  const initialRoomId = getInitialRoomId();

  return {
    // Stage State
    roomId: initialRoomId,
    objects: getSavedObjects(initialRoomId),
    selectedId: null,
    selectedIds: [], // multi-select
    tool: 'select', // 'select' | 'pan' | 'pencil' | 'eraser' | 'text' | 'sticky' | 'image'
    
    // Canvas View State
    scale: 1,
    position: { x: 0, y: 0 },
    
    // Canvas Style / Appearance Settings
    theme: initialSettings.theme,
    background: initialSettings.background, // 'plain' | 'grid' | 'dotted' | 'lined'
    bgColor: initialSettings.bgColor,
    gridSize: initialSettings.gridSize,
    gridOpacity: initialSettings.gridOpacity,
    paperSize: initialSettings.paperSize,             // 'none'|'a5'|'a4'|'a3'|'letter'|'legal'
    paperOrientation: initialSettings.paperOrientation, // 'portrait'|'landscape'

    // Active tool options
    pencilColor: '#aa3bff',
    pencilWidth: 4,
    eraserWidth: 30,
    textColor: '#1f2937',
    textSize: 28,
    textFont: 'Inter',
    stickyColor: '#fef08a', // Yellow default
    shapeType: 'square', // 'square' | 'circle' | 'triangle' | 'line' | 'polygon'
    shapeSides: 5,
    shapeStroke: '#aa3bff',
    shapeFill: 'rgba(170, 59, 255, 0.15)',

    // History Stacks
    undoStack: [],
    redoStack: [],

    // ----------------------------------------------------
    // ACTIONS
    // ----------------------------------------------------

    setTool: (tool) => set({ tool, selectedId: null, selectedIds: [] }),
    setSelectedId: (selectedId) => set({ selectedId, selectedIds: selectedId ? [selectedId] : [] }),
    setSelectedIds: (selectedIds) => set({ selectedIds, selectedId: selectedIds[0] ?? null }),
    setRoomId: (roomId) => {
      const safeRoomId = roomId || 'default';
      const roomObjects = getSavedObjects(safeRoomId);
      set({
        roomId: safeRoomId,
        objects: roomObjects,
        selectedId: null,
        selectedIds: [],
        undoStack: [],
        redoStack: [],
      });
    },

    selectAll: () => {
      const { objects } = get();
      const ids = objects.map((o) => o.id);
      set({ selectedIds: ids, selectedId: ids[0] ?? null });
    },
    
    setScale: (scale) => set({ scale }),
    setPosition: (position) => set({ position }),
    
    resetView: () => set({ scale: 1, position: { x: 0, y: 0 } }),

    setPencilColor: (pencilColor) => set({ pencilColor }),
    setPencilWidth: (pencilWidth) => set({ pencilWidth }),
    setEraserWidth: (eraserWidth) => set({ eraserWidth }),
    setTextColor: (textColor) => set({ textColor }),
    setTextSize: (textSize) => set({ textSize }),
    setTextFont: (textFont) => set({ textFont }),
    setStickyColor: (stickyColor) => set({ stickyColor }),
    setShapeType: (shapeType) => set({ shapeType }),
    setShapeSides: (shapeSides) => set({ shapeSides }),
    setShapeStroke: (shapeStroke) => set({ shapeStroke }),
    setShapeFill: (shapeFill) => set({ shapeFill }),

    // Appearance configurations
    setTheme: (theme) => {
      set({ theme });
      get().saveSettingsToStorage();
    },
    setBackground: (background) => {
      set({ background });
      get().saveSettingsToStorage();
    },
    setBgColor: (bgColor) => {
      set({ bgColor });
      get().saveSettingsToStorage();
    },
    setGridSize: (gridSize) => {
      set({ gridSize });
      get().saveSettingsToStorage();
    },
    setGridOpacity: (gridOpacity) => {
      set({ gridOpacity });
      get().saveSettingsToStorage();
    },
    setPaperSize: (paperSize) => {
      set({ paperSize });
      get().saveSettingsToStorage();
    },
    setPaperOrientation: (paperOrientation) => {
      set({ paperOrientation });
      get().saveSettingsToStorage();
    },

    // Save settings to Storage
    saveSettingsToStorage: () => {
      const state = get();
      const settings = {
        theme: state.theme,
        background: state.background,
        bgColor: state.bgColor,
        gridSize: state.gridSize,
        gridOpacity: state.gridOpacity,
        paperSize: state.paperSize,
        paperOrientation: state.paperOrientation,
      };
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    },

    // History helpers
    saveHistory: () => {
      const currentObjects = get().objects;
      const undoStack = [...get().undoStack];
      
      // Limit size of undo history stack
      if (undoStack.length >= 50) {
        undoStack.shift();
      }
      
      // Deep clone current objects to avoid mutations in the history stack
      const snapshot = JSON.parse(JSON.stringify(currentObjects));
      
      set({
        undoStack: [...undoStack, snapshot],
        redoStack: [], // Reset redo stack when a new change is made
      });
      
      // Auto-save objects to LocalStorage
      persistObjects(currentObjects, get().roomId);
    },

    undo: () => {
      const { undoStack, objects, redoStack } = get();
      if (undoStack.length === 0) return;

      const previous = undoStack[undoStack.length - 1];
      const newUndoStack = undoStack.slice(0, -1);
      const currentSnapshot = JSON.parse(JSON.stringify(objects));

      set({
        objects: previous,
        undoStack: newUndoStack,
        redoStack: [...redoStack, currentSnapshot],
        selectedId: null,
        selectedIds: [],
      });

      persistObjects(previous, get().roomId);
    },

    redo: () => {
      const { redoStack, objects, undoStack } = get();
      if (redoStack.length === 0) return;

      const next = redoStack[redoStack.length - 1];
      const newRedoStack = redoStack.slice(0, -1);
      const currentSnapshot = JSON.parse(JSON.stringify(objects));

      set({
        objects: next,
        undoStack: [...undoStack, currentSnapshot],
        redoStack: newRedoStack,
        selectedId: null,
        selectedIds: [],
      });

      persistObjects(next, get().roomId);
    },

    // Objects CRUD
    addObject: (obj) => {
      const id = obj.id || `obj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newObj = { ...obj, id };
      
      // Save history BEFORE appending
      get().saveHistory();

      set((state) => ({
        objects: [...state.objects, newObj],
        selectedId: id,
        selectedIds: [id],
      }));

      // Update LocalStorage
      persistObjects(get().objects, get().roomId);
    },

    updateObject: (id, updates) => {
      // For updates, we usually save history on drag/transform END, not during,
      // so this action updates immediately, and components should call saveHistory() upon completion.
      set((state) => {
        const updatedObjects = state.objects.map((obj) => {
          if (obj.id === id) {
            return { ...obj, ...updates };
          }
          return obj;
        });

        // Auto-save to LocalStorage
        persistObjects(updatedObjects, get().roomId);
        return { objects: updatedObjects };
      });
    },

    deleteObject: (id) => {
      // Support single id, selectedId, OR all selectedIds
      const { selectedId, selectedIds } = get();
      const targets = id
        ? [id]
        : selectedIds.length > 0
        ? selectedIds
        : selectedId
        ? [selectedId]
        : [];

      if (targets.length === 0) return;

      get().saveHistory();

      set((state) => {
        const remaining = state.objects.filter((obj) => !targets.includes(obj.id));
        persistObjects(remaining, get().roomId);
        return {
          objects: remaining,
          selectedId: null,
          selectedIds: [],
        };
      });
    },

    duplicateObject: (id) => {
      const targetId = id || get().selectedId;
      if (!targetId) return;

      const objToClone = get().objects.find((o) => o.id === targetId);
      if (!objToClone) return;

      get().saveHistory();

      // Deep clone and offset slightly
      const clone = JSON.parse(JSON.stringify(objToClone));
      clone.id = `obj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      clone.x += 30;
      clone.y += 30;

      set((state) => {
        const newObjects = [...state.objects, clone];
        persistObjects(newObjects, get().roomId);
        return {
          objects: newObjects,
          selectedId: clone.id,
          selectedIds: [clone.id],
        };
      });
    },

    clearBoard: () => {
      if (get().objects.length === 0) return;

      get().saveHistory();

      set({
        objects: [],
        selectedId: null,
        selectedIds: [],
      });

      persistObjects([], get().roomId);
    },

    replaceObjects: (objects, options = {}) => {
      const { persist = true } = options;
      const safeObjects = Array.isArray(objects) ? objects : [];
      set({
        objects: safeObjects,
        selectedId: null,
        selectedIds: [],
      });
      if (persist) {
        persistObjects(safeObjects, get().roomId);
      }
    },

    // Trigger local save manually if needed
    saveBoardState: () => {
      persistObjects(get().objects, get().roomId);
    }
  };
});
