import { X } from 'lucide-react';
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
  const { tool, setTool, addObject, textColor, textFont, scale, position } = useBoardStore();

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

  return (
    <div className="
      bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md
      rounded-2xl shadow-2xl border border-zinc-200/50 dark:border-zinc-800/50
      px-3 py-2.5
      w-[min(95vw,580px)]
      animate-in slide-in-from-bottom-4 duration-200 pointer-events-auto
    ">
      {/* Header row */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-purple-500 dark:text-purple-400 font-mono select-none">
          ∑ Math Symbols
        </span>
        <button
          onClick={() => setTool('select')}
          title="Close"
          className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-all"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Symbols — wraps cleanly on all screen sizes */}
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
