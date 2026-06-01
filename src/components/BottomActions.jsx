import { useState } from 'react';
import { 
  Undo2, 
  Redo2, 
  Trash2,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { useBoardStore } from '../store/boardStore';

export default function BottomActions() {
  const {
    selectedId,
    deleteObject,
    undo,
    redo,
    undoStack,
    redoStack,
  } = useBoardStore();

  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex items-center gap-1.5 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-xl shadow-lg border border-zinc-200/50 dark:border-zinc-800/50 p-1.5 transition-all duration-300">
      {/* Toggle collapse button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        title={isOpen ? "Hide Actions" : "Show Actions"}
        className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
      >
        {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>

      {/* Expanded Actions Shelf */}
      <div 
        className={`flex items-center gap-1 transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-w-xs opacity-100' : 'max-w-0 opacity-0 pointer-events-none'
        }`}
      >
        {/* Divider */}
        <div className="w-[1px] h-4 bg-zinc-300 dark:bg-zinc-800 mx-1" />

        {/* Undo */}
        <button
          onClick={undo}
          disabled={undoStack.length === 0}
          title="Undo (Ctrl+Z)"
          className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
        >
          <Undo2 className="w-4 h-4" />
        </button>

        {/* Redo */}
        <button
          onClick={redo}
          disabled={redoStack.length === 0}
          title="Redo (Ctrl+Y)"
          className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
        >
          <Redo2 className="w-4 h-4" />
        </button>

        {/* Delete Active Object */}
        <button
          onClick={() => deleteObject()}
          disabled={!selectedId}
          title="Delete Selection (Del)"
          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
