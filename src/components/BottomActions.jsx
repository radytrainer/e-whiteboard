import { useState } from 'react';
import {
  Undo2,
  Redo2,
  Trash2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
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
    scale,
    setScale,
    resetView,
  } = useBoardStore();

  const [isOpen, setIsOpen] = useState(true);

  const handleZoomIn = () => setScale(Math.min(15, scale * 1.15));
  const handleZoomOut = () => setScale(Math.max(0.15, scale / 1.15));
  const handleReset = () => resetView();

  const btnBase = 'p-2 rounded-lg transition-all focus:outline-none cursor-pointer';
  const btnNormal = `${btnBase} text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white`;
  const btnDisabled = `${btnBase} disabled:opacity-30 disabled:cursor-default disabled:hover:bg-transparent`;

  return (
    <div className="flex items-center gap-1 bg-white/85 dark:bg-zinc-900/85 backdrop-blur-md rounded-2xl shadow-xl border border-zinc-200/50 dark:border-zinc-800/50 p-1.5 transition-all duration-300">

      {/* Collapse / expand toggle — always visible */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        title={isOpen ? 'Collapse' : 'Expand'}
        className={`${btnNormal} text-zinc-400`}
      >
        {isOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Expandable content */}
      <div
        className={`flex items-center gap-1 transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-w-xs opacity-100' : 'max-w-0 opacity-0 pointer-events-none'
        }`}
      >
        {/* Divider */}
        <div className="w-[1px] h-5 bg-zinc-200 dark:bg-zinc-800 mx-0.5" />

        {/* ── Undo / Redo / Delete ── */}
        <button
          onClick={undo}
          disabled={undoStack.length === 0}
          title="Undo (Ctrl+Z)"
          className={`${btnNormal} ${btnDisabled}`}
        >
          <Undo2 className="w-4 h-4" />
        </button>

        <button
          onClick={redo}
          disabled={redoStack.length === 0}
          title="Redo (Ctrl+Y)"
          className={`${btnNormal} ${btnDisabled}`}
        >
          <Redo2 className="w-4 h-4" />
        </button>

        <button
          onClick={() => deleteObject()}
          disabled={!selectedId}
          title="Delete Selection (Del)"
          className={`${btnBase} text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 disabled:opacity-30 disabled:cursor-default disabled:hover:bg-transparent`}
        >
          <Trash2 className="w-4 h-4" />
        </button>

        {/* Divider */}
        <div className="w-[1px] h-5 bg-zinc-200 dark:bg-zinc-800 mx-0.5" />

        {/* ── Zoom controls ── */}
        <button onClick={handleZoomOut} title="Zoom Out" className={btnNormal}>
          <ZoomOut className="w-4 h-4" />
        </button>

        <button
          onClick={handleReset}
          title="Reset Zoom & View"
          className="px-2 py-1.5 rounded-lg text-xs font-mono font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-all focus:outline-none cursor-pointer min-w-[3.5rem] text-center"
        >
          {Math.round(scale * 100)}%
        </button>

        <button onClick={handleZoomIn} title="Zoom In" className={btnNormal}>
          <ZoomIn className="w-4 h-4" />
        </button>

        <button onClick={handleReset} title="Recenter" className={btnNormal}>
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
