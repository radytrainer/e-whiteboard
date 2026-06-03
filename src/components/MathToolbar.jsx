import { useState, useRef, useCallback } from 'react';
import { ChevronDown } from 'lucide-react';
import { useBoardStore } from '../store/boardStore';

const SYMBOL_GROUPS = [
  { label: 'Ops',   symbols: ['+', '−', '×', '÷', '=', '≠', '±'] },
  { label: 'Cmp',   symbols: ['<', '>', '≤', '≥'] },
  { label: 'Geo',   symbols: ['√', 'π', 'θ', '°', '%', '∞'] },
  { label: 'Calc',  symbols: ['∑', '∫', 'Δ', "∂"] },
  { label: 'Greek', symbols: ['α', 'β', 'γ', 'λ', 'μ', 'σ'] },
  { label: 'Frac',  symbols: ['½', '¼', '¾', '²', '³'] },
];

const ALL_SYMBOLS = SYMBOL_GROUPS.flatMap(g => g.symbols);

export default function MathToolbar() {
  const [collapsed, setCollapsed] = useState(false);
  const [pos, setPos] = useState(null);
  const panelRef = useRef(null);
  const dragOrigin = useRef(null);

  const { tool, addObject, textColor, textFont, scale, position } = useBoardStore();

  const onHeaderPointerDown = useCallback((e) => {
    if (e.button !== 0) return;
    if (e.target.closest('[data-nodrag]')) return;
    e.preventDefault();
    const rect = panelRef.current.getBoundingClientRect();
    setPos({ x: rect.left, y: rect.top });
    dragOrigin.current = {
      startX: e.clientX,
      startY: e.clientY,
      originX: rect.left,
      originY: rect.top,
    };
    const onMove = (me) => {
      const { startX, startY, originX, originY } = dragOrigin.current;
      setPos({
        x: Math.max(0, Math.min(window.innerWidth  - 80, originX + me.clientX - startX)),
        y: Math.max(0, Math.min(window.innerHeight - 60, originY + me.clientY - startY)),
      });
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup',   onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup',   onUp);
  }, []);

  if (tool !== 'math') return null;

  const handleSymbolClick = (symbol) => {
    window.dispatchEvent(new CustomEvent('insert-math-symbol', { detail: { symbol } }));
    const canvasX = (window.innerWidth / 2 - position.x) / scale;
    const canvasY = (window.innerHeight / 2 - position.y) / scale;
    addObject({
      type: 'text', text: symbol,
      x: canvasX - 25, y: canvasY - 25,
      fontSize: 36, fontColor: textColor, fontFamily: textFont,
      isBold: false, isItalic: false, isUnderline: false,
      align: 'left', rotation: 0, scaleX: 1, scaleY: 1,
    });
  };

  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        style={{ left: '16px', bottom: '16px' }}
        className="fixed z-40 w-10 h-10 rounded-full bg-white/95 dark:bg-zinc-900/95 shadow-xl border border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-center text-purple-500 text-base font-bold hover:scale-110 active:scale-95 transition-transform pointer-events-auto"
        title="Expand Math Symbols"
      >
        ∑
      </button>
    );
  }

  const panelStyle = pos
    ? { left: pos.x, top: pos.y }
    : { bottom: '1rem', left: '50%', transform: 'translateX(-50%)' };

  return (
    <div
      ref={panelRef}
      style={panelStyle}
      className="fixed z-40 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-zinc-200/50 dark:border-zinc-800/50 px-3 py-2.5 w-[min(95vw,580px)] pointer-events-auto animate-in slide-in-from-bottom-4 duration-200"
    >
      {/* Header — drag handle */}
      <div
        className="flex items-center justify-between mb-2 cursor-grab active:cursor-grabbing select-none touch-none"
        onPointerDown={onHeaderPointerDown}
      >
        <span className="text-[10px] font-bold uppercase tracking-widest text-purple-500 dark:text-purple-400 font-mono">
          ∑ Math Symbols
        </span>
        <button
          data-nodrag="true"
          onClick={() => setCollapsed(true)}
          title="Minimize"
          className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-all"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Symbols */}
      <div className="flex flex-wrap gap-1">
        {ALL_SYMBOLS.map((sym) => (
          <button
            key={sym}
            onClick={() => handleSymbolClick(sym)}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('source', 'math-symbol');
              e.dataTransfer.setData('text/plain', sym);
              e.dataTransfer.effectAllowed = 'copy';
            }}
            className="
              w-9 h-9 flex items-center justify-center
              text-base font-medium font-sans
              text-zinc-800 dark:text-zinc-200
              bg-white dark:bg-zinc-900
              border border-zinc-100 dark:border-zinc-800
              rounded-xl shadow-sm
              hover:bg-purple-600 hover:text-white hover:border-transparent hover:shadow-md
              active:scale-95
              transition-all duration-100
              cursor-grab active:cursor-grabbing
              select-none
            "
          >
            {sym}
          </button>
        ))}
      </div>
    </div>
  );
}
