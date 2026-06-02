import { useBoardStore } from '../store/boardStore';

// All math symbols in one flat list for a compact horizontal bar
const ALL_SYMBOLS = [
  // Operators
  '+', '−', '×', '÷', '=', '≠',
  // Comparison
  '<', '>', '≤', '≥',
  // Geometry & Algebra
  '√', 'π', 'θ', '°', '%',
  // Advanced
  '∞', '∑', '∫', 'Δ', 'α', 'β', 'γ', 'λ',
  // Fractions & More
  '½', '¼', '¾', '²', '³', '±',
];

export default function MathToolbar() {
  const { tool, addObject, textColor, textFont, scale, position } = useBoardStore();

  // Only render when math tool is active
  if (tool !== 'math') return null;

  const handleSymbolClick = (symbol) => {
    // Try to insert into any focused text editor first
    const event = new CustomEvent('insert-math-symbol', { detail: { symbol } });
    window.dispatchEvent(event);

    // Fall back: create a text object at canvas center
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
  };

  return (
    <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-2xl shadow-2xl border border-zinc-200/50 dark:border-zinc-800/50 px-3 py-2 flex items-center gap-1 flex-wrap justify-center max-w-[90vw] animate-in slide-in-from-bottom-4 duration-200 pointer-events-auto">
      {/* Label */}
      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-500 dark:text-purple-400 font-mono mr-1 select-none">
        ∑ Math
      </span>
      <div className="w-[1px] h-4 bg-zinc-200 dark:bg-zinc-700 mr-1" />

      {/* Flat list of symbol buttons */}
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
          className="w-8 h-8 flex items-center justify-center text-base font-medium font-sans text-zinc-800 dark:text-zinc-200 hover:bg-purple-600 hover:text-white rounded-lg transition-all active:scale-95 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/50 shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing"
        >
          {sym}
        </button>
      ))}
    </div>
  );
}
