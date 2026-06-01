import { useState } from 'react';
import { useBoardStore } from '../store/boardStore';

export default function MathToolbar() {
  const { addObject, textColor, textFont, scale, position } = useBoardStore();
  const [collapsed, setCollapsed] = useState(false);

  const symbolGroups = [
    {
      name: 'Operators',
      symbols: ['+', '−', '×', '÷', '=', '≠'],
    },
    {
      name: 'Comparison',
      symbols: ['<', '>', '≤', '≥'],
    },
    {
      name: 'Geometry & Algebra',
      symbols: ['√', 'π', 'θ', '°', '%'],
    },
    {
      name: 'Advanced',
      symbols: ['∞', '∑', '∫', 'Δ', 'α', 'β', 'γ', 'λ'],
    },
  ];

  const handleSymbolClick = (symbol) => {
    // 1. Dispatch custom event. If an active text editor textarea is focused,
    // it will capture this and append it at the cursor.
    const event = new CustomEvent('insert-math-symbol', { detail: { symbol } });
    const handled = window.dispatchEvent(event);

    // If no text editor handles the insertion (no active text editing), 
    // we create a new text object at the center of the canvas viewport.
    if (!handled) {
      // Math: center of screen relative to canvas offset/zoom
      const canvasX = (window.innerWidth / 2 - position.x) / scale;
      const canvasY = (window.innerHeight / 2 - position.y) / scale;

      addObject({
        type: 'text',
        text: symbol,
        x: canvasX - 25,
        y: canvasY - 25,
        fontSize: 36,
        fontColor: textColor,
        fontFamily: textFont,
        isBold: false,
        isItalic: false,
        isUnderline: false,
        align: 'left',
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
      });
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Collapse toggle handle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="px-4 py-1.5 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-t-xl border-t border-x border-zinc-200/50 dark:border-zinc-800/50 text-xs font-medium text-zinc-500 dark:text-zinc-400 shadow-lg hover:text-purple-600 dark:hover:text-purple-400 transition-all focus:outline-none"
      >
        {collapsed ? 'Show Math Symbols' : 'Hide Math Symbols'}
      </button>

      {/* Math symbols floating dock */}
      <div
        className={`bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-b-2xl md:rounded-2xl shadow-2xl border border-zinc-200/50 dark:border-zinc-800/50 p-3 flex flex-wrap md:flex-nowrap items-center gap-4 transition-all duration-300 ${
          collapsed 
            ? 'h-0 py-0 opacity-0 pointer-events-none overflow-hidden translate-y-4' 
            : 'h-auto opacity-100'
        }`}
      >
        {symbolGroups.map((group) => (
          <div key={group.name} className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 font-mono">
              {group.name}
            </span>
            <div className="flex items-center gap-1 bg-zinc-50 dark:bg-zinc-950 p-1 rounded-xl border border-zinc-200/30 dark:border-zinc-800/30">
              {group.symbols.map((sym) => (
                <button
                  key={sym}
                  onClick={() => handleSymbolClick(sym)}
                  draggable={true}
                  onDragStart={(e) => {
                    e.dataTransfer.setData('source', 'math-symbol');
                    e.dataTransfer.setData('text/plain', sym);
                    e.dataTransfer.effectAllowed = 'copy';
                  }}
                  className="w-9 h-9 flex items-center justify-center text-lg font-medium font-sans text-zinc-800 dark:text-zinc-200 hover:bg-purple-600 hover:text-white rounded-lg transition-all active:scale-95 shadow-sm hover:shadow-md bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/50 cursor-grab active:cursor-grabbing"
                >
                  {sym}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
